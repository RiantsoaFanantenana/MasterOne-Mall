
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MallEvent } from '../../../types';

@Component({
  selector: 'app-shop-events-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-10">
      <div class="flex justify-between items-center">
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tight">Event Protocols</h3>
        <button (click)="showForm.set(true)" class="px-8 py-4 bg-lumina-rust text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">New Event</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- New Event Form -->
        <div *ngIf="showForm()" class="bg-lumina-cream border-2 border-dashed border-lumina-olive/10 p-10 rounded-[40px] flex flex-col space-y-6 animate-in slide-in-from-top-10">
           <input [(ngModel)]="newEvent.title" placeholder="Event Title..." class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm" />
           <textarea [(ngModel)]="newEvent.description" placeholder="Narrative..." class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm resize-none" rows="3"></textarea>
           <div class="grid grid-cols-2 gap-4">
              <input [(ngModel)]="newEvent.start_date" type="date" class="bg-white p-4 rounded-xl font-bold text-xs" />
              <input [(ngModel)]="newEvent.end_date" type="date" class="bg-white p-4 rounded-xl font-bold text-xs" />
           </div>
           <div class="flex items-center gap-4 px-2">
             <label class="text-[10px] font-black uppercase text-lumina-olive/40 flex items-center gap-2 cursor-pointer">
               <input type="checkbox" [(ngModel)]="newEvent.is_public" class="w-4 h-4 rounded-md accent-lumina-rust"> Public Event
             </label>
           </div>
           <div class="flex gap-2">
              <button (click)="submit()" class="flex-1 py-4 bg-lumina-olive text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Deploy</button>
              <button (click)="showForm.set(false)" class="px-6 py-4 bg-white text-lumina-olive rounded-2xl font-black uppercase text-[9px] border border-lumina-olive/10">Cancel</button>
           </div>
        </div>

        <div *ngFor="let e of events" class="bg-white p-8 rounded-[40px] border border-lumina-olive/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
           <div class="flex justify-between items-start mb-6">
              <span [ngClass]="e.status === 'published' ? 'bg-lumina-mint' : 'bg-lumina-tan'" class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white">{{ e.status }}</span>
              <button (click)="onDelete.emit(e.id)" class="text-lumina-rust/30 hover:text-lumina-rust transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
           </div>
           <h4 class="text-2xl font-black text-lumina-olive mb-3 font-outfit">{{ e.title }}</h4>
           <p class="text-[11px] text-lumina-olive/50 leading-relaxed mb-6 line-clamp-2">{{ e.description }}</p>
           <div class="pt-6 border-t border-lumina-olive/5 flex justify-between items-center">
              <span class="text-[10px] font-black text-lumina-tan uppercase">{{ e.start_date | date:'MMM d' }} — {{ e.end_date | date:'MMM d' }}</span>
              <span class="text-[9px] font-black uppercase text-lumina-rust">{{ e.is_public ? 'Public' : 'VIP' }}</span>
           </div>
        </div>
      </div>
    </div>
  `
})
export class ShopEventsCrudComponent {
  @Input() events: MallEvent[] = [];
  @Output() onAdd = new EventEmitter<Partial<MallEvent>>();
  @Output() onDelete = new EventEmitter<number>();
  showForm = signal(false);

  newEvent = { title: '', description: '', start_date: '', end_date: '', is_public: true, status: 'published' as const };

  submit() {
    if (this.newEvent.title) {
      this.onAdd.emit(this.newEvent);
      this.newEvent = { title: '', description: '', start_date: '', end_date: '', is_public: true, status: 'published' };
      this.showForm.set(false);
    }
  }
}
