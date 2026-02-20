
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Discount, Coupon } from '../../../types.ts';

@Component({
  selector: 'app-shop-discounts-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 space-y-10">
        <div class="flex justify-between items-center">
          <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tight">Strategic Offers</h3>
          <button (click)="showForm.set(true)" class="px-8 py-4 bg-lumina-olive text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Launch Deal</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div *ngIf="showForm()" class="bg-lumina-cream border-2 border-dashed border-lumina-olive/10 p-8 rounded-[40px] space-y-6">
             <input [(ngModel)]="newDiscount.title" placeholder="Offer Title..." class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm" />
             <input [(ngModel)]="newDiscount.value" placeholder="Discount Value (e.g. 20%)" class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm" />
             <div class="grid grid-cols-2 gap-4">
                <input [(ngModel)]="newDiscount.start_date" type="date" class="bg-white p-4 rounded-xl font-bold text-xs" />
                <input [(ngModel)]="newDiscount.end_date" type="date" class="bg-white p-4 rounded-xl font-bold text-xs" />
             </div>
             <button (click)="submit()" class="w-full py-4 bg-lumina-rust text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Deploy Offer</button>
          </div>

          <div *ngFor="let d of discounts" class="bg-white p-8 rounded-[40px] border border-lumina-olive/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
             <div class="absolute -right-6 -top-6 w-24 h-24 bg-lumina-rust/5 rounded-full group-hover:scale-150 transition-transform"></div>
             <div class="flex justify-between items-start mb-6 relative z-10">
                <span class="text-4xl font-black text-lumina-rust font-outfit">{{ d.value }}</span>
                <button (click)="onDelete.emit(d.id)" class="text-lumina-olive/20 hover:text-lumina-rust transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
             </div>
             <h4 class="text-lg font-black text-lumina-olive mb-2 uppercase tracking-tight">{{ d.title }}</h4>
             <p class="text-[10px] font-black text-lumina-tan uppercase">Ends {{ d.end_date | date }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-[50px] border border-lumina-olive/10 p-10 h-fit">
        <h3 class="text-xl font-black text-lumina-olive font-outfit uppercase tracking-tight mb-8">Active Coupons</h3>
        <div class="space-y-4">
          <div *ngFor="let c of coupons" class="p-6 bg-lumina-cream rounded-3xl border border-lumina-olive/5 flex justify-between items-center group">
             <div>
               <p class="text-xs font-black text-lumina-olive">{{ c.description }}</p>
               <p class="text-[9px] font-black text-lumina-tan uppercase tracking-widest mt-1">Ref: {{ c.id }}</p>
             </div>
             <div *ngIf="c.used_date" class="text-lumina-mint"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShopDiscountsCrudComponent {
  @Input() discounts: Discount[] = [];
  @Input() coupons: Coupon[] = [];
  @Output() onAdd = new EventEmitter<Partial<Discount>>();
  @Output() onDelete = new EventEmitter<number>();
  showForm = signal(false);

  newDiscount = { title: '', value: '', start_date: '', end_date: '', description: '', status: 'active' as const };

  submit() {
    if (this.newDiscount.title) {
      this.onAdd.emit(this.newDiscount);
      this.newDiscount = { title: '', value: '', start_date: '', end_date: '', description: '', status: 'active' };
      this.showForm.set(false);
    }
  }
}
