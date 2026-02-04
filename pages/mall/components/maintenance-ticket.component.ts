
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-ticket',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-10 rounded-[48px] border border-lumina-olive/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10 group transition-all hover:shadow-2xl hover:-translate-y-1">
      <div class="flex items-center gap-10 w-full md:w-auto">
         <div [ngClass]="status === 'pending' ? 'bg-lumina-tan shadow-lumina-tan/20' : (status === 'validated' ? 'bg-lumina-mint shadow-lumina-mint/20' : 'bg-lumina-rust shadow-lumina-rust/20')" 
              class="w-20 h-20 rounded-[30px] flex items-center justify-center text-white shadow-2xl shrink-0 transition-all duration-500 group-hover:rotate-3">
            <svg *ngIf="status === 'pending'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            <svg *ngIf="status === 'validated'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            <svg *ngIf="status === 'rejected'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
         </div>
         
         <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="text-[10px] font-black text-lumina-tan uppercase tracking-[0.3em]">{{ shop }}</span>
              <span class="w-1.5 h-1.5 rounded-full bg-lumina-tan/30"></span>
              <span class="text-[10px] font-black text-lumina-olive/40 uppercase tracking-[0.2em]">Box {{ box }}</span>
            </div>
            <h4 class="text-2xl font-black text-lumina-olive font-outfit leading-none mb-3">{{ issue }}</h4>
            <p class="text-[10px] text-lumina-olive/30 font-black uppercase tracking-[0.3em]">Protocol Ref: #{{ id }} • Reported {{ date | date:'HH:mm' }}</p>
         </div>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto justify-end">
         <ng-container *ngIf="status === 'pending'">
           <button (click)="onUpdate.emit('rejected')" class="px-10 py-5 bg-lumina-cream text-lumina-rust border border-lumina-rust/10 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-lumina-rust hover:text-white transition-all shadow-sm">Dismiss</button>
           <button (click)="onUpdate.emit('validated')" class="px-12 py-5 bg-lumina-olive text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-lumina-mint transition-all shadow-2xl active:scale-95">Validate Task</button>
         </ng-container>
         
         <div *ngIf="status !== 'pending'" class="flex flex-col items-end pr-8">
            <span class="text-[10px] font-black uppercase text-lumina-tan tracking-[0.3em] mb-1">Finalized Status</span>
            <span class="text-xs font-black uppercase tracking-[0.2em]" [ngClass]="status === 'validated' ? 'text-lumina-mint' : 'text-lumina-rust'">
              {{ status === 'validated' ? 'Protocol Executed' : 'Request Denied' }}
            </span>
         </div>
      </div>
    </div>
  `
})
export class MaintenanceTicketComponent {
  @Input() id!: number;
  @Input() shop!: string;
  @Input() box!: string;
  @Input() date!: string;
  @Input() issue!: string;
  @Input() status!: 'pending' | 'validated' | 'rejected';
  @Output() onUpdate = new EventEmitter<'validated' | 'rejected'>();
}
