import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-3xl border border-lumina-olive/5 overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
         [ngClass]="staggerClass"
         (click)="navigateToEvent()">
      <div class="h-64 overflow-hidden relative">
        <div class="absolute inset-0 bg-lumina-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
        <img [src]="image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4000ms]" />
        <div class="absolute top-6 right-6 z-20 flex flex-col gap-2">
          <span [ngClass]="statusClass" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
            {{ status }}
          </span>
          <span *ngIf="!isPublic" class="bg-lumina-rust text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
            Member Exclusive
          </span>
        </div>
      </div>
      <div class="p-8">
        <div class="flex items-center gap-3 mb-4">
          <span class="w-8 h-[2px] bg-lumina-rust"></span>
          <span class="text-[10px] font-black text-lumina-rust uppercase tracking-widest">{{ dateRange }}</span>
        </div>
        <h3 class="text-2xl font-black text-lumina-olive mb-4 font-outfit">{{ title }}</h3>
        <p class="text-lumina-olive/60 text-xs font-medium leading-relaxed mb-8 line-clamp-3">{{ description }}</p>
        <div class="flex justify-between items-center pt-6 border-t border-lumina-olive/5">
          <span class="text-[9px] font-black uppercase tracking-widest text-lumina-tan">Shop Ref: {{ shopId }}</span>
          <button class="text-lumina-olive hover:text-lumina-rust transition-colors" (click)="navigateToEvent(); $event.stopPropagation()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class EventItemComponent {
  @Input() image!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() dateRange!: string;
  @Input() status!: string;
  @Input() isPublic: boolean = true;
  @Input() shopId!: string;
  @Input() eventId!: number;
  @Input() staggerClass: string = '';

  private router = inject(Router);

  get statusClass() {
    switch(this.status) {
      case 'published': return 'bg-lumina-mint text-white';
      case 'draft': return 'bg-lumina-tan text-white';
      case 'cancelled': return 'bg-lumina-rust text-white';
      default: return 'bg-lumina-olive/20 text-lumina-olive';
    }
  }

  navigateToEvent() {
    if (this.eventId) {
      this.router.navigate(['/client/event', this.eventId]);
    }
  }
}