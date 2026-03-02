
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopDiscountItemComponent } from './shop-discount-item.component';

@Component({
  selector: 'app-shop-discounts-list',
  standalone: true,
  imports: [CommonModule, ShopDiscountItemComponent],
  template: `
    <div class="space-y-10">
      <div class="flex items-center gap-4">
         <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-lumina-rust">Privilege History</h3>
         <div class="flex-1 h-[1px] bg-lumina-rust/10"></div>
      </div>

      <div class="space-y-4 min-h-[50px]">
        <div *ngIf="discounts.length === 0" class="py-16 border-2 border-dashed border-lumina-olive/10 rounded-[32px] text-center">
          <p class="text-[10px] font-black text-lumina-olive/30 uppercase tracking-widest">No historical discounts</p>
        </div>

        <div *ngFor="let d of discounts; let i = index" 
             class="animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both"
             [style.animation-delay]="(i * 100) + 'ms'">
          <app-shop-discount-item
            [title]="d.title"
            [description]="d.description"
            [value]="d.value"
            [startDate]="d.start_date"
            [endDate]="d.end_date"
            [status]="d.status"
            [createdAt]="d.created_at"
            class="block"
          ></app-shop-discount-item>
        </div>
      </div>
    </div>
  `
})
export class ShopDiscountsListComponent {
  @Input() discounts: any[] = [];
}
