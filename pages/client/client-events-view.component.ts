// pages/client/client-events-view.component.ts
import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FooterComponent } from './components/footer.component';
import { EventItemComponent } from './components/event-item.component';
import { DiscountItemComponent } from './components/discount-item.component';
import { EventDetailsComponent } from './components/event-details.component';
import { EventReview } from './components/event-reviews-list.component';
import { ApiService, EventResponse } from '../../services/api.service';
import { MasterDataService } from '../../services/master-data.service';
import { AuthService } from '../../services/auth.service';

// Interface adaptée à votre API
interface MallEvent {
  id: number;
  shop_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_public: boolean;
  created_at: string;
  status: 'draft' | 'published' | 'archived' | 'cancelled';
  location?: string;
}

interface Discount {
  id: number;
  shop_id: string;
  title: string;
  description: string;
  value: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  discountPercentage?: number;
}

// ==================== MOCK DATA COMPLÈTES ====================
const MOCK_EVENTS: MallEvent[] = [
  { 
    id: 1, 
    shop_id: 'LUXE-01', 
    title: 'Winter Collection Gala', 
    description: 'Experience the unveiling of the most anticipated winter collection of the year.', 
    start_date: '2024-11-20', 
    end_date: '2024-11-22', 
    is_public: false, 
    created_at: '2024-10-01', 
    status: 'published',
    location: 'Mall Central'
  },
  { 
    id: 2, 
    shop_id: 'TECH-12', 
    title: 'Future of Tech Expo', 
    description: 'Dive into the latest innovations in smart home and wearable tech.', 
    start_date: '2024-12-05', 
    end_date: '2024-12-07', 
    is_public: true, 
    created_at: '2024-10-15', 
    status: 'published' 
  },
  { 
    id: 3, 
    shop_id: 'KIDS-05', 
    title: 'Holiday Toy Workshop', 
    description: 'Bring the kids for a day of creativity and fun.', 
    start_date: '2024-12-15', 
    end_date: '2024-12-24', 
    is_public: true, 
    created_at: '2024-11-01', 
    status: 'published' 
  },
  { 
    id: 4, 
    shop_id: 'FOOD-09', 
    title: 'Wine & Cheese Pairing', 
    description: 'Join our sommelier for an evening of exquisite French wine and artisanal cheese pairings.', 
    start_date: '2024-11-28', 
    end_date: '2024-11-28', 
    is_public: false, 
    created_at: '2024-10-20', 
    status: 'published' 
  },
  { 
    id: 5, 
    shop_id: 'LUXE-02', 
    title: 'Midnight Runway', 
    description: 'A nocturnal showcase of avant-garde streetwear.', 
    start_date: '2024-12-10', 
    end_date: '2024-12-10', 
    is_public: false, 
    created_at: '2024-11-05', 
    status: 'published' 
  },
  { 
    id: 6, 
    shop_id: 'ART-01', 
    title: 'Sculpture & Silk', 
    description: 'Modern art meeting traditional textiles.', 
    start_date: '2024-12-12', 
    end_date: '2024-12-15', 
    is_public: true, 
    created_at: '2024-11-08', 
    status: 'published' 
  }
];

const MOCK_DISCOUNTS: Discount[] = [
  { 
    id: 1, 
    shop_id: 'SHOP-01', 
    title: 'Winter Season Opening', 
    description: 'Exclusive early bird discount for our new winter outerwear line.', 
    value: '25%', 
    start_date: '2024-11-01', 
    end_date: '2024-11-30', 
    status: 'Active Deal', 
    created_at: '2024-10-25',
    discountPercentage: 25
  },
  { 
    id: 2, 
    shop_id: 'JEWEL-04', 
    title: 'Lumina Anniversary', 
    description: 'Celebrate our 10th anniversary with rare offers on diamond collections.', 
    value: '15%', 
    start_date: '2024-11-15', 
    end_date: '2024-11-25', 
    status: 'Flash Sale', 
    created_at: '2024-10-28' 
  },
  { 
    id: 3, 
    shop_id: 'SPORT-10', 
    title: 'Performance Weekend', 
    description: '30% off on all athletic footwear.', 
    value: '30%', 
    start_date: '2024-11-23', 
    end_date: '2024-11-24', 
    status: 'Active Deal', 
    created_at: '2024-11-05' 
  },
  { 
    id: 4, 
    shop_id: 'HOME-02', 
    title: 'Artisan Decor Sale', 
    description: 'Buy 1 Get 1 on handcrafted ceramics and home accessories.', 
    value: 'BOGO', 
    start_date: '2024-11-01', 
    end_date: '2024-11-15', 
    status: 'Member Exclusive', 
    created_at: '2024-10-10' 
  },
  { 
    id: 5, 
    shop_id: 'LUXE-05', 
    title: 'Handbag VIP Week', 
    description: 'Members get 40% off on luxury Italian handbags.', 
    value: '40%', 
    start_date: '2024-12-01', 
    end_date: '2024-12-07', 
    status: 'Upcoming', 
    created_at: '2024-11-01' 
  }
];

const MOCK_EVENT_REVIEWS: EventReview[] = [
  { 
    id: 1, 
    create_at: '2024-11-21', 
    event_id: 1, 
    client_id: 'Sophie L.', 
    description: 'Magnificent runway show. The craftsmanship was beyond words.', 
    stars: 10 
  },
  { 
    id: 2, 
    create_at: '2024-11-22', 
    event_id: 1, 
    client_id: 'David P.', 
    description: 'Exclusive and well organized. Lumina really knows how to host.', 
    stars: 9 
  },
  { 
    id: 3, 
    create_at: '2024-12-06', 
    event_id: 2, 
    client_id: 'Marc A.', 
    description: 'Loved the smart home demos. Very inspiring.', 
    stars: 8 
  },
  { 
    id: 4, 
    create_at: '2024-11-29', 
    event_id: 4, 
    client_id: 'Isabelle Q.', 
    description: 'The pairings were sublime. A true gastronomic journey.', 
    stars: 10 
  }
];

@Component({
  selector: 'app-client-events-view',
  standalone: true,
  imports: [CommonModule, FooterComponent, EventItemComponent, DiscountItemComponent, EventDetailsComponent],
  template: `
    <div class="bg-white min-h-screen flex flex-col">
      <!-- Loading State -->
      <div *ngIf="isLoading()" class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-lumina-rust border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p class="text-[10px] font-black uppercase tracking-widest text-lumina-olive">Loading Events...</p>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage()" class="bg-lumina-rust/10 border border-lumina-rust/20 p-6 rounded-3xl text-center mx-8 mt-8">
        <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMessage() }}</p>
        <button (click)="retryLoading()" class="mt-4 px-6 py-2 bg-lumina-rust text-white rounded-xl text-[9px] font-black uppercase">
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && allEvents().length === 0 && !selectedEvent()" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <p class="text-lumina-olive/30 font-black uppercase tracking-widest">No events available</p>
          <button (click)="forceUseMockData()" class="mt-4 px-6 py-2 bg-lumina-rust text-white rounded-xl text-[9px] font-black uppercase">
            Load Mock Data
          </button>
        </div>
      </div>

      <main class="flex-1" *ngIf="allEvents().length > 0 || selectedEvent()">
        
        <!-- List Mode -->
        <ng-container *ngIf="!selectedEvent()">
          <!-- Header Section -->
          <section class="py-20 px-8 md:px-16 max-w-[1400px] mx-auto text-center">
            <h2 class="text-lumina-rust font-black uppercase tracking-[0.5em] text-[10px] mb-4">Mall Highlights</h2>
            <h1 class="text-5xl md:text-7xl font-black font-outfit text-lumina-olive tracking-tighter mb-8 leading-none">
              {{ authService.isLoggedIn() ? 'Your Exclusive Agenda' : 'Events & Exclusive Deals' }}
            </h1>
            <p class="text-lumina-tan text-sm font-medium max-w-2xl mx-auto">
              {{ authService.isLoggedIn() 
                ? 'Discover events tailored to your preferences. Book your spot for exclusive experiences.'
                : 'Experience the unique blend of culture and commerce at Lumina.' 
              }}
            </p>
          </section>

          <!-- Member-only events banner -->
          <div *ngIf="authService.isLoggedIn() && memberEvents().length > 0" class="mb-8 px-8 md:px-16 max-w-[1400px] mx-auto">
            <div class="bg-lumina-rust/10 border border-lumina-rust/20 p-6 rounded-3xl flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-lumina-rust rounded-2xl flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-black text-lumina-olive text-sm">{{ memberEvents().length }} Member-Exclusive Events</h3>
                  <p class="text-[9px] text-lumina-tan uppercase tracking-widest">Available for VIP members only</p>
                </div>
              </div>
              <button (click)="activeSubTab.set('events')" class="px-6 py-3 bg-lumina-rust text-white rounded-xl text-[9px] font-black uppercase tracking-widest">
                View All
              </button>
            </div>
          </div>

          <!-- View Toggle -->
          <div class="flex justify-center mb-16 px-8">
            <div class="bg-lumina-cream p-1.5 rounded-2xl flex shadow-inner border border-lumina-olive/5">
              <button 
                (click)="activeSubTab.set('events')"
                [ngClass]="activeSubTab() === 'events' ? 'bg-white text-lumina-olive shadow-md' : 'text-lumina-olive/40 hover:text-lumina-olive'"
                class="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
              >Events ({{ filteredEvents().length }})</button>
              <button 
                (click)="activeSubTab.set('discounts')"
                [ngClass]="activeSubTab() === 'discounts' ? 'bg-white text-lumina-olive shadow-md' : 'text-lumina-olive/40 hover:text-lumina-olive'"
                class="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
              >Discounts ({{ filteredDiscounts().length }})</button>
            </div>
          </div>

          <div class="px-8 md:px-16 max-w-[1400px] mx-auto pb-32">
            <!-- Events Grid -->
            <div *ngIf="activeSubTab() === 'events'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <app-event-item 
                *ngFor="let event of filteredEvents(); let i = index"
                [image]="getEventImage(event.id)"
                [title]="event.title"
                [description]="event.description"
                [dateRange]="formatEventDateRange(event)"
                [status]="event.status"
                [isPublic]="event.is_public"
                [shopId]="event.shop_id"
                [eventId]="event.id"
                [staggerClass]="'stagger-' + (i % 6 + 1)"
              ></app-event-item>
              
              <div *ngIf="filteredEvents().length === 0" class="col-span-3 py-24 text-center border-2 border-dashed border-lumina-olive/10 rounded-[40px]">
                <p class="text-lumina-olive/30 font-black uppercase tracking-widest">No events available</p>
              </div>
            </div>

            <!-- Discounts List -->
            <div *ngIf="activeSubTab() === 'discounts'" class="space-y-8 max-w-5xl mx-auto">
              <app-discount-item
                *ngFor="let deal of filteredDiscounts(); let i = index"
                [value]="deal.value"
                [status]="deal.status"
                [endDate]="deal.end_date"
                [title]="deal.title"
                [description]="deal.description"
                [staggerClass]="'stagger-' + (i % 6 + 1)"
              ></app-discount-item>
              
              <div *ngIf="filteredDiscounts().length === 0" class="py-24 text-center border-2 border-dashed border-lumina-olive/10 rounded-[40px]">
                 <p class="text-lumina-olive/30 font-black uppercase tracking-widest">No active discounts currently</p>
              </div>
            </div>
          </div>
        </ng-container>

        <!-- Detail Mode -->
        <app-event-details
          *ngIf="selectedEvent()"
          [event]="selectedEvent()"
          [image]="getEventImage(selectedEvent()!.id)"
          [reviews]="reviewsForSelectedEvent()"
          (reviewAdded)="addReviewToEvent($event)"
          (back)="selectedEvent.set(null)"
          (onLoginRequest)="handleLoginRequest()"
          (onBookEvent)="handleBookEvent($event)"
          (onRegister)="handleRegisterForEvent($event)"
        ></app-event-details>

      </main>
      <app-footer></app-footer>
    </div>

    <!-- Styles forcés pour s'assurer que le texte est visible -->
    <style>
      app-event-item, app-discount-item {
        display: block;
        color: #2d2d2d;
      }
      .text-lumina-olive { color: #4a5d4a; }
      .text-lumina-rust { color: #b85c4a; }
      .text-lumina-tan { color: #c4a48c; }
      .bg-lumina-cream { background-color: #f8f4e9; }
      .bg-lumina-rust { background-color: #b85c4a; }
      .border-lumina-rust { border-color: #b85c4a; }
      .border-lumina-olive { border-color: #4a5d4a; }
    </style>
  `
})
export class ClientEventsViewComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public authService = inject(AuthService);
  
  // États
  activeSubTab = signal<'events' | 'discounts'>('events');
  selectedEvent = signal<MallEvent | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Données
  allEvents = signal<MallEvent[]>([]);
  allDiscounts = signal<Discount[]>([]);
  
  // Reviews
  private allReviews = signal<EventReview[]>([]);

  // Filtres pour les membres
  memberEvents = computed(() => {
    return this.allEvents().filter(e => !e.is_public);
  });

  // Événements filtrés selon login
  filteredEvents = computed(() => {
    let events = this.allEvents();
    
    if (!this.authService.isLoggedIn()) {
      events = events.filter(e => e.is_public === true);
    }
    
    return events;
  });

  // Discounts filtrés selon login
  filteredDiscounts = computed(() => {
    let discounts = this.allDiscounts();
    
    if (!this.authService.isLoggedIn()) {
      discounts = discounts.filter(d => d.status !== 'Member Exclusive');
    }
    
    return discounts;
  });

  // Reviews pour l'événement sélectionné
  reviewsForSelectedEvent = computed(() => {
    const event = this.selectedEvent();
    if (!event) return [];
    return this.allReviews().filter(r => r.event_id === event.id);
  });

  ngOnInit() {
    // FORCER L'UTILISATION DES MOCK DATA IMMÉDIATEMENT
    this.forceUseMockData();
    
    // Puis essayer de charger depuis l'API en arrière-plan
    this.loadInitialData();
    
    // Vérifier si un événement est sélectionné dans l'URL
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        setTimeout(() => {
          const event = this.allEvents().find(e => e.id === parseInt(eventId));
          if (event) {
            this.selectedEvent.set(event);
          }
        }, 200);
      }
    });
  }

  // ==================== MÉTHODE FORCÉE POUR UTILISER LES MOCK DATA ====================

  forceUseMockData() {
    this.allEvents.set([...MOCK_EVENTS]);
    this.allDiscounts.set([...MOCK_DISCOUNTS]);
    this.allReviews.set([...MOCK_EVENT_REVIEWS]);
  }

  // Méthode pour formater la plage de dates
  formatEventDateRange(event: MallEvent): string {
    try {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);
      
      if (start.toDateString() === end.toDateString()) {
        return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } catch (e) {
      return event.start_date;
    }
  }

  navigateToEvent(event: MallEvent) {
    this.router.navigate(['/client/event', event.id]);
  }

  handleLoginRequest() {
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: this.router.url } 
    });
  }

  handleBookEvent(event: any) {
    if (!this.authService.isLoggedIn()) {
      this.handleLoginRequest();
      return;
    }
  }

  handleRegisterForEvent(event: any) {
    if (!this.authService.isLoggedIn()) {
      this.handleLoginRequest();
      return;
    }
  }

  // ==================== CHARGEMENT DES DONNÉES ====================

  private loadInitialData() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    Promise.all([
      this.loadEvents(),
      this.loadDiscounts(),
      this.loadReviews()
    ]).catch(error => {
      console.error('Error loading initial data:', error);
    }).finally(() => {
      this.isLoading.set(false);
    });
  }

  private loadEvents(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getAllEvents().subscribe({
        next: (events: EventResponse[]) => {
          if (events && events.length > 0) {
            const mappedEvents: MallEvent[] = events.map(e => ({
              id: e.id,
              shop_id: e.shopId.toString(),
              title: e.title,
              description: e.description,
              start_date: e.eventDate,
              end_date: e.eventDate,
              is_public: e.isPublic,
              created_at: new Date().toISOString(),
              status: e.status as 'draft' | 'published' | 'archived' | 'cancelled',
              location: e.location
            }));
            
            this.allEvents.set(mappedEvents);
          }
          resolve();
        },
        error: (error) => {
          console.error('Error loading events from API:', error);
          resolve();
        }
      });
    });
  }

  private loadDiscounts(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  private loadReviews(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  getEventImage(id: number) {
    const images = [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
      'https://images.unsplash.com/photo-1540575861501-7ad058a712c7?q=80&w=1200',
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200',
      'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=1200'
    ];
    return images[(id - 1) % images.length];
  }

  // ==================== GESTION DES REVIEWS ====================

  addReviewToEvent(newReview: EventReview) {
    const event = this.selectedEvent();
    if (!event) return;
    
    this.allReviews.update(reviews => [newReview, ...reviews]);
  }

  // ==================== UTILITAIRES ====================

  retryLoading() {
    this.forceUseMockData();
    this.loadInitialData();
  }
}