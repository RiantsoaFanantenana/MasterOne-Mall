
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-review-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-lumina-cream rounded-[40px] border border-lumina-olive/5 hover:shadow-xl transition-all mb-6">
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-lumina-olive text-white flex items-center justify-center font-black text-lg shadow-lg">
            {{ clientId.charAt(0) }}
          </div>
          <div>
            <h4 class="font-black text-lumina-olive">{{ clientId }}</h4>
            <p class="text-[9px] text-lumina-olive/40 uppercase font-black tracking-widest">{{ createdAt | date:'longDate' }}</p>
          </div>
        </div>
        <div class="bg-white px-4 py-1.5 rounded-full border border-lumina-olive/10 font-black text-xs text-lumina-rust font-outfit shadow-sm">
          {{ stars }} / 10
        </div>
      </div>
      <p class="text-sm font-medium text-lumina-olive/70 leading-relaxed italic border-l-2 border-lumina-rust/20 pl-6">
        "{{ description }}"
      </p>
    </div>
  `
})
export class ShopReviewItemComponent {
  @Input() clientId!: string;
  @Input() description!: string;
  @Input() stars!: number;
  @Input() createdAt!: string;
}
