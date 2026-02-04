
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-discount-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="status === 'active' ? 'bg-lumina-rust text-white shadow-xl' : 'bg-lumina-olive/5 text-lumina-olive/40 opacity-70'" 
         class="p-8 rounded-[40px] relative overflow-hidden group mb-6 transition-all">
      
      <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
      
      <div class="flex justify-between items-start mb-4">
        <span class="text-4xl font-black font-outfit block">{{ value }}</span>
        <span class="px-2 py-1 bg-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">
          {{ status }}
        </span>
      </div>

      <h4 class="text-sm font-black uppercase tracking-widest mb-4 leading-tight">{{ title }}</h4>
      <p class="text-xs mb-8 leading-relaxed line-clamp-2" [ngClass]="status === 'active' ? 'text-white/70' : 'text-lumina-olive/30'">
        {{ description }}
      </p>

      <div class="pt-6 border-t border-white/10 flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
        <span>Ends: {{ endDate | date:'shortDate' }}</span>
        <span *ngIf="status === 'active'" class="cursor-pointer hover:underline">Claim Deal</span>
      </div>
    </div>
  `
})
export class ShopDiscountItemComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() value!: string;
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() status!: string;
  @Input() createdAt!: string;
}
