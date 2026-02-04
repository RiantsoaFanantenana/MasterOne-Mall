
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscription-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-10 lg:p-14 rounded-[48px] border border-lumina-olive/10 shadow-sm animate-in fade-in zoom-in-95 duration-700">
      <div class="flex items-center gap-6 mb-12">
        <div class="w-14 h-14 bg-lumina-rust rounded-2xl flex items-center justify-center text-white shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tighter">Plan Architecture</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-end">
        <div class="space-y-3">
          <label class="erp-label">Strategic Tier Name</label>
          <div class="relative">
            <select [(ngModel)]="sub.name" class="erp-input w-full appearance-none cursor-pointer pr-12">
              <option value="" disabled>Select Tier Protocol</option>
              <option *ngFor="let name of planNames" [value]="name">{{ name }}</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <label class="erp-label">Monthly Rate (€)</label>
          <input [(ngModel)]="sub.price" type="number" class="erp-input w-full" />
        </div>
        <button (click)="submit()" class="erp-button h-[64px]">
          Deploy Plan
        </button>
      </div>
    </div>

    <style>
      .erp-label { @apply text-[10px] font-black uppercase tracking-widest text-lumina-olive/40 ml-6 mb-2 block font-jakarta; }
      .erp-input { @apply px-8 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-[24px] font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all placeholder:text-lumina-olive/20; }
      .erp-button { @apply px-10 py-4 bg-lumina-olive text-white rounded-[24px] font-black uppercase text-[11px] tracking-widest font-outfit shadow-xl hover:bg-lumina-rust transition-all active:scale-95; }
    </style>
  `
})
export class SubscriptionRegistrationComponent {
  @Output() onAdd = new EventEmitter<any>();
  sub = { name: '', price: 0 };

  planNames = [
    'Standard Protocol',
    'Premium House',
    'Elite Partnership',
    'Bespoke Enterprise',
    'V.I.P. Alliance',
    'Legacy Founder'
  ];

  submit() {
    if (this.sub.name) {
      this.onAdd.emit({ ...this.sub });
      this.sub = { name: '', price: 0 };
    }
  }
}
