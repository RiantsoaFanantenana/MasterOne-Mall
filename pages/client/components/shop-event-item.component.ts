
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-event-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group bg-white border border-lumina-olive/5 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all mb-6 relative overflow-hidden">
      <div class="flex justify-between items-start mb-4">
        <span [ngClass]="getStatusClass(status)" class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm">
          {{ status }}
        </span>
        <span *ngIf="!isPublic" class="text-lumina-rust text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Private
        </span>
      </div>
      
      <p class="text-[9px] font-black text-lumina-tan uppercase tracking-widest mb-2">
        {{ startDate | date:'MMM d, y' }} — {{ endDate | date:'MMM d, y' }}
      </p>
      
      <h4 class="font-black font-outfit text-xl text-lumina-olive group-hover:text-lumina-rust transition-colors mb-3">
        {{ title }}
      </h4>
      
      <p class="text-[11px] text-lumina-olive/50 leading-relaxed mb-4">
        {{ description }}
      </p>

      <div class="pt-4 border-t border-lumina-olive/5 flex justify-between items-center">
        <span class="text-[8px] font-bold text-lumina-olive/30 uppercase">Created: {{ createdAt | date:'shortDate' }}</span>
        <button *ngIf="status === 'published'" class="text-[9px] font-black uppercase tracking-widest text-lumina-olive border-b border-lumina-olive/20 hover:text-lumina-rust hover:border-lumina-rust transition-all">
          Details
        </button>
      </div>
    </div>
  `
})
export class ShopEventItemComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() status!: string;
  @Input() isPublic: boolean = true;
  @Input() createdAt!: string;

  getStatusClass(status: string) {
    switch (status) {
      case 'published': return 'bg-lumina-mint text-white';
      case 'draft': return 'bg-lumina-tan text-white';
      case 'archived': return 'bg-lumina-olive/10 text-lumina-olive/40';
      case 'cancelled': return 'bg-lumina-rust text-white';
      default: return 'bg-lumina-olive/5 text-lumina-olive';
    }
  }
}
