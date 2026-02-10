
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-box-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-12 lg:p-14 rounded-[50px] border border-lumina-olive/10 shadow-sm animate-in fade-in zoom-in-95 duration-700">
      <div class="flex items-center gap-6 mb-12">
        <div class="w-14 h-14 bg-lumina-olive rounded-[24px] flex items-center justify-center text-white shadow-xl rotate-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
        </div>
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tighter">Space Asset Registry</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 items-end">
        <div class="space-y-3">
          <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Box Reference</label>
          <input [(ngModel)]="box.box_number" placeholder="e.g. A-105" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all" />
        </div>
        <div class="space-y-3">
          <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Floor Level</label>
          <input [(ngModel)]="box.floor" type="number" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all" />
        </div>
        <div class="space-y-3">
          <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Surface (m²)</label>
          <input [(ngModel)]="box.surface_area" type="number" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all" />
        </div>
        <button (click)="submit()" class="w-full px-8 py-4 bg-lumina-olive text-white rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] font-outfit shadow-2xl hover:bg-lumina-rust transition-all active:scale-95 flex items-center justify-center gap-2 h-[70px]">
          Archive Asset
        </button>
      </div>
    </div>
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
