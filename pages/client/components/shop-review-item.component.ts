import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-review-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-white rounded-[32px] border border-lumina-rust/10 hover:border-lumina-rust/30 transition-all mb-6 shadow-sm">
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-lumina-rust text-white flex items-center justify-center font-black text-sm shadow-md">
            {{ clientId.charAt(0) }}
          </div>
          <div>
            <h4 class="font-black text-lumina-olive text-sm">{{ clientId }}</h4>
            <p class="text-[8px] text-lumina-olive/40 uppercase font-black tracking-widest">{{ createdAt | date:'longDate' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <div class="flex text-lumina-rust">
            <svg *ngFor="let s of [1,2,3,4,5]" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" [attr.fill]="stars/2 >= s ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span class="ml-2 font-black text-lumina-rust text-xs font-outfit">{{ stars }}/10</span>
        </div>
      </div>
      <p class="text-xs font-medium text-lumina-olive/70 leading-relaxed italic border-l-2 border-lumina-rust/30 pl-5">
        "{{ description }}"
      </p>
    </div>
  `
})
export class ShopReviewItemComponent implements OnInit {
  @Input() clientId: string = '';
  @Input() description: string = '';
  @Input() stars: number = 0;
  @Input() createdAt: string = '';

  ngOnInit() {
    console.log('🎨 ShopReviewItem created:', {
      clientId: this.clientId,
      stars: this.stars,
      description: this.description,
      createdAt: this.createdAt
    });
  }

  getInitial(): string {
    return this.clientId?.charAt(0)?.toUpperCase() || '?';
  }
}