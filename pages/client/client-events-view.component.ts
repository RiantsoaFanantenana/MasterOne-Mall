
import { Component, AfterViewInit, ElementRef, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer.component';
import { EventItemComponent } from './components/event-item.component';
import { DiscountItemComponent } from './components/discount-item.component';
import { EventDetailsComponent } from './components/event-details.component';
import { EventReview } from './components/event-reviews-list.component';

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
}

@Component({
  selector: 'app-client-events-view',
  standalone: true,
  imports: [CommonModule, FooterComponent, EventItemComponent, DiscountItemComponent, EventDetailsComponent],
  template: `
    <div class="bg-white min-h-screen flex flex-col motion-slide-in">
      <main class="flex-1">
        
        <!-- List Mode -->
        <ng-container *ngIf="!selectedEvent()">
          <!-- Header Section -->
          <section class="py-20 px-8 md:px-16 max-w-[1400px] mx-auto text-center reveal-header">
            <h2 class="text-lumina-rust font-black uppercase tracking-[0.5em] text-[10px] mb-4">Mall Highlights</h2>
            <h1 class="text-5xl md:text-7xl font-black font-outfit text-lumina-olive tracking-tighter mb-8 leading-none">Events & Exclusive Deals</h1>
            <p class="text-lumina-tan text-sm font-medium max-w-2xl mx-auto">Experience the unique blend of culture and commerce at Lumina. From VIP runway shows to exclusive seasonal discounts.</p>
          </section>

          <!-- View Toggle -->
          <div class="flex justify-center mb-16 px-8 reveal-header">
            <div class="bg-lumina-cream p-1.5 rounded-2xl flex shadow-inner border border-lumina-olive/5">
              <button 
                (click)="activeSubTab.set('events')"
                [ngClass]="activeSubTab() === 'events' ? 'bg-white text-lumina-olive shadow-md' : 'text-lumina-olive/40 hover:text-lumina-olive'"
                class="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
              >Events</button>
              <button 
                (click)="activeSubTab.set('discounts')"
                [ngClass]="activeSubTab() === 'discounts' ? 'bg-white text-lumina-olive shadow-md' : 'text-lumina-olive/40 hover:text-lumina-olive'"
                class="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
              >Discounts</button>
            </div>
          </div>

          <div class="px-8 md:px-16 max-w-[1400px] mx-auto pb-32">
            <!-- Events Grid -->
            <div *ngIf="activeSubTab() === 'events'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <app-event-item 
                *ngFor="let event of events; let i = index"
                [image]="getEventImage(event.id)"
                [title]="event.title"
                [description]="event.description"
                [dateRange]="(event.start_date | date:'MMM d') + ' — ' + (event.end_date | date:'MMM d')"
                [status]="event.status"
                [isPublic]="event.is_public"
                [shopId]="event.shop_id"
                [staggerClass]="'stagger-' + (i % 6 + 1)"
                (click)="selectedEvent.set(event)"
                class="cursor-pointer"
              ></app-event-item>
            </div>

            <!-- Discounts List -->
            <div *ngIf="activeSubTab() === 'discounts'" class="space-y-8 max-w-5xl mx-auto">
              <app-discount-item
                *ngFor="let deal of discounts(); let i = index"
                [value]="deal.value"
                [status]="deal.status"
                [endDate]="deal.end_date"
                [title]="deal.title"
                [description]="deal.description"
                [staggerClass]="'stagger-' + (i % 6 + 1)"
              ></app-discount-item>
              
              <div *ngIf="discounts().length === 0" class="py-24 text-center border-2 border-dashed border-lumina-olive/10 rounded-[40px] reveal">
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
          [reviews]="getReviewsForEvent(selectedEvent()!.id)"
          (back)="selectedEvent.set(null)"
        ></app-event-details>

      </main>
      <app-footer></app-footer>
    </div>

    <style>
      .reveal-header {
        opacity: 0;
        transform: translateY(20px);
        transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .reveal-header.active {
        opacity: 1;
        transform: translateY(0);
      }
    </style>
  `
})
export class ClientEventsViewComponent implements AfterViewInit {
  private el = inject(ElementRef);
  activeSubTab = signal<'events' | 'discounts'>('events');
  selectedEvent = signal<MallEvent | null>(null);

  events: MallEvent[] = [
    { id: 1, shop_id: 'LUXE-01', title: 'Winter Collection Gala', description: 'Experience the unveiling of the most anticipated winter collection of the year. Featuring exclusive pieces from Parisian designers.', start_date: '2024-11-20', end_date: '2024-11-22', is_public: false, created_at: '2024-10-01', status: 'published' },
    { id: 2, shop_id: 'TECH-12', title: 'Future of Tech Expo', description: 'Dive into the latest innovations in smart home and wearable tech. Hands-on demos available all day.', start_date: '2024-12-05', end_date: '2024-12-07', is_public: true, created_at: '2024-10-15', status: 'published' },
    { id: 3, shop_id: 'KIDS-05', title: 'Holiday Toy Workshop', description: 'Bring the kids for a day of creativity and fun. Build-your-own toy sessions with master craftsmen.', start_date: '2024-12-15', end_date: '2024-12-24', is_public: true, created_at: '2024-11-01', status: 'published' },
    { id: 4, shop_id: 'FOOD-09', title: 'Wine & Cheese Pairing', description: 'Join our sommelier for an evening of exquisite French wine and artisanal cheese pairings.', start_date: '2024-11-28', end_date: '2024-11-28', is_public: false, created_at: '2024-10-20', status: 'published' },
    { id: 5, shop_id: 'LUXE-02', title: 'Midnight Runway', description: 'A nocturnal showcase of avant-garde streetwear under the stars of the central atrium.', start_date: '2024-12-10', end_date: '2024-12-10', is_public: false, created_at: '2024-11-05', status: 'published' },
    { id: 6, shop_id: 'ART-01', title: 'Sculpture & Silk', description: 'Modern art meeting traditional textiles in a unique pop-up exhibition.', start_date: '2024-12-12', end_date: '2024-12-15', is_public: true, created_at: '2024-11-08', status: 'published' }
  ];

  discounts = signal<Discount[]>([
    { id: 1, shop_id: 'SHOP-01', title: 'Winter Season Opening', description: 'Exclusive early bird discount for our new winter outerwear line.', value: '25%', start_date: '2024-11-01', end_date: '2024-11-30', status: 'Active Deal', created_at: '2024-10-25' },
    { id: 2, shop_id: 'JEWEL-04', title: 'Lumina Anniversary', description: 'Celebrate our 10th anniversary with rare offers on diamond collections.', value: '15%', start_date: '2024-11-15', end_date: '2024-11-25', status: 'Flash Sale', created_at: '2024-10-28' },
    { id: 3, shop_id: 'SPORT-10', title: 'Performance Weekend', description: '30% off on all athletic footwear. Limited time only.', value: '30%', start_date: '2024-11-23', end_date: '2024-11-24', status: 'Active Deal', created_at: '2024-11-05' },
    { id: 4, shop_id: 'HOME-02', title: 'Artisan Decor Sale', description: 'Buy 1 Get 1 on handcrafted ceramics and home accessories.', value: 'BOGO', start_date: '2024-11-01', end_date: '2024-11-15', status: 'Member Exclusive', created_at: '2024-10-10' },
    { id: 5, shop_id: 'LUXE-05', title: 'Handbag VIP Week', description: 'Members get 40% off on luxury Italian handbags during our private week.', value: '40%', start_date: '2024-12-01', end_date: '2024-12-07', status: 'Upcoming', created_at: '2024-11-01' },
    { id: 6, shop_id: 'KIDS-02', title: 'Creative Kids Month', description: 'All wooden toys and building sets at a special member price.', value: '20%', start_date: '2024-11-01', end_date: '2024-11-30', status: 'Active Deal', created_at: '2024-11-01' },
    { id: 7, shop_id: 'TECH-08', title: 'Smart Living Upgrade', description: 'Get a complimentary smart light starter kit with any home automation purchase over 300€.', value: 'GIFT', start_date: '2024-11-10', end_date: '2024-12-10', status: 'Promotion', created_at: '2024-11-05' },
    { id: 8, shop_id: 'FOOD-05', title: 'Sunday Brunch Special', description: 'Your third guest dines for free every Sunday morning at Horizon Cafe.', value: 'FREE', start_date: '2024-11-01', end_date: '2024-12-31', status: 'Ongoing', created_at: '2024-11-01' }
  ]);

  constructor() {
    effect(() => {
      this.activeSubTab();
      this.selectedEvent();
      setTimeout(() => this.initRevealObserver(), 150);
      if (this.selectedEvent()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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

  getReviewsForEvent(id: number): EventReview[] {
    const allReviews: EventReview[] = [
      { id: 1, create_at: '2024-11-21', event_id: 1, client_id: 'Sophie L.', description: 'Magnificent runway show. The craftsmanship was beyond words.', stars: 10 },
      { id: 2, create_at: '2024-11-22', event_id: 1, client_id: 'David P.', description: 'Exclusive and well organized. Lumina really knows how to host.', stars: 9 },
      { id: 3, create_at: '2024-12-06', event_id: 2, client_id: 'Marc A.', description: 'Loved the smart home demos. Very inspiring.', stars: 8 },
      { id: 4, create_at: '2024-11-29', event_id: 4, client_id: 'Isabelle Q.', description: 'The pairings were sublime. A true gastronomic journey.', stars: 10 }
    ];
    return allReviews.filter(r => r.event_id === id);
  }

  ngAfterViewInit() {
    this.initRevealObserver();
  }

  private initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          if (entry.target.classList.contains('reveal')) {
            entry.target.classList.remove('active');
          }
        }
      });
    }, { threshold: 0.1 });

    const reveals = this.el.nativeElement.querySelectorAll('.reveal, .reveal-header');
    reveals.forEach((r: HTMLElement) => observer.observe(r));
  }
}
