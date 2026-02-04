
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discount-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-lumina-cream p-1 rounded-3xl border border-lumina-olive/5 hover:border-lumina-rust/20 transition-all group reveal motion-item"
         [ngClass]="staggerClass">
      <div class="bg-white rounded-[22px] p-8 flex flex-col md:flex-row items-center gap-10 shadow-sm border border-lumina-olive/5 relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-lumina-rust/5 rounded-full blur-3xl group-hover:bg-lumina-rust/10 transition-all duration-[4000ms]"></div>
        
        <div class="w-full md:w-48 h-48 bg-lumina-rust flex flex-col items-center justify-center text-white rounded-2xl shadow-xl transform group-hover:rotate-2 transition-transform duration-[2000ms]">
          <span class="text-4xl font-black font-outfit">{{ value }}</span>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] mt-2">Discount</span>
        </div>

        <div class="flex-1 relative z-10">
          <div class="flex items-center gap-4 mb-4">
            <span class="px-4 py-1 bg-lumina-mint text-white text-[9px] font-black uppercase tracking-widest rounded-full">{{ status }}</span>
            <span class="text-lumina-tan text-[10px] font-bold uppercase tracking-widest">Until {{ endDate | date:'mediumDate' }}</span>
          </div>
          <h3 class="text-3xl font-black text-lumina-olive mb-3 font-outfit">{{ title }}</h3>
          <p class="text-lumina-olive/60 text-sm font-medium">{{ description }}</p>
        </div>

        <div class="flex flex-col gap-3 w-full md:w-auto relative z-10">
          <button class="px-8 py-4 bg-lumina-olive text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-lumina-rust transition-all shadow-lg active:scale-95">Grab Offer</button>
          <button class="px-8 py-4 bg-lumina-cream text-lumina-olive rounded-xl font-black text-[10px] uppercase tracking-widest border border-lumina-olive/10 hover:bg-white transition-all">Store Details</button>
        </div>
      </div>
    </div>

    <style>
      .motion-item {
        /* Ultra smooth transition specifically for the "motion" experience */
        transition: transform 4.5s cubic-bezier(0.15, 1, 0.3, 1), opacity 3.5s ease !important;
      }
    </style>
  `
})
export class DiscountItemComponent {
  @Input() value!: string;
  @Input() status!: string;
  @Input() endDate!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() staggerClass: string = '';
}
