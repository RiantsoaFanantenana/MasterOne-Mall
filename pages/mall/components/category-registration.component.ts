
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-12 lg:p-14 rounded-[50px] border border-lumina-olive/10 shadow-sm animate-in fade-in zoom-in-95 duration-700">
      <div class="flex items-center gap-6 mb-12">
        <div class="w-14 h-14 bg-lumina-tan rounded-[24px] flex items-center justify-center text-white shadow-xl -rotate-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
        </div>
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tighter">Segment Architecture</h3>
      </div>

      <div class="flex flex-col md:flex-row gap-10 items-end">
        <div class="flex-1 space-y-3 w-full">
          <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Category Protocol Name</label>
          <input [(ngModel)]="name" placeholder="e.g. Haute Couture" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive text-lg shadow-inner shadow-black/5 outline-none focus:border-lumina-rust transition-all placeholder:text-lumina-olive/20" />
        </div>
        <button (click)="submit()" class="w-full px-8 py-4 bg-lumina-olive text-white rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] font-outfit shadow-2xl hover:bg-lumina-rust transition-all active:scale-95 h-[70px] md:w-auto px-16">
          Register Protocol
        </button>
      </div>
    </div>
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
