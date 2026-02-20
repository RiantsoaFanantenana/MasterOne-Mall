
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopReviewItemComponent } from './shop-review-item.component';
import { ShopReview } from './shop-details.component';

@Component({
  selector: 'app-shop-reviews-list',
  standalone: true,
  imports: [CommonModule, ShopReviewItemComponent],
  template: `
    <div class="space-y-12">
      <div class="flex justify-between items-end border-b border-lumina-olive/5 pb-8">
        <div class="flex flex-col gap-2">
           <h3 class="text-5xl font-black font-outfit text-lumina-olive tracking-tighter">Guest Reviews</h3>
           <p class="text-[10px] font-black uppercase text-lumina-tan tracking-widest">Verified visitor experiences</p>
        </div>
        <div class="flex items-center gap-5">
           <div class="flex flex-col text-right">
             <span class="text-[9px] font-black uppercase text-lumina-tan">Excellence Score</span>
             <span class="text-[8px] font-bold text-lumina-olive/40">{{ reviews.length }} records</span>
           </div>
           <span class="text-5xl font-black text-lumina-rust font-outfit leading-none">{{ averageStars }}</span>
        </div>
      </div>

      <div class="space-y-6 min-h-[100px]">
        <div *ngIf="reviews.length === 0" class="py-20 text-center text-lumina-olive/20 font-black uppercase tracking-widest border-2 border-dashed border-lumina-olive/5 rounded-[40px]">
          No historical reviews recorded.
        </div>
        
        <div *ngFor="let r of reviews; let i = index" 
             class="animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both"
             [style.animation-delay]="(i * 100) + 'ms'">
          <app-shop-review-item
            [clientId]="r.client_id"
            [description]="r.description"
            [stars]="r.stars"
            [createdAt]="r.create_at"
            class="block"
          ></app-shop-review-item>
        </div>
      </div>
    </div>
  `
})
export class ShopReviewsListComponent {
  @Input() reviews: ShopReview[] = [];

  get averageStars(): string {
    if (this.reviews.length === 0) return '0.0';
    const total = this.reviews.reduce((acc, r) => acc + r.stars, 0);
    return (total / this.reviews.length).toFixed(1);
  }
}
