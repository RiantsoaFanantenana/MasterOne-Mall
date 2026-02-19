
import { Component, AfterViewInit, ElementRef, inject, signal, effect, OnInit, Input, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopListComponent } from './components/shop-list.component.ts';
// Import correct types from central types.ts to ensure property matching
import { ShopType, ShopProfile } from '../../types.ts';
import { ShopDetailsComponent, ShopReview } from './components/shop-details.component.ts';
import { ShopItemComponent } from './components/shop-item.component.ts';
import { FooterComponent } from './components/footer.component.ts';
import { ShopCarouselComponent } from './components/shop-carousel.component.ts';
import { MasterDataService } from '../../services/master-data.service.ts';

@Component({
  selector: 'app-client-shops-view',
  standalone: true,
  imports: [CommonModule, ShopListComponent, ShopDetailsComponent, ShopItemComponent, ShopCarouselComponent, FooterComponent],
  template: `
    <div class="bg-white min-h-screen flex flex-col motion-slide-in">
      <div class="flex-1">

        <!-- DETAIL VIEW -->
        <app-shop-details
          *ngIf="selectedShop()"
          [shop]="selectedShop()!"
          [shops]="allShops"
          [events]="getEventsForShop(selectedShop()?.user_id)"
          [discounts]="getDiscountsForShop(selectedShop()?.user_id)"
          [reviews]="getReviewsForShop(selectedShop()?.user_id)"
          [isLoggedIn]="isLoggedIn"
          [isFavorite]="isShopFavorite(selectedShop()?.user_id)"
          (back)="handleBackToDirectory()"
          (onFavoriteToggle)="toggleFavorite(selectedShop()?.user_id)"
        ></app-shop-details>

        <!-- LIST VIEW CONTAINER -->
        <ng-container *ngIf="!selectedShop()">

          <!-- If logged in but no favorites -->
          <div *ngIf="isLoggedIn && favorites().size === 0" class="bg-gray-100 py-16 text-center">
            <div class="max-w-2xl mx-auto px-4">
              <div class="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h3>
              <p class="text-gray-600 mb-6">Click the heart icon on any boutique to add it to your favorites</p>
              <button (click)="addTestFavorites()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                Add Sample Favorites (for testing)
              </button>
            </div>
          </div>

          <!-- MAIN DIRECTORY -->
          <app-shop-list 
            [shopTypes]="shopTypes" 
            [shops]="allShops"
            [isLoggedIn]="isLoggedIn"
            [favorites]="favorites()"
            (onSelect)="handleShopSelect($event)"
            (onFavoriteToggle)="toggleFavorite($event)"
          ></app-shop-list>
        </ng-container>

      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class ClientShopsViewComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() isLoggedIn: boolean = false;
  private el = inject(ElementRef);
  private data = inject(MasterDataService);
  selectedShop = signal<ShopProfile | null>(null);
  
  favorites = signal<Set<number>>(new Set([10, 11]));

  favoriteShops = computed(() => {
    return this.allShops.filter(s => this.favorites().has(s.user_id));
  });

  constructor() {
    effect(() => {
      const shop = this.selectedShop();
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
      
      setTimeout(() => {
        this.initRevealObserver();
        if (shop) window.scrollTo({ top: 0, behavior: 'instant' });
      }, 100);
    });
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shopId');
    if (shopId) {
      const found = this.allShops.find(s => s.user_id.toString() === shopId);
      if (found) {
        this.selectedShop.set(found);
        // Set the correct found profile to the service signal
        this.data.clientActiveShop.set(found);
      }
    }
  }

  addTestFavorites() { this.favorites.set(new Set([10, 11, 12, 13])); }
  clearFavorites() { this.favorites.set(new Set()); }
  isShopFavorite(userId: number | undefined) { return userId ? this.favorites().has(userId) : false; }

  toggleFavorite(userId: number | undefined) {
    if (!userId) return;
    this.favorites.update(prev => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  ngAfterViewInit() { this.initRevealObserver(); }

  private initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.05, rootMargin: '20px' });
    const reveals = this.el.nativeElement.querySelectorAll('.reveal');
    reveals.forEach((r: HTMLElement) => observer.observe(r));
  }

  handleShopSelect(shop: ShopProfile) {
    this.selectedShop.set(shop);
    // Passing correctly typed ShopProfile to shared signal
    this.data.clientActiveShop.set(shop);
  }

  handleBackToDirectory() {
    this.selectedShop.set(null);
    this.data.clientActiveShop.set(null);
  }

  shopTypes: ShopType[] = [
    { id: 1, type_name: 'Fashion & Luxury' },
    { id: 2, type_name: 'Jewelry' },
    { id: 3, type_name: 'Gastronomy' },
    { id: 4, type_name: 'Beauty' }
  ];

  // Added required subscription_status to fix missing property errors in ShopProfile
  allShops: ShopProfile[] = [
    { user_id: 10, id_type: 1, id_box: 'BOX-C1', shop_name: 'Elysian Garments', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EG', cover_pic: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200', description: 'The pinnacle of French luxury fashion. Every stitch tells a story of heritage and innovation.', subscription_status: 'premium' },
    { user_id: 11, id_type: 2, id_box: 'BOX-B5', shop_name: 'Stellar Gems', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SG', cover_pic: 'https://images.unsplash.com/photo-1573408339311-259bfa032d31?auto=format&fit=crop&q=80&w=1200', description: 'Rare stones and bespoke jewelry design for those who appreciate true brilliance.', subscription_status: 'premium' },
    { user_id: 12, id_type: 3, id_box: 'BOX-A2', shop_name: 'L\'Art du Chocolat', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AC', cover_pic: 'https://images.unsplash.com/photo-1548907040-4baa42d100c9?auto=format&fit=crop&q=80&w=1200', description: 'An odyssey of taste through cocoa beans selected from the world\'s most prestigious plantations.', subscription_status: 'standard' },
    { user_id: 13, id_type: 4, id_box: 'BOX-A6', shop_name: 'Velvet Skin', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VS', cover_pic: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200', description: 'Exclusive beauty rituals and advanced skincare treatments in a sanctuary of peace.', subscription_status: 'standard' }
  ];

  getEventsForShop(userId: number | undefined) {
    if (userId === undefined) return [];
    const allEvents = [
      { id: 101, shop_id: 10, title: 'Winter Gala Night', description: 'Exclusive unveiling of the midnight collection.', start_date: '2024-12-01', end_date: '2024-12-02', is_public: false, created_at: '2024-11-01', status: 'published' },
      { id: 102, shop_id: 10, title: 'Designer Workshop', description: 'Learn the art of drape with our head designer.', start_date: '2024-12-15', end_date: '2024-12-15', is_public: true, created_at: '2024-11-05', status: 'published' }
    ];
    return allEvents.filter(e => e.shop_id === userId);
  }

  getDiscountsForShop(userId: number | undefined) {
    if (userId === undefined) return [];
    const allDiscounts = [
      { id: 201, shop_id: 10, title: 'Lumina Welcome', description: 'Special first-purchase offer for members.', value: '15%', start_date: '2024-11-01', end_date: '2024-12-31', status: 'active', created_at: '2024-10-25' }
    ];
    return allDiscounts.filter(d => d.shop_id === userId);
  }

  getReviewsForShop(userId: number | undefined): ShopReview[] {
    if (userId === undefined) return [];
    const allReviews: (ShopReview & { shop_user_id: number })[] = [
      { id: 1, shop_user_id: 10, create_at: '2024-10-15', shop_id: 'BOX-C1', client_id: 'Julian R.', description: 'The tailoring is world-class. A truly Parisian experience.', stars: 10 },
      { id: 2, shop_user_id: 10, create_at: '2024-11-02', shop_id: 'BOX-C1', client_id: 'Elena M.', description: 'Attentive service and beautiful showroom.', stars: 9 }
    ];
    return allReviews.filter(r => r.shop_user_id === userId);
  }
}
