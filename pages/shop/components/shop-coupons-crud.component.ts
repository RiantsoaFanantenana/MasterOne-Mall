
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coupon } from '../../../types.ts';

@Component({
  selector: 'app-shop-coupons-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-12">
      <div class="flex justify-between items-center">
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tight">Voucher Management</h3>
        <button (click)="showForm.set(true)" class="px-8 py-4 bg-lumina-rust text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Issue New Coupon</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- New Coupon Form -->
        <div *ngIf="showForm()" class="bg-lumina-cream border-2 border-dashed border-lumina-olive/10 p-10 rounded-[40px] flex flex-col space-y-6 animate-in slide-in-from-top-10">
           <div class="space-y-2">
             <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Description</label>
             <input [(ngModel)]="newCoupon.description" placeholder="e.g. VIP Welcome Gift" class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm" />
           </div>
           <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Start</label>
                <input [(ngModel)]="newCoupon.start_date" type="date" class="w-full bg-white p-4 rounded-xl font-bold text-xs" />
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Expiry</label>
                <input [(ngModel)]="newCoupon.end_date" type="date" class="w-full bg-white p-4 rounded-xl font-bold text-xs" />
              </div>
           </div>
           <div class="flex gap-2 pt-4">
              <button (click)="submit()" class="flex-1 py-4 bg-lumina-olive text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Activate</button>
              <button (click)="showForm.set(false)" class="px-6 py-4 bg-white text-lumina-olive rounded-2xl font-black uppercase text-[9px] border border-lumina-olive/10">Cancel</button>
           </div>
        </div>

        <div *ngFor="let c of coupons" class="bg-white p-8 rounded-[40px] border border-lumina-olive/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group flex flex-col">
           <!-- Ticket Perforations -->
           <div class="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-lumina-cream shadow-inner border border-lumina-olive/5"></div>
           <div class="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-lumina-cream shadow-inner border border-lumina-olive/5"></div>

           <div class="flex justify-between items-start mb-6">
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-lumina-tan uppercase tracking-widest mb-1">{{ c.id }}</span>
                <span [ngClass]="c.used_date ? 'bg-lumina-olive/10 text-lumina-olive/40' : 'bg-lumina-mint text-white'" class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest w-fit">
                  {{ c.used_date ? 'Redeemed' : 'Active' }}
                </span>
              </div>
              <button (click)="onDelete.emit(c.id)" class="text-lumina-rust/30 hover:text-lumina-rust transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
           </div>
           
           <h4 class="text-xl font-black text-lumina-olive mb-4 font-outfit leading-tight">{{ c.description }}</h4>
           
           <div class="mt-auto pt-6 border-t border-dashed border-lumina-olive/10 flex justify-between items-end">
              <div>
                <p class="text-[8px] font-black text-lumina-tan uppercase mb-1">Validity</p>
                <p class="text-[10px] font-bold text-lumina-olive/60">{{ c.start_date | date:'shortDate' }} — {{ c.end_date | date:'shortDate' }}</p>
              </div>
              <button *ngIf="!c.used_date" (click)="onUse.emit(c.id)" class="px-4 py-2 bg-lumina-rust/10 text-lumina-rust rounded-lg text-[9px] font-black uppercase hover:bg-lumina-rust hover:text-white transition-all">Mark as Used</button>
           </div>
        </div>
      </div>
    </div>
  `
})
export class ShopCouponsCrudComponent {
  @Input() coupons: Coupon[] = [];
  @Output() onAdd = new EventEmitter<Partial<Coupon>>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUse = new EventEmitter<string>();
  showForm = signal(false);

  newCoupon = { description: '', start_date: '', end_date: '' };

  submit() {
    if (this.newCoupon.description) {
      this.onAdd.emit(this.newCoupon);
      this.newCoupon = { description: '', start_date: '', end_date: '' };
      this.showForm.set(false);
    }
  }
}
