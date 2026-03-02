// pages/client/components/coupon-item.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coupon-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="staggerClass" 
         class="group relative overflow-hidden bg-white p-8 rounded-[30px] shadow-sm border border-lumina-olive/5 flex flex-col items-center text-center gap-6 hover:shadow-2xl hover:border-lumina-rust/20 transition-all reveal motion-item">
      
      <!-- Perforation Design -->
      <div class="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-lumina-cream border border-lumina-olive/5 shadow-inner"></div>
      <div class="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-lumina-cream border border-lumina-olive/5 shadow-inner"></div>
      
      <div class="w-16 h-16 bg-lumina-cream rounded-2xl flex items-center justify-center text-lumina-rust border-2 border-dashed border-lumina-rust/20 group-hover:border-lumina-rust transition-colors duration-700">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect width="20" height="14" x="2" y="5" rx="2"/></svg>
      </div>

      <div>
        <h3 class="text-lg font-black text-lumina-olive mb-2 leading-snug">{{ description }}</h3>
        <p class="text-[9px] font-black uppercase tracking-widest text-lumina-tan">Valid until {{ endDate | date }}</p>
      </div>

      <div class="w-full pt-6 border-t border-lumina-olive/5 flex flex-col items-center gap-2">
         <div class="bg-lumina-olive/5 px-6 py-2 rounded-xl border border-lumina-olive/10 font-black text-xs text-lumina-olive font-outfit">CODE: {{ id.split('-')[0] }}</div>
         <span class="text-[8px] font-bold text-lumina-tan uppercase">Collected {{ createAt | date:'shortDate' }}</span>
      </div>

      <!-- Redeem button -->
      <button (click)="onRedeem.emit(id)"
              class="mt-2 px-6 py-2 bg-lumina-rust text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-lumina-olive transition-all">
        Redeem
      </button>
    </div>

    <style>
      .motion-item {
        transition: transform 4.5s cubic-bezier(0.15, 1, 0.3, 1), opacity 3.5s ease !important;
      }
    </style>
  `
})
export class CouponItemComponent {
  @Input() id!: string;
  @Input() description!: string;
  @Input() endDate!: string;
  @Input() createAt!: string;
  @Input() staggerClass: string = '';
  @Output() onRedeem = new EventEmitter<string>();
}