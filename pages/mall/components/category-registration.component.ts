
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-10 lg:p-14 rounded-[48px] border border-lumina-olive/10 shadow-sm animate-in fade-in zoom-in-95 duration-700">
      <div class="flex items-center gap-6 mb-12">
        <div class="w-14 h-14 bg-lumina-tan rounded-2xl flex items-center justify-center text-white shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tighter">Merchant Categories</h3>
      </div>

      <div class="flex flex-col md:flex-row gap-8 lg:gap-10 items-end">
        <div class="flex-1 space-y-3 w-full">
          <label class="erp-label">Category Title</label>
          <input [(ngModel)]="name" placeholder="e.g. Haute Horlogerie" class="erp-input w-full" />
        </div>
        <button (click)="submit()" class="erp-button h-[64px] whitespace-nowrap">
          Register Category
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
export class CategoryRegistrationComponent {
  @Output() onAdd = new EventEmitter<string>();
  name = '';

  submit() {
    if (this.name) {
      this.onAdd.emit(this.name);
      this.name = '';
    }
  }
}
