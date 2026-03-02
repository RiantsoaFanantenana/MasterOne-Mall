// services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { UserRole } from '../components/login-modal.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSignal = signal<boolean>(false);
  private userRoleSignal = signal<UserRole>('client');
  
  // Exposer en lecture seule
  isLoggedIn = this.isLoggedInSignal.asReadonly();
  userRole = this.userRoleSignal.asReadonly();

  constructor() {
    // Initialiser l'état au démarrage
    this.checkAuthStatus();
    
    // Écouter les changements du localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_token' || event.key === 'isLoggedIn' || event.key === 'userRole') {
        console.log('🔐 AuthService - storage event detected:', event.key);
        this.checkAuthStatus();
      }
    });
  }
      
  checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    const isLoggedInFlag = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole') as UserRole | null;
    
    const isAuth = !!token || isLoggedInFlag;
    
    console.log('🔐 AuthService - checkAuthStatus:', { 
      isAuth, 
      hasToken: !!token,
      isLoggedInFlag,
      userRole
    });
    
    this.isLoggedInSignal.set(isAuth);
    
    if (userRole) {
      this.userRoleSignal.set(userRole);
    }
  }

  setLoggedIn(value: boolean, role?: UserRole) {
    console.log('🔐 AuthService - setLoggedIn:', { value, role });
    
    if (value) {
      localStorage.setItem('isLoggedIn', 'true');
      if (role) {
        localStorage.setItem('userRole', role);
        this.userRoleSignal.set(role);
      }
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('auth_token');
      this.userRoleSignal.set('client');
    }
    
    this.isLoggedInSignal.set(value);
  }

  // Méthode appelée après un login réussi
  login(role: UserRole, token?: string) {
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    this.setLoggedIn(true, role);
  }

  logout() {
    this.setLoggedIn(false);
  }

  // Méthodes utilitaires
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRole(): UserRole {
    return this.userRoleSignal() || (localStorage.getItem('userRole') as UserRole) || 'client';
  }

  /**
   * Récupère l'ID de l'utilisateur depuis le token JWT
   * @returns L'ID utilisateur ou null si non connecté
   */
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      // Décoder le payload du token (partie du milieu)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔐 AuthService - getUserId from token:', payload);
      
      // Retourner l'ID selon le format du token
      return payload.userId || payload.id || payload.sub || payload.email || null;
    } catch (e) {
      console.error('❌ AuthService - Error decoding token:', e);
      return null;
    }
  }

  /**
   * Récupère l'email de l'utilisateur depuis le token
   * @returns L'email ou null si non disponible
   */
  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || null;
    } catch (e) {
      console.error('❌ AuthService - Error decoding token:', e);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSignal() || !!localStorage.getItem('auth_token');
  }

  getValue(): boolean {
    return this.isLoggedInSignal();
  }
}