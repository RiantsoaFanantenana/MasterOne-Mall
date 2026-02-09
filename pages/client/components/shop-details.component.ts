
import { Component, Input, Output, EventEmitter, AfterViewInit, ElementRef, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataService } from '../../../services/master-data.service.ts';
import { ShopProfile } from './shop-list.component.ts';
import { ShopReviewsListComponent } from './shop-reviews-list.component.ts';
import { ShopEventsListComponent } from './shop-events-list.component.ts';
import { ShopDiscountsListComponent } from './shop-discounts-list.component.ts';
import { ShopReviewFormComponent } from './shop-review-form.component.ts';
import { ThreeDPlanComponent } from '../../mall/components/three-d-plan.component.ts';

export interface ShopReview {
  id: number;
  create_at: string;
  shop_id: string;
  client_id: string;
  description: string;
  stars: number;
}

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [
    CommonModule, 
    ShopReviewsListComponent,
    ShopEventsListComponent,
    ShopDiscountsListComponent,
    ShopReviewFormComponent,
    ThreeDPlanComponent
  ],
  template: `
    <div class="bg-white min-h-screen pb-40 animate-in fade-in duration-700">
      <div class="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-8 md:px-16 lg:px-32 py-5 border-b border-lumina-olive/5 flex items-center justify-between shadow-sm">
        <button (click)="back.emit()" class="group flex items-center gap-4 text-lumina-olive hover:text-lumina-rust transition-all">
          <div class="w-10 h-10 rounded-full border border-lumina-olive/10 flex items-center justify-center group-hover:-translate-x-2 transition-transform bg-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span class="text-[11px] font-black uppercase tracking-[0.4em]">Back to Directory</span>
        </button>
        <div class="flex items-center gap-8">
           <div class="hidden sm:flex flex-col items-end">
             <span class="text-[9px] font-black uppercase text-lumina-tan tracking-[0.4em] leading-none mb-2">MasterOne ID</span>
             <span class="text-xs font-black text-lumina-olive leading-none">Box {{ shop.id_box }}</span>
           </div>
           <div class="h-10 w-[1px] bg-lumina-olive/10 hidden sm:block"></div>
           
           <div class="flex gap-4">
             <button *ngIf="isLoggedIn" 
                     (click)="onFavoriteToggle.emit()" 
                     class="w-12 h-12 rounded-2xl border flex items-center justify-center transition-all shadow-inner shadow-black/5"
                     [ngClass]="isFavorite ? 'bg-lumina-rust text-white border-lumina-rust' : 'bg-lumina-cream border-lumina-olive/10 text-lumina-olive hover:bg-white'">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" 
                     [attr.fill]="isFavorite ? 'currentColor' : 'none'" 
                     stroke="currentColor" stroke-width="2.5">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.04 3 5.5L12 21l7-7Z"/>
                </svg>
             </button>

             <button class="w-12 h-12 rounded-2xl border border-lumina-olive/10 bg-lumina-cream flex items-center justify-center hover:bg-white transition-colors shadow-inner shadow-black/5 text-lumina-olive">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
             </button>
           </div>
        </div>
      </div>

      <section class="relative h-[65vh] overflow-hidden">
        <img [src]="shop.cover_pic" class="w-full h-full object-cover animate-image-reveal" />
        <div class="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full px-8 md:px-16 lg:px-32 pb-20 flex flex-col md:flex-row items-end gap-12">
          <div class="w-40 h-40 md:w-64 md:h-64 bg-white rounded-[48px] p-6 shadow-3xl overflow-hidden border border-lumina-olive/5 transform -rotate-3 transition-transform animate-in zoom-in-95 duration-1000">
            <img [src]="shop.logo" class="w-full h-full object-contain" />
          </div>
          <div class="flex-1 mb-6 animate-in slide-in-from-left-10 duration-1000">
            <div class="flex flex-wrap items-center gap-4 mb-6">
              <span class="bg-lumina-rust text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-lumina-rust/20">MasterOne House Exclusive</span>
              <span class="bg-lumina-olive text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-lumina-olive/20">Master Floor</span>
            </div>
            <h1 class="text-7xl md:text-[10rem] font-black font-outfit text-lumina-olive tracking-tighter leading-none mb-4 uppercase">{{ shop.shop_name }}</h1>
          </div>
        </div>
      </section>

      <section class="px-8 md:px-16 lg:px-32 max-w-[1920px] mx-auto py-32 grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div class="lg:col-span-8 space-y-40">
          <div class="reveal">
            <div class="flex items-center gap-8 mb-16">
              <span class="w-24 h-[3px] bg-lumina-rust"></span>
              <h3 class="text-sm font-black uppercase tracking-[0.6em] text-lumina-tan">The Master Identity</h3>
            </div>
            <p class="text-3xl md:text-5xl text-lumina-olive leading-tight font-medium font-outfit max-w-5xl">{{ shop.description }}</p>
          </div>

          <!-- 3D LOCATION SECTION -->
          <div class="reveal pt-20 border-t border-lumina-olive/5">
            <div class="flex items-center justify-between mb-16">
              <div class="flex items-center gap-8">
                <span class="w-24 h-[3px] bg-lumina-rust"></span>
                <h3 class="text-sm font-black uppercase tracking-[0.6em] text-lumina-tan">Location Protocol</h3>
              </div>
              <div class="bg-lumina-cream px-6 py-3 rounded-2xl border border-lumina-olive/10">
                <p class="text-[10px] font-black uppercase text-lumina-olive/40 tracking-[0.3em]">Architectural View • Level {{ shopFloorIndex() }}</p>
              </div>
            </div>
            
            <div class="rounded-[60px] overflow-hidden shadow-3xl border border-lumina-olive/10 bg-lumina-cream">
              <app-three-d-plan 
                [floors]="data.mallFloors()"
                [selectedRoomId]="shop.id_box"
                [selectedShop]="shop"
                [initialFloorIndex]="shopFloorIndex()"
              ></app-three-d-plan>
            </div>
          </div>

          <div class="space-y-24">
            <app-shop-reviews-list [reviews]="reviews"></app-shop-reviews-list>
            <div class="pt-12 border-t border-lumina-olive/5">
              <app-shop-review-form (onSubmit)="handleAddReview($event)"></app-shop-review-form>
            </div>
          </div>
        </div>
        <div class="lg:col-span-4 space-y-32">
          <div class="sticky top-60 space-y-32">
            <app-shop-events-list [events]="events"></app-shop-events-list>
            <app-shop-discounts-list [discounts]="discounts"></app-shop-discounts-list>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ShopDetailsComponent implements AfterViewInit {
  data = inject(MasterDataService);
  @Input() shop!: ShopProfile;
  @Input() events: any[] = [];
  @Input() discounts: any[] = [];
  @Input() reviews: ShopReview[] = [];
  @Input() isLoggedIn: boolean = false;
  @Input() isFavorite: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() onFavoriteToggle = new EventEmitter<void>();
  
  private el = inject(ElementRef);

  shopFloorIndex = computed(() => {
    const floors = this.data.mallFloors();
    const idx = floors.findIndex(f => f.rooms.some((r: any) => r.name === this.shop.id_box));
    return idx >= 0 ? idx : 1; // Default to Floor 1 if not found
  });

  ngAfterViewInit() { this.initLocalRevealObserver(); }

  handleAddReview(newReview: any) {
    const reviewWithId = { ...newReview, id: Math.floor(Math.random() * 10000), shop_id: this.shop.id_box };
    this.reviews = [reviewWithId, ...this.reviews];
    setTimeout(() => {
      const reviewList = document.querySelector('app-shop-reviews-list');
      if (reviewList) reviewList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  private initLocalRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.05 });
    const reveals = this.el.nativeElement.querySelectorAll('.reveal');
    reveals.forEach((r: HTMLElement) => observer.observe(r));
  }
}
