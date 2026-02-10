
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoxTicket } from '../../../types.ts';

@Component({
  selector: 'app-shop-tickets-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-12">
      <div class="bg-white p-12 rounded-[50px] border border-lumina-olive/10 shadow-sm">
        <h3 class="text-2xl font-black text-lumina-olive font-outfit uppercase tracking-tight mb-8">Signal Technical Protocol Failure</h3>
        <div class="flex gap-4">
           <input [(ngModel)]="desc" placeholder="Describe the maintenance issue (lighting, A/C, sensors)..." class="flex-1 px-8 py-5 bg-lumina-cream rounded-3xl font-bold text-lumina-olive outline-none focus:border-lumina-rust border border-transparent transition-all" />
           <button (click)="submit()" class="px-10 py-5 bg-lumina-olive text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Submit Ticket</button>
        </div>
      </div>

      <div class="space-y-6">
        <div *ngFor="let t of tickets" class="bg-white p-8 rounded-[40px] border border-lumina-olive/5 shadow-sm flex items-center justify-between group hover:border-lumina-olive/20 transition-all">
           <div class="flex items-center gap-8">
              <div [ngClass]="t.validation_date ? 'bg-lumina-mint' : (t.rejection_date ? 'bg-lumina-rust' : 'bg-lumina-tan')" class="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <div>
                 <h4 class="text-xl font-black text-lumina-olive leading-tight mb-1">{{ t.description }}</h4>
                 <p class="text-[9px] font-black text-lumina-tan uppercase tracking-widest">Ticket Ref: #{{ t.id }} • Reported {{ t.create_at | date:'mediumDate' }}</p>
              </div>
           </div>
           <div class="text-right">
              <span [ngClass]="t.validation_date ? 'text-lumina-mint' : (t.rejection_date ? 'text-lumina-rust' : 'text-lumina-tan')" class="text-[10px] font-black uppercase tracking-[0.2em]">
                 {{ t.validation_date ? 'Resolution Confirmed' : (t.rejection_date ? 'Request Denied' : 'Awaiting Assignment') }}
              </span>
           </div>
        </div>
      </div>
    </div>
  `
})
export class ShopTicketsManagerComponent {
  @Input() tickets: BoxTicket[] = [];
  @Output() onAdd = new EventEmitter<string>();
  desc = '';

  submit() {
    if (this.desc.trim()) {
      this.onAdd.emit(this.desc);
      this.desc = '';
    }
  }
}
