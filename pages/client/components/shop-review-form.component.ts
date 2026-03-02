import { Component, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-shop-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-10 md:p-16 rounded-[48px] border border-lumina-olive/10 mt-20 reveal shadow-sm max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 bg-lumina-olive rounded-3xl flex items-center justify-center text-white shadow-2xl rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <h3 class="text-4xl font-black font-outfit text-lumina-olive tracking-tight leading-none mb-2">Leave a Note</h3>
            <p class="text-[11px] font-black uppercase text-lumina-tan tracking-[0.3em]">Share your MasterOne experience</p>
          </div>
        </div>
        
        <div class="flex flex-col items-center md:items-end">
          <span class="text-[10px] font-black uppercase tracking-widest text-lumina-olive/40 mb-3">Your Rating</span>
          <div class="flex items-center gap-1">
            <div *ngFor="let starIndex of [0, 1, 2, 3, 4]" class="relative flex">
              <button 
                type="button"
                (mouseenter)="hoverValue = (starIndex * 2) + 1"
                (mouseleave)="hoverValue = 0"
                (click)="stars = (starIndex * 2) + 1"
                class="w-5 h-10 group/half"
              >
                <svg viewBox="0 0 24 24" class="w-10 h-10 absolute left-0 pointer-events-none transition-all duration-300"
                  [attr.fill]="getStarFill(starIndex, 'left')"
                  [attr.stroke]="getStarStroke(starIndex, 'left')"
                  stroke-width="1.5">
                  <path d="M12 2 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 Z" />
                </svg>
              </button>
              <button 
                type="button"
                (mouseenter)="hoverValue = (starIndex * 2) + 2"
                (mouseleave)="hoverValue = 0"
                (click)="stars = (starIndex * 2) + 2"
                class="w-5 h-10 group/half"
              >
                <svg viewBox="0 0 24 24" class="w-10 h-10 absolute left-0 pointer-events-none transition-all duration-300"
                  [attr.fill]="getStarFill(starIndex, 'right')"
                  [attr.stroke]="getStarStroke(starIndex, 'right')"
                  stroke-width="1.5">
                  <path d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L12 2 Z" />
                </svg>
              </button>
            </div>
            <span class="ml-6 font-black text-lumina-rust text-3xl font-outfit min-w-[3rem] text-right">{{ displayValue }}<span class="text-sm text-lumina-olive/20 ml-1">/10</span></span>
          </div>
        </div>
      </div>

      <!-- Affichage du nom de l'utilisateur -->
      <div class="mb-8 flex items-center gap-4 px-2">
        <div class="w-12 h-12 rounded-xl bg-lumina-rust text-white flex items-center justify-center font-black text-xl shadow-md">
          {{ userName.charAt(0) }}
        </div>
        <div>
          <span class="text-[9px] font-black uppercase text-lumina-tan tracking-widest">Reviewing as</span>
          <p class="text-xl font-black text-lumina-olive">{{ userName }}</p>
        </div>
        <span class="ml-auto px-4 py-2 bg-lumina-mint/10 text-lumina-mint rounded-full text-[8px] font-black uppercase tracking-widest border border-lumina-mint/20">
          Verified Member
        </span>
      </div>

      <form (ngSubmit)="submitReview()" class="space-y-10">
        <div class="space-y-3">
          <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Your Story</label>
          <textarea [(ngModel)]="comment" 
                    name="comment" 
                    placeholder="Tell us about the atmosphere..." 
                    rows="5" 
                    class="w-full px-8 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[32px] font-bold text-lumina-olive resize-none leading-relaxed text-lg shadow-inner shadow-black/5" 
                    required></textarea>
        </div>

        <div class="flex justify-end pt-6">
          <button type="submit" 
                  [disabled]="!comment || stars === 0"
                  class="group px-14 py-6 bg-lumina-olive text-white rounded-3xl font-black uppercase tracking-[0.2em] hover:bg-lumina-rust transition-all shadow-2xl disabled:opacity-30 flex items-center gap-4 text-xs">
            Post your review
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="group-hover:translate-x-2 transition-transform"><path d="m5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </form>
    </div>
  `
})
export class ShopReviewFormComponent implements OnInit {
  private authService = inject(AuthService);
  
  stars = 10;
  hoverValue = 0;
  comment = '';
  
  userName: string = '';
  
  @Output() reviewSubmitted = new EventEmitter<any>();

  ngOnInit() {
    this.loadUserName();
  }

  private loadUserName() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.name || payload.userName || payload.email?.split('@')[0] || 'Member';
      } catch (e) {
        console.error('Error decoding token:', e);
        this.userName = 'Member';
      }
    } else {
      this.userName = 'Member';
    }
  }

  get displayValue() { return this.hoverValue || this.stars; }
  
  getStarFill(starIndex: number, side: 'left' | 'right') {
    const val = (starIndex * 2) + (side === 'left' ? 1 : 2);
    return (this.hoverValue || this.stars) >= val ? '#8C4A33' : 'none';
  }
  
  getStarStroke(starIndex: number, side: 'left' | 'right') {
    const val = (starIndex * 2) + (side === 'left' ? 1 : 2);
    return (this.hoverValue || this.stars) >= val ? '#8C4A33' : '#646E57';
  }
  
  submitReview() {
    console.log('SubmitReview called', { 
      userName: this.userName, 
      comment: this.comment, 
      stars: this.stars 
    });
    
    if (this.comment && this.stars) {
      const reviewData = { 
        client_id: this.userName, 
        stars: this.stars, 
        description: this.comment, 
        create_at: new Date().toISOString() 
      };
      
      console.log('Emitting review:', reviewData);
      this.reviewSubmitted.emit(reviewData);
      
      this.stars = 10; 
      this.comment = '';
    } else {
      console.log('Form validation failed', {
        comment: !!this.comment,
        stars: this.stars
      });
    }
  }
}