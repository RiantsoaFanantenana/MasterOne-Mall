// services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { env } from '../env';

// ==================== INTERFACES EXISTANTES ====================

export interface AuthResponse {
  token: string;
}


export interface RegisterRequest {
  email: string;
  password: string;
  userName?: string;  // Optionnel pour compatibilité
  name?: string;      // Optionnel pour compatibilité
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterShopRequest {
  shopName: string;
  email: string;
  shopType: string;
  duration: number;
  startDate: string;
  boxId: string;
}

export interface ConfigureShopRequest {
  user: string;
  newPassword: string;
  logo: string;
  coverPic: string;
  description: string;
}

export interface UnconfiguredShopsResponse {
  status: string;
  message: string;
}

export interface RevenuesExpendituresResponse {
  totalExpenditure: number;
  totalRevenue: number;
}

export interface CategoryAmount {
  _id: string;
  totalAmount: string;
}

export interface ShopContract {
  shop: {
    user: string;
    shopType: string;
    box: string;
    shopName: string;
  };
  startDate: string;
  duration: number;
  endDate: string;
}

export interface PayChargesRequest {
  periods: {
    month: number;
    year: number;
  }[];
  chargesIds: string[];
}

export interface CreateCouponRequest {
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventDate: string;
  location: string;
}

export interface ContractEndingSoonResponse {
  shop: {
    shopName: string;
    box: string;
  };
  startDate: string;
  duration: number;
  endDate: string;
}

// ==================== NOUVELLES INTERFACES ====================

export interface SearchShopsResponse {
  id: number;
  shopName: string;
  shopType: string;
  box: string;
  logo: string;
  description: string;
  rating?: number;
}

export interface ShopProfileResponse {
  id: number;
  shopName: string;
  email: string;
  shopType: string;
  description: string;
  logo: string;
  coverPic: string;
  box: string;
  floor: number;
  rating: number;
  totalReviews: number;
}

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  shopId: number;
  shopName: string;
  isPublic: boolean;
  status: 'published' | 'draft' | 'cancelled';
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  clientId: number;
  clientName: string;
  shopId: number;
  date: string;
  reply?: string;
}

export interface PostReviewRequest {
  rating: number;
  comment: string;
}

export interface WalletResponse {
  balance: number;
  points: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  status: 'pending' | 'completed';
}

export interface FavoriteResponse {
  shopId: number;
  shopName: string;
  logo: string;
  addedAt: string;
}

export interface ConfigurationResponse {
  status: string;
  data: any;
}

// Interface pour décoder le token JWT
interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = env.apiUrl || 'http://localhost:3000/api';
  private tokenKey = 'auth_token';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ==================== GESTION DU TOKEN ====================

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      console.log('Decoded token payload:', decoded);
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  private getRoleFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.role || null;
  }

  private getUserIdFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.userId || null;
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }

  private mapApiRoleToAppRole(apiRole: string | null): 'client' | 'shop' | 'admin' {
    console.log('Mapping API role:', apiRole);
    
    switch (apiRole?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return 'admin';
      case 'shop':
      case 'boutique':
      case 'store':
        return 'shop';
      case 'client':
      case 'visitor':
      case 'customer':
        return 'client';
      default:
        return 'client';
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    
    const role = this.getRoleFromToken(token);
    console.log('Role extracted from token:', role);
    
    const userRole = this.mapApiRoleToAppRole(role);
    
    this.authService.login(userRole);
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authService.logout();
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  public getUserRole(): 'client' | 'shop' | 'admin' {
    const token = this.getToken();
    if (token) {
      const role = this.getRoleFromToken(token);
      if (role) {
        return this.mapApiRoleToAppRole(role);
      }
    }
    
    return this.authService.getRole();
  }

  public getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    return this.getUserIdFromToken(token);
  }

  public hasRole(role: 'client' | 'shop' | 'admin'): boolean {
    return this.getUserRole() === role;
  }

  public isAdmin(): boolean {
    return this.hasRole('admin');
  }

  public isShop(): boolean {
    return this.hasRole('shop');
  }

  public isClient(): boolean {
    return this.hasRole('client');
  }

  private createHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);

    let errorMessage = 'Une erreur est survenue';
    let errorStatus = error.status;
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      errorMessage = error.error?.message || `Code erreur: ${error.status}`;
      errorStatus = error.status;
      
      switch (error.status) {
        case 401:
          // Ne pas déconnecter automatiquement pour 401 sur login
          if (!error.url?.includes('/auth/login')) {
            this.logout();
          }
          errorMessage = error.error?.message || 'Invalid credentials';
          break;
        case 403:
          errorMessage = error.error?.message || 'Accès non autorisé';
          break;
        case 404:
          errorMessage = error.error?.message || 'User not found';
          break;
        case 500:
          errorMessage = 'Erreur serveur';
          break;
      }
    }

    // Ajouter le status code à l'erreur pour pouvoir le détecter dans le composant
    return throwError(() => ({ 
      message: errorMessage, 
      status: errorStatus 
    }));
  }

  // ==================== AUTHENTIFICATION ====================

  public register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  public login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          if (response.token) {
            this.setToken(response.token);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // ==================== ADMINISTRATION ====================

  public registerShop(data: RegisterShopRequest): Observable<any> {
    if (!this.isAdmin()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux administrateurs'));
    }

    return this.http.post(
      `${this.apiUrl}/admin/register-shop`, 
      data,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  public acceptPayment(paymentId: string): Observable<any> {
    if (!this.isAdmin()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux administrateurs'));
    }

    return this.http.get(
      `${this.apiUrl}/admin/accept-payement/${paymentId}`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  public getContractsEndingSoon(daysBeforeEnd: number = 7): Observable<ContractEndingSoonResponse[]> {
    if (!this.isAdmin()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux administrateurs'));
    }

    const params = new HttpParams().set('daysBeforeEnd', daysBeforeEnd.toString());

    return this.http.get<ContractEndingSoonResponse[]>(
      `${this.apiUrl}/admin/alert-contracts-ending-soon`,
      { 
        headers: this.createHeaders(),
        params 
      }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  // ==================== GESTION DES SHOPS ====================

  public configureShop(data: ConfigureShopRequest): Observable<any> {
    if (!this.isShop()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux boutiques'));
    }

    return this.http.patch(
      `${this.apiUrl}/shop/configure`,
      data,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  public logUnconfiguredShops(): Observable<UnconfiguredShopsResponse> {
    if (!this.isAdmin()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux administrateurs'));
    }

    return this.http.post<UnconfiguredShopsResponse>(
      `${this.apiUrl}/shop/log-unconfigured`,
      {},
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  // ==================== PAIEMENT DES CHARGES ====================

  public payCharges(data: PayChargesRequest): Observable<any> {
    if (!this.isShop()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux boutiques'));
    }

    return this.http.post(
      `${this.apiUrl}/shop/pay`,
      data,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  // ==================== GESTION DES COUPONS ====================

  public createCoupon(data: CreateCouponRequest): Observable<any> {
    if (!this.isShop()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux boutiques'));
    }

    return this.http.post(
      `${this.apiUrl}/shop/create-coupon`,
      data,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  // ==================== GESTION DES ÉVÉNEMENTS ====================

  public createEvent(data: CreateEventRequest): Observable<any> {
    if (!this.isShop()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux boutiques'));
    }

    return this.http.post(
      `${this.apiUrl}/shop/create-event`,
      data,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  // ==================== DONNÉES DASHBOARD ====================

  public getRevenuesExpenditures(): Observable<RevenuesExpendituresResponse> {
    if (!this.isAdmin()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux administrateurs'));
    }

    return this.http.get<RevenuesExpendituresResponse>(
      `${this.apiUrl}/admin/revenues-expenditures`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  public getRevenuesDetails(): Observable<CategoryAmount[]> {
    if (!this.isAdmin()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux administrateurs'));
    }

    return this.http.get<CategoryAmount[]>(
      `${this.apiUrl}/admin/revenues-details`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  public getExpendituresDetails(): Observable<CategoryAmount[]> {
    if (!this.isAdmin()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux administrateurs'));
    }

    return this.http.get<CategoryAmount[]>(
      `${this.apiUrl}/admin/expenditures-details`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  public getShopsCloseContractEnd(daysBeforeEnd: number = 7): Observable<ShopContract[]> {
    if (!this.isAdmin()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux administrateurs'));
    }

    const params = new HttpParams().set('daysBeforeEnd', daysBeforeEnd.toString());

    return this.http.get<ShopContract[]>(
      `${this.apiUrl}/admin/shops-close-contract-end`,
      { 
        headers: this.createHeaders(),
        params 
      }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  // ==================== ROUTES GÉNÉRALES (AUTHENTIFIÉES) ====================

  /**
   * Rechercher des boutiques
   * Accessible à tous les utilisateurs authentifiés
   */
  public searchShops(query: string, type?: string): Observable<SearchShopsResponse[]> {
    let params = new HttpParams().set('q', query);
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<SearchShopsResponse[]>(
      `${this.apiUrl}/shops/search`,
      { 
        headers: this.createHeaders(),
        params 
      }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Récupérer le profil d'une boutique
   * Accessible à tous les utilisateurs authentifiés
   */
  public getShopProfile(shopId: number): Observable<ShopProfileResponse> {
    return this.http.get<ShopProfileResponse>(
      `${this.apiUrl}/shops/${shopId}`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Récupérer les boutiques d'un groupe
   * Accessible à tous les utilisateurs authentifiés
   */
  public getShopsByGroup(groupName: string): Observable<SearchShopsResponse[]> {
    return this.http.get<SearchShopsResponse[]>(
      `${this.apiUrl}/shops/group/${groupName}`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Récupérer tous les événements
   * Accessible à tous les utilisateurs authentifiés
   */
  public getAllEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(
      `${this.apiUrl}/events`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Récupérer les avis d'une boutique
   * Accessible à tous les utilisateurs authentifiés
   */
  public getShopReviews(shopId: number): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(
      `${this.apiUrl}/shops/${shopId}/reviews`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Récupérer les événements d'une boutique
   * Accessible à tous les utilisateurs authentifiés
   */
  public getShopEvents(shopId: number): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(
      `${this.apiUrl}/shops/${shopId}/events`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  // ==================== ROUTES CLIENT ====================

  /**
   * Utiliser un coupon promotionnel
   * Réservé aux clients
   */
  public redeemCoupon(shopId: number, code: string): Observable<any> {
    if (!this.isClient()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux clients'));
    }

    return this.http.get(
      `${this.apiUrl}/client/redeem-coupon/${shopId}/${code}`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Consulter le portefeuille du client
   * Réservé aux clients
   */
  public getWallet(): Observable<WalletResponse> {
    if (!this.isClient()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux clients'));
    }

    return this.http.get<WalletResponse>(
      `${this.apiUrl}/client/wallet`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Publier un avis sur une boutique
   * Réservé aux clients
   */
  public postReview(shopId: number, review: PostReviewRequest): Observable<any> {
    if (!this.isClient()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux clients'));
    }

    return this.http.post(
      `${this.apiUrl}/client/post-review/${shopId}`,
      review,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Récupérer les boutiques favorites du client
   * Réservé aux clients
   */
  public getFavorites(): Observable<FavoriteResponse[]> {
    if (!this.isClient()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux clients'));
    }

    return this.http.get<FavoriteResponse[]>(
      `${this.apiUrl}/client/get-favorites`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Ajouter une boutique aux favoris
   * Réservé aux clients
   */
  public addShopToFavorites(shopId: number): Observable<any> {
    if (!this.isClient()) {
      return throwError(() => new Error('Accès non autorisé - Réservé aux clients'));
    }

    return this.http.post(
      `${this.apiUrl}/client/add-shop-favorite/${shopId}`,
      {},
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }

  // ==================== ROUTES DE CONFIGURATION ====================

  /**
   * Récupérer les données d'une table de configuration
   * Accessible aux admins, shops et clients authentifiés
   */
  public getConfiguration(tableName: string): Observable<ConfigurationResponse> {
    return this.http.get<ConfigurationResponse>(
      `${this.apiUrl}/configurations/${tableName}`,
      { headers: this.createHeaders() }
    ).pipe(catchError(this.handleError.bind(this)));
  }
}