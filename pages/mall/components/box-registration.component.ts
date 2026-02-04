
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-box-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-10 lg:p-14 rounded-[48px] border border-lumina-olive/10 shadow-sm animate-in fade-in zoom-in-95 duration-700">
      <div class="flex items-center gap-6 mb-12">
        <div class="w-14 h-14 bg-lumina-olive rounded-2xl flex items-center justify-center text-white shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
        </div>
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tighter">Asset Registration</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        <div class="space-y-3">
          <label class="erp-label">Box Identifier</label>
          <input [(ngModel)]="box.box_number" placeholder="e.g. A-105" class="erp-input w-full" />
        </div>
        <div class="space-y-3">
          <label class="erp-label">Floor Level</label>
          <input [(ngModel)]="box.floor" type="number" class="erp-input w-full" />
        </div>
        <div class="space-y-3">
          <label class="erp-label">Surface (m²)</label>
          <input [(ngModel)]="box.surface_area" type="number" class="erp-input w-full" />
        </div>
        <button (click)="submit()" class="erp-button self-end h-[64px]">
          Add Box Asset
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
export class BoxRegistrationComponent {
  @Output() onAdd = new EventEmitter<any>();
  box = { box_number: '', floor: 0, surface_area: 0 };

  submit() {
    if (this.box.box_number) {
      this.onAdd.emit({ ...this.box });
      this.box = { box_number: '', floor: 0, surface_area: 0 };
    }
  }
}
