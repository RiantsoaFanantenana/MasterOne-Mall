// pages/client/client-shops-view.component.ts
import { Component, AfterViewInit, ElementRef, inject, signal, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShopListComponent } from './components/shop-list.component';
import { ShopType, ShopProfile } from '../../types';
import { ShopDetailsComponent, ShopReview } from './components/shop-details.component';
import { FooterComponent } from './components/footer.component';
import { MasterDataService } from '../../services/master-data.service';
import { ApiService, SearchShopsResponse, ShopProfileResponse, EventResponse, ReviewResponse } from '../../services/api.service';
import { AuthService } from '../../services/auth.service'; // ← IMPORT AJOUTÉ

// ==================== MOCK DATA (fallback quand API échoue) ====================
const MOCK_SHOP_TYPES: ShopType[] = [
  { id: 1, type_name: 'Fashion & Luxury' },
  { id: 2, type_name: 'Jewelry' },
  { id: 3, type_name: 'Gastronomy' },
  { id: 4, type_name: 'Beauty' }
];

const MOCK_SHOPS: ShopProfile[] = [
  { 
    user_id: 10, 
    id_type: 1, 
    id_box: 'BOX-C1', 
    shop_name: 'Elysian Garments', 
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EG', 
    cover_pic: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200', 
    description: 'The pinnacle of French luxury fashion. Every stitch tells a story of heritage and innovation.', 
    subscription_status: 'premium' as const 
  },
  { 
    user_id: 11, 
    id_type: 2, 
    id_box: 'BOX-B5', 
    shop_name: 'Stellar Gems', 
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SG', 
    cover_pic: 'https://images.unsplash.com/photo-1573408339311-259bfa032d31?auto=format&fit=crop&q=80&w=1200', 
    description: 'Rare stones and bespoke jewelry design for those who appreciate true brilliance.', 
    subscription_status: 'premium' as const 
  },
  { 
    user_id: 12, 
    id_type: 3, 
    id_box: 'BOX-A2', 
    shop_name: 'L\'Art du Chocolat', 
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AC', 
    cover_pic: 'https://images.unsplash.com/photo-1548907040-4baa42d100c9?auto=format&fit=crop&q=80&w=1200', 
    description: 'An odyssey of taste through cocoa beans selected from the world\'s most prestigious plantations.', 
    subscription_status: 'standard' as const 
  },
  { 
    user_id: 13, 
    id_type: 4, 
    id_box: 'BOX-A6', 
    shop_name: 'Velvet Skin', 
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VS', 
    cover_pic: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200', 
    description: 'Exclusive beauty rituals and advanced skincare treatments in a sanctuary of peace.', 
    subscription_status: 'standard' as const 
  }
];

const MOCK_REVIEWS: ShopReview[] = [
  { id: 1, create_at: '2024-10-15', shop_id: 'BOX-C1', client_id: 'Julian R.', description: 'The tailoring is world-class. A truly Parisian experience.', stars: 10 },
  { id: 2, create_at: '2024-11-02', shop_id: 'BOX-C1', client_id: 'Elena M.', description: 'Attentive service and beautiful showroom.', stars: 9 },
  { id: 3, create_at: '2024-11-15', shop_id: 'BOX-B5', client_id: 'Marcus W.', description: 'Exceptional craftsmanship. Found the perfect anniversary gift.', stars: 10 }
];

const MOCK_EVENTS = [
  { id: 101, shop_id: 10, title: 'Winter Gala Night', description: 'Exclusive unveiling of the midnight collection.', start_date: '2024-12-01', end_date: '2024-12-02', is_public: false, created_at: '2024-11-01', status: 'published' },
  { id: 102, shop_id: 10, title: 'Designer Workshop', description: 'Learn the art of drape with our head designer.', start_date: '2024-12-15', end_date: '2024-12-15', is_public: true, created_at: '2024-11-05', status: 'published' }
];

const MOCK_DISCOUNTS = [
  { id: 201, shop_id: 10, title: 'Lumina Welcome', description: 'Special first-purchase offer for members.', value: '15%', start_date: '2024-11-01', end_date: '2024-12-31', status: 'active', created_at: '2024-10-25' }
];

@Component({
  selector: 'app-client-shops-view',
  standalone: true,
  imports: [CommonModule, ShopListComponent, ShopDetailsComponent, FooterComponent],
  template: `
    <!-- Debug indicator (à retirer plus tard) -->
    <div class="fixed top-20 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-xl text-[10px] font-black">
      Auth: {{ authService.isLoggedIn() ? '✅ YES' : '❌ NO' }}
    </div>

    <div class="bg-white min-h-screen flex flex-col motion-slide-in">
      <!-- Loading State -->
      <div *ngIf="isLoading()" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-lumina-rust border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p class="text-[10px] font-black uppercase tracking-widest text-lumina-olive">Loading Boutiques...</p>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage()" class="bg-lumina-rust/10 border border-lumina-rust/20 p-6 rounded-3xl text-center mx-8 mt-8">
        <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMessage() }}</p>
        <button (click)="retryLoading()" class="mt-4 px-6 py-2 bg-lumina-rust text-white rounded-xl text-[9px] font-black uppercase">
          Retry
        </button>
      </div>

      <div class="flex-1">
        <!-- DETAIL VIEW -->
        <app-shop-details
          *ngIf="selectedShop()"
          [shop]="selectedShop()!"
          [shops]="allShops()"
          [events]="selectedShopEvents()"
          [discounts]="selectedShopDiscounts()"
          [reviews]="reviewsForSelectedShop()"
          [isLoggedIn]="authService.isLoggedIn()"
          [isFavorite]="isShopFavorite(selectedShop()?.user_id)"
          (back)="handleBackToDirectory()"
          (onFavoriteToggle)="toggleFavorite(selectedShop()?.user_id)"
          (reviewAdded)="addReviewToShop($event)"
        ></app-shop-details>

        <!-- LIST VIEW CONTAINER -->
        <ng-container *ngIf="!selectedShop()">
          <!-- MAIN DIRECTORY -->
          <app-shop-list 
            [shopTypes]="shopTypes()" 
            [shops]="filteredShops()"
            [isLoggedIn]="authService.isLoggedIn()"
            [favorites]="favorites()"
            [isLoading]="isLoading()"
            (onSelect)="handleShopSelect($event)"
            (onFavoriteToggle)="toggleFavorite($event)"
            (onSearch)="handleSearch($event)"
            (onTypeFilter)="handleTypeFilter($event)"
          ></app-shop-list>
        </ng-container>

      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class ClientShopsViewComponent implements OnInit, AfterViewInit {
  private el = inject(ElementRef);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private data = inject(MasterDataService);
  public authService = inject(AuthService); // ← Injection du service d'auth
  
  // États
  selectedShop = signal<ShopProfile | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  
  // Données
  allShops = signal<ShopProfile[]>([]);
  shopTypes = signal<ShopType[]>([]);
  favorites = signal<Set<number>>(new Set());
  
  // Données associées aux shops
  shopsEvents = signal<Map<number, any[]>>(new Map());
  shopsDiscounts = signal<Map<number, any[]>>(new Map());
  allReviews = signal<ShopReview[]>([]);
  
  // Recherche et filtres
  searchQuery = signal<string>('');
  selectedType = signal<number | null>(null);

  // Computed pour les événements/discounts du shop sélectionné
  selectedShopEvents = computed(() => {
    const shop = this.selectedShop();
    if (!shop) return [];
    return this.shopsEvents().get(shop.user_id) || [];
  });

  selectedShopDiscounts = computed(() => {
    const shop = this.selectedShop();
    if (!shop) return [];
    return this.shopsDiscounts().get(shop.user_id) || [];
  });

  // Shops filtrés
  filteredShops = computed(() => {
    let shops = this.allShops();
    const query = this.searchQuery().toLowerCase();
    const typeId = this.selectedType();
    
    if (query) {
      shops = shops.filter(s => 
        s.shop_name.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query)
      );
    }
    
    if (typeId) {
      shops = shops.filter(s => s.id_type === typeId);
    }
    
    return shops;
  });

  // Reviews pour la boutique sélectionnée
  reviewsForSelectedShop = computed(() => {
    const shop = this.selectedShop();
    if (!shop) return [];
    return this.allReviews().filter(r => r.shop_id === shop.id_box);
  });

  constructor() {
    // Effet pour charger les données quand l'utilisateur se connecte
    effect(() => {
      if (this.authService.isLoggedIn()) {
        console.log('User logged in, loading favorites and wallet...');
        this.loadFavorites();
        this.loadWallet();
      } else {
        // Réinitialiser les favoris quand l'utilisateur se déconnecte
        this.favorites.set(new Set());
      }
    });
  }

  ngOnInit() {
    this.loadInitialData();
    
    // Vérifier si un shop est sélectionné dans l'URL
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shopId');
    if (shopId) {
      this.loadShopById(parseInt(shopId));
    }
  }

  ngAfterViewInit() {
    this.initRevealObserver();
  }

  // ==================== CHARGEMENT DES DONNÉES ====================

  private loadInitialData() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    Promise.all([
      this.loadShopTypes(),
      this.loadAllShops(),
      this.loadMockReviews() // Charger les mock reviews par défaut
    ]).catch(error => {
      console.error('Error loading initial data:', error);
      this.errorMessage.set('Failed to load boutiques. Please try again.');
    }).finally(() => {
      this.isLoading.set(false);
    });
  }

  private loadShopTypes(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getConfiguration('shopTypes').subscribe({
        next: (response) => {
          if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
            this.shopTypes.set(response.data);
          } else {
            console.log('No shop types from API, using mock data');
            this.shopTypes.set(MOCK_SHOP_TYPES);
          }
          resolve();
        },
        error: (error) => {
          console.error('Error loading shop types:', error);
          this.shopTypes.set(MOCK_SHOP_TYPES);
          resolve();
        }
      });
    });
  }

  private loadAllShops(): Promise<void> {
    return new Promise((resolve) => {
      // Utiliser searchShops avec une chaîne vide pour tout récupérer
      this.apiService.searchShops('').subscribe({
        next: (shops: SearchShopsResponse[]) => {
          if (shops && shops.length > 0) {
            console.log('Shops loaded from API:', shops);
            // Transformer les données API en ShopProfile avec typage correct
            const mappedShops: ShopProfile[] = shops.map((shop: SearchShopsResponse) => ({
              user_id: shop.id,
              id_type: 1, // À mapper correctement selon votre API
              id_box: shop.box || 'BOX-00',
              shop_name: shop.shopName,
              logo: shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.shopName}`,
              cover_pic: '', // L'API ne fournit pas coverPic dans search
              description: shop.description || 'Luxury boutique at MasterOne Mall',
              subscription_status: 'standard' as const
            }));
            this.allShops.set(mappedShops);
            
            // Charger les détails pour chaque shop (coverPic, etc.)
            mappedShops.forEach(shop => {
              this.loadShopDetails(shop.user_id);
            });
          } else {
            console.log('No shops from API (empty array), using mock data');
            this.useMockData();
          }
          resolve();
        },
        error: (error) => {
          console.error('Error loading shops, using mock data:', error);
          this.useMockData();
          resolve();
        }
      });
    });
  }

  private loadMockReviews(): Promise<void> {
    return new Promise((resolve) => {
      this.allReviews.set(MOCK_REVIEWS);
      resolve();
    });
  }

  private loadShopDetails(shopId: number) {
    this.apiService.getShopProfile(shopId).subscribe({
      next: (shop: ShopProfileResponse) => {
        this.allShops.update(shops => 
          shops.map(s => 
            s.user_id === shopId 
              ? { 
                  ...s, 
                  cover_pic: shop.coverPic || s.cover_pic,
                  description: shop.description || s.description,
                  id_type: Number(shop.shopType) || s.id_type
                }
              : s
          )
        );
        
        // Charger les événements et reviews du shop
        this.loadShopEvents(shopId);
        this.loadShopReviews(shopId);
      },
      error: (error) => {
        console.error(`Error loading details for shop ${shopId}:`, error);
      }
    });
  }

  private loadShopEvents(shopId: number) {
    this.apiService.getShopEvents(shopId).subscribe({
      next: (events: EventResponse[]) => {
        if (events && events.length > 0) {
          this.shopsEvents.update(map => {
            const newMap = new Map(map);
            newMap.set(shopId, events);
            return newMap;
          });
        } else {
          // Fallback sur les mock events
          const mockEvents = MOCK_EVENTS.filter(e => e.shop_id === shopId);
          if (mockEvents.length > 0) {
            this.shopsEvents.update(map => {
              const newMap = new Map(map);
              newMap.set(shopId, mockEvents);
              return newMap;
            });
          }
        }
      },
      error: (error) => {
        console.error(`Error loading events for shop ${shopId}:`, error);
        // Fallback sur les mock events
        const mockEvents = MOCK_EVENTS.filter(e => e.shop_id === shopId);
        if (mockEvents.length > 0) {
          this.shopsEvents.update(map => {
            const newMap = new Map(map);
            newMap.set(shopId, mockEvents);
            return newMap;
          });
        }
      }
    });
  }

  private loadShopReviews(shopId: number) {
    this.apiService.getShopReviews(shopId).subscribe({
      next: (reviews: ReviewResponse[]) => {
        if (reviews && reviews.length > 0) {
          const mappedReviews: ShopReview[] = reviews.map(r => ({
            id: r.id,
            create_at: r.date,
            shop_id: shopId.toString(),
            client_id: r.clientName,
            description: r.comment,
            stars: r.rating * 2 // Convertir /5 en /10
          }));
          
          this.allReviews.update(current => [...current, ...mappedReviews]);
        }
      },
      error: (error) => {
        console.error(`Error loading reviews for shop ${shopId}:`, error);
        // Les mock reviews sont déjà chargées via loadMockReviews
      }
    });
  }

  private loadShopById(shopId: number) {
    this.isLoading.set(true);
    this.apiService.getShopProfile(shopId).subscribe({
      next: (shop: ShopProfileResponse) => {
        const shopProfile: ShopProfile = {
          user_id: shop.id,
          id_type: Number(shop.shopType) || 1,
          id_box: shop.box || 'BOX-00',
          shop_name: shop.shopName,
          logo: shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.shopName}`,
          cover_pic: shop.coverPic || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
          description: shop.description || 'Luxury boutique at MasterOne Mall',
          subscription_status: 'standard' as const
        };
        this.selectedShop.set(shopProfile);
        this.data.clientActiveShop.set(shopProfile);
        this.updateUrlWithShop(shopProfile);
        
        // Charger les données associées
        this.loadShopEvents(shopId);
        this.loadShopReviews(shopId);
        
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading shop by ID, checking mock data:', error);
        // Chercher dans les mock data
        const mockShop = MOCK_SHOPS.find(s => s.user_id === shopId);
        if (mockShop) {
          console.log('Found shop in mock data:', mockShop);
          this.selectedShop.set(mockShop);
          this.data.clientActiveShop.set(mockShop);
          this.updateUrlWithShop(mockShop);
          
          // Charger les mock events pour ce shop
          const mockEvents = MOCK_EVENTS.filter(e => e.shop_id === shopId);
          if (mockEvents.length > 0) {
            this.shopsEvents.update(map => {
              const newMap = new Map(map);
              newMap.set(shopId, mockEvents);
              return newMap;
            });
          }
        } else {
          this.errorMessage.set('Boutique not found');
        }
        this.isLoading.set(false);
      }
    });
  }

  // ==================== GESTION DES FAVORIS ====================

  private loadFavorites() {
    if (!this.authService.isLoggedIn()) return;
    
    this.apiService.getFavorites().subscribe({
      next: (favorites: any[]) => {
        if (favorites && favorites.length > 0) {
          const favoriteIds = new Set(favorites.map((f: any) => f.shopId));
          this.favorites.set(favoriteIds);
          console.log('Favorites loaded:', favoriteIds);
        } else {
          // Si pas de favoris, on garde le set vide mais on log
          console.log('No favorites found');
          this.favorites.set(new Set());
        }
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.favorites.set(new Set());
      }
    });
  }

  private loadWallet() {
    if (!this.authService.isLoggedIn()) return;
    
    this.apiService.getWallet().subscribe({
      next: (wallet) => {
        console.log('Wallet loaded:', wallet);
        // Mettre à jour le wallet dans MasterDataService
      },
      error: (error) => {
        console.error('Error loading wallet:', error);
      }
    });
  }

  toggleFavorite(userId: number | undefined) {
    if (!userId || !this.authService.isLoggedIn()) return;
    
    const isFavorite = this.favorites().has(userId);
    
    if (isFavorite) {
      // TODO: Ajouter endpoint pour supprimer des favoris si disponible
      this.favorites.update(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
      console.log('Removed from favorites:', userId);
    } else {
      this.apiService.addShopToFavorites(userId).subscribe({
        next: () => {
          this.favorites.update(prev => {
            const next = new Set(prev);
            next.add(userId);
            return next;
          });
          console.log('Added to favorites:', userId);
        },
        error: (error) => {
          console.error('Error adding favorite:', error);
          // Fallback: ajouter quand même localement
          this.favorites.update(prev => {
            const next = new Set(prev);
            next.add(userId);
            return next;
          });
        }
      });
    }
  }

  isShopFavorite(userId: number | undefined): boolean {
    return userId ? this.favorites().has(userId) : false;
  }

  // ==================== GESTION DE LA RECHERCHE ====================

  handleSearch(query: string) {
    this.searchQuery.set(query);
  }

  handleTypeFilter(typeId: number | null) {
    this.selectedType.set(typeId);
  }

  // ==================== GESTION DES SHOPS ====================

  handleShopSelect(shop: ShopProfile) {
    this.selectedShop.set(shop);
    this.data.clientActiveShop.set(shop);
    this.updateUrlWithShop(shop);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  handleBackToDirectory() {
    this.selectedShop.set(null);
    this.data.clientActiveShop.set(null);
    this.updateUrlWithShop(null);
  }

  private updateUrlWithShop(shop: ShopProfile | null) {
    try {
      if (!window.location.protocol.startsWith('blob')) {
        const url = new URL(window.location.href);
        if (shop) {
          url.searchParams.set('shopId', shop.user_id.toString());
        } else {
          url.searchParams.delete('shopId');
        }
        window.history.pushState({}, '', url.toString());
      }
    } catch (e) {
      console.warn('Navigation state update blocked:', e);
    }
  }

  // ==================== GESTION DES REVIEWS ====================

  addReviewToShop(newReview: ShopReview) {
    console.log('➕ Adding review to shop:', newReview);
    
    const shop = this.selectedShop();
    if (!shop) return;
    
    // Ajouter la review localement immédiatement pour l'UX
    this.allReviews.update(reviews => [newReview, ...reviews]);
    
    // Appel API pour poster la review
    this.apiService.postReview(shop.user_id, {
      rating: Math.ceil(newReview.stars / 2), // Convertir /10 en /5
      comment: newReview.description
    }).subscribe({
      next: (response) => {
        console.log('Review posted successfully:', response);
        
        setTimeout(() => {
          const reviewList = document.querySelector('app-shop-reviews-list');
          if (reviewList) {
            reviewList.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      },
      error: (error) => {
        console.error('Error posting review:', error);
        // La review est déjà ajoutée localement, on garde
      }
    });
  }

  // ==================== UTILITAIRES ====================

  useMockData() {
    console.log('Using mock data');
    this.allShops.set(MOCK_SHOPS);
    this.shopTypes.set(MOCK_SHOP_TYPES);
    this.allReviews.set(MOCK_REVIEWS);
    
    // Ajouter les mock events
    MOCK_SHOPS.forEach(shop => {
      const mockEvents = MOCK_EVENTS.filter(e => e.shop_id === shop.user_id);
      if (mockEvents.length > 0) {
        this.shopsEvents.update(map => {
          const newMap = new Map(map);
          newMap.set(shop.user_id, mockEvents);
          return newMap;
        });
      }
    });
  }

  retryLoading() {
    this.loadInitialData();
  }

  private initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { 
        if (entry.isIntersecting) entry.target.classList.add('active'); 
      });
    }, { threshold: 0.05, rootMargin: '20px' });
    
    setTimeout(() => {
      const reveals = this.el.nativeElement.querySelectorAll('.reveal');
      reveals.forEach((r: HTMLElement) => observer.observe(r));
    }, 100);
  }
}