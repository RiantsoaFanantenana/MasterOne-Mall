// pages/client/components/event-details.component.ts
import { Component, Input, Output, EventEmitter, inject, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventReviewsListComponent, EventReview } from './event-reviews-list.component';
import { ShopReviewFormComponent } from './shop-review-form.component';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, EventReviewsListComponent, ShopReviewFormComponent],
  template: `
    <div class="bg-white min-h-screen pb-40 animate-in fade-in duration-700">
      <div class="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-8 md:px-16 lg:px-32 py-5 border-b border-lumina-rust/5 flex items-center justify-between shadow-sm">
        <button (click)="back.emit()" class="group flex items-center gap-4 text-lumina-olive hover:text-lumina-rust transition-all">
          <div class="w-10 h-10 rounded-full border border-lumina-rust/10 flex items-center justify-center group-hover:-translate-x-2 transition-transform bg-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
          </div>
          <span class="text-[11px] font-black uppercase tracking-[0.4em]">Back to Master Agenda</span>
        </button>
        <div class="flex items-center gap-6">
           <div class="hidden sm:flex flex-col items-end">
             <span class="text-[8px] font-black uppercase text-lumina-tan tracking-[0.4em] mb-1">Status</span>
             <span class="text-[10px] font-black text-lumina-rust uppercase">{{ event.status }}</span>
           </div>
           <div class="h-8 w-[1px] bg-lumina-rust/10"></div>
           <button *ngIf="authService.isLoggedIn()" 
                   (click)="bookEvent()"
                   class="px-6 py-2.5 bg-lumina-rust text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-lumina-rust/20 active:scale-95 transition-all hover:bg-lumina-olive">
             Book Event
           </button>
           <button *ngIf="!authService.isLoggedIn()" 
                   (click)="onLoginRequest.emit()"
                   class="px-6 py-2.5 bg-lumina-rust/80 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lumina-rust transition-all">
             Login to Book
           </button>
        </div>
      </div>

      <section class="relative h-[55vh] overflow-hidden">
        <img [src]="image" class="w-full h-full object-cover animate-image-reveal" />
        <div class="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
        <div class="absolute bottom-0 left-0 w-full px-8 md:px-16 lg:px-32 pb-16 flex flex-col gap-6">
          <div class="flex flex-wrap items-center gap-4 animate-in slide-in-from-left-10 duration-700">
            <span class="bg-lumina-rust text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
              {{ event.is_public ? 'Open to All' : 'Members Only' }}
            </span>
            <span class="bg-lumina-olive text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
              {{ event.start_date | date:'MMMM d' }} — {{ event.end_date | date:'MMMM d, y' }}
            </span>
          </div>
          <h1 class="text-6xl md:text-[8rem] font-black font-outfit text-lumina-olive tracking-tighter leading-[0.85] mb-4">
            {{ event.title }}
          </h1>
        </div>
      </section>

      <section class="px-8 md:px-16 lg:px-32 max-w-[1920px] mx-auto py-24 grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div class="lg:col-span-7 space-y-24">
          <div class="reveal">
            <div class="flex items-center gap-8 mb-12">
              <span class="w-16 h-[3px] bg-lumina-rust"></span>
              <h3 class="text-sm font-black uppercase tracking-[0.5em] text-lumina-tan">The Master Experience</h3>
            </div>
            <p class="text-2xl md:text-4xl text-lumina-olive leading-snug font-medium font-outfit">{{ event.description }}</p>
          </div>
          
          <div class="space-y-24">
            <app-event-reviews-list [reviews]="reviews"></app-event-reviews-list>
            
            <div class="pt-12 border-t border-lumina-rust/10">
              <!-- Login required message for non-logged in users -->
              <div *ngIf="!authService.isLoggedIn()" class="bg-lumina-rust/10 p-8 rounded-[48px] text-center border-2 border-dashed border-lumina-rust/20">
                <div class="w-16 h-16 bg-lumina-rust/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-lumina-rust"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h4 class="text-lg font-black text-lumina-rust mb-2">Login to Share Your Experience</h4>
                <p class="text-[10px] font-black uppercase tracking-widest text-lumina-olive/40 mb-6">
                  Members can leave reviews and book events
                </p>
                <button (click)="onLoginRequest.emit()" class="px-8 py-4 bg-lumina-rust text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-lumina-olive transition-all">
                  Member Access
                </button>
              </div>

              <!-- Review form for logged in users -->
              <app-shop-review-form *ngIf="authService.isLoggedIn()" 
                                   (reviewSubmitted)="handleAddReview($event)">
              </app-shop-review-form>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-16">
          <div class="bg-lumina-cream p-12 rounded-[48px] border border-lumina-rust/5 reveal sticky top-32">
            <h4 class="text-sm font-black uppercase tracking-[0.4em] text-lumina-rust mb-10">Practical Information</h4>
            <div class="space-y-8">
              <div class="flex items-start gap-6">
                <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-lumina-rust shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <p class="text-[9px] font-black uppercase tracking-widest text-lumina-tan mb-1">Calendar</p>
                  <p class="text-lg font-black text-lumina-olive font-outfit">{{ event.start_date | date:'fullDate' }}</p>
                </div>
              </div>
              
              <!-- Member price info -->
              <div *ngIf="!event.is_public" class="bg-lumina-rust/10 p-4 rounded-2xl border border-lumina-rust/20">
                <p class="text-[9px] font-black uppercase tracking-widest text-lumina-rust mb-1">Member Exclusive</p>
                <p class="text-[11px] font-medium text-lumina-olive/70">
                  This event is reserved for MasterOne members. 
                  <span *ngIf="!authService.isLoggedIn()" class="block mt-2 text-lumina-rust font-black text-[9px] uppercase">Login to access</span>
                </p>
              </div>

              <div class="pt-10 border-t border-lumina-rust/10">
                <p class="text-[10px] font-black text-lumina-rust leading-relaxed mb-8">
                  This event is meticulously curated by MasterOne's excellence department. Secure your spot to witness the pinnacle of Parisian lifestyle.
                </p>
                
                <!-- Conditional register button -->
                <button *ngIf="authService.isLoggedIn()" 
                        (click)="registerForEvent()"
                        class="w-full py-5 bg-lumina-olive text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-lumina-rust transition-all shadow-xl shadow-lumina-olive/10">
                  Register Now
                </button>
                <button *ngIf="!authService.isLoggedIn()" 
                        (click)="onLoginRequest.emit()"
                        class="w-full py-5 bg-lumina-rust text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-lumina-olive transition-all shadow-xl shadow-lumina-rust/20">
                  Login to Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class EventDetailsComponent implements OnInit, AfterViewInit {
  @Input() event!: any;
  @Input() image!: string;
  @Input() reviews: EventReview[] = [];
  
  @Output() back = new EventEmitter<void>();
  @Output() reviewsChange = new EventEmitter<EventReview[]>();
  @Output() onLoginRequest = new EventEmitter<void>();
  @Output() onBookEvent = new EventEmitter<any>();
  @Output() onRegister = new EventEmitter<any>();
  
  private el = inject(ElementRef);
  private apiService = inject(ApiService); // ← Ajout de ApiService
  public authService = inject(AuthService);

  ngOnInit() {
    console.log('🚀 EventDetailsComponent - ngOnInit:', {
      event: this.event?.id,
      authState: this.authService.isLoggedIn()
    });
  }
  
  ngAfterViewInit() {
    console.log('🎯 EventDetailsComponent - isLoggedIn:', this.authService.isLoggedIn());
    this.initRevealObserver();
  }

  handleAddReview(newReview: any) {
    console.log('New review submitted, isLoggedIn:', this.authService.isLoggedIn());
    
    if (!this.authService.isLoggedIn()) {
      this.onLoginRequest.emit();
      return;
    }
    
    // Créer l'objet review avec un ID temporaire
    const tempId = Math.floor(Math.random() * 10000);
    const reviewWithId: EventReview = { 
      ...newReview, 
      id: tempId, 
      event_id: this.event.id 
    };
    
    // Mettre à jour l'UI immédiatement (optimistic update)
    const updatedReviews = [reviewWithId, ...this.reviews];
    this.reviews = updatedReviews;
    this.reviewsChange.emit(updatedReviews);
    
    // Appel API pour poster la review (si votre API supporte les reviews d'événements)
    // Note: Adaptez cet appel selon votre API
    this.apiService.postReview(this.event.shop_id, {
      rating: Math.ceil(newReview.stars / 2), // Convertir /10 en /5
      comment: newReview.description
    }).subscribe({
      next: (response) => {
        console.log('✅ Review posted successfully to API:', response);
        
        // Si l'API retourne un ID, on peut mettre à jour la review avec le vrai ID
        if (response?.id) {
          this.reviews = this.reviews.map(r => 
            r.id === tempId ? { ...r, id: response.id } : r
          );
          this.reviewsChange.emit(this.reviews);
        }
        
        // Scroll vers la liste des reviews
        setTimeout(() => {
          const reviewList = document.querySelector('app-event-reviews-list');
          if (reviewList) {
            reviewList.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      },
      error: (error) => {
        console.error('❌ Error posting review:', error);
        // On garde la review même si l'API échoue (mode démo)
        console.log('Review kept locally (demo mode)');
        
        setTimeout(() => {
          const reviewList = document.querySelector('app-event-reviews-list');
          if (reviewList) {
            reviewList.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });
  }

  bookEvent() {
    console.log('Booking event:', this.event.id);
    if (!this.authService.isLoggedIn()) {
      this.onLoginRequest.emit();
    } else {
      this.onBookEvent.emit(this.event);
    }
  }

  registerForEvent() {
    console.log('Registering for event:', this.event.id);
    if (!this.authService.isLoggedIn()) {
      this.onLoginRequest.emit();
    } else {
      this.onRegister.emit(this.event);
    }
  }

  private initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { 
        if (entry.isIntersecting) entry.target.classList.add('active'); 
      });
    }, { threshold: 0.05 });
    
    setTimeout(() => {
      const reveals = this.el.nativeElement.querySelectorAll('.reveal');
      reveals.forEach((r: HTMLElement) => observer.observe(r));
    });
  }
}