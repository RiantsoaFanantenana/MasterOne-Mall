
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventReviewItemComponent } from './event-review-item.component.ts';

export interface EventReview {
  id: number;
  create_at: string;
  event_id: number;
  client_id: string;
  description: string;
  stars: number;
}

@Component({
  selector: 'app-event-reviews-list',
  standalone: true,
  imports: [CommonModule, EventReviewItemComponent],
  template: `
    <div class="space-y-10">
      <div class="flex justify-between items-end border-b border-lumina-rust/10 pb-6">
        <div class="flex flex-col gap-1">
           <h3 class="text-3xl font-black font-outfit text-lumina-olive tracking-tight">Participant Feedback</h3>
           <p class="text-[9px] font-black uppercase text-lumina-rust tracking-[0.2em]">Live event impressions</p>
        </div>
        <div class="flex flex-col text-right">
             <span class="text-[14px] font-black text-lumina-rust font-outfit">{{ reviews.length }} shared moments</span>
        </div>
      </div>

      <div class="space-y-4">
        <div *ngIf="reviews.length === 0" class="py-16 text-center text-lumina-olive/20 font-black uppercase tracking-widest border-2 border-dashed border-lumina-rust/10 rounded-[32px]">
          No participant reviews yet.
        </div>
        
        <div *ngFor="let r of reviews; let i = index" 
             class="animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both"
             [style.animation-delay]="(i * 100) + 'ms'">
          <app-event-review-item
            [clientId]="r.client_id"
            [description]="r.description"
            [stars]="r.stars"
            [createdAt]="r.create_at"
            class="block"
          ></app-event-review-item>
        </div>
      </div>
    </div>
  `
})
export class EventReviewsListComponent {
  @Input() reviews: EventReview[] = [];
}
