
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscription-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-12 lg:p-14 rounded-[50px] border border-lumina-olive/10 shadow-sm animate-in fade-in zoom-in-95 duration-700">
      <div class="flex items-center gap-6 mb-12">
        <div class="w-14 h-14 bg-lumina-rust rounded-[24px] flex items-center justify-center text-white shadow-xl rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tighter">Strategic Tiers</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
        <div class="space-y-3">
          <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Plan Identifier</label>
          <div class="relative group">
            <select [(ngModel)]="sub.name" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive text-lg shadow-inner shadow-black/5 outline-none focus:border-lumina-rust transition-all placeholder:text-lumina-olive/20 appearance-none pr-14 cursor-pointer">
              <option value="" disabled>Select Tier...</option>
              <option *ngFor="let name of planNames" [value]="name">{{ name }}</option>
            </select>
            <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30 group-focus-within:text-lumina-rust transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Monthly Rate (€)</label>
          <input [(ngModel)]="sub.price" type="number" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive text-lg shadow-inner shadow-black/5 outline-none focus:border-lumina-rust transition-all placeholder:text-lumina-olive/20" />
        </div>
        <button (click)="submit()" class="w-full px-8 py-4 bg-lumina-olive text-white rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] font-outfit shadow-2xl hover:bg-lumina-rust transition-all active:scale-95 h-[70px]">
          Deploy Protocol
        </button>
      </div>
    </div>
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
