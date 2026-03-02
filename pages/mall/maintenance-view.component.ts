
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceTicketComponent } from './components/maintenance-ticket.component';

interface Ticket {
  id: number;
  shop: string;
  box: string;
  date: string;
  issue: string;
  status: 'pending' | 'validated' | 'rejected';
}

@Component({
  selector: 'app-maintenance-view',
  standalone: true,
  imports: [CommonModule, MaintenanceTicketComponent],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <div class="flex justify-between items-center mb-6">
         <h3 class="text-3xl font-black text-lumina-olive uppercase tracking-tighter font-outfit">Task Management Protocols</h3>
         <div class="flex items-center gap-3 bg-lumina-mint/5 px-6 py-3 rounded-[24px] border border-lumina-mint/10">
            <span class="w-2 h-2 rounded-full bg-lumina-mint animate-pulse shadow-lg shadow-lumina-mint/50"></span>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-lumina-mint">Technical Units Standby</span>
         </div>
      </div>

      <div class="grid grid-cols-1 gap-8">
        <app-maintenance-ticket 
          *ngFor="let t of tickets()"
          [id]="t.id"
          [shop]="t.shop"
          [box]="t.box"
          [date]="t.date"
          [issue]="t.issue"
          [status]="t.status"
          (onUpdate)="updateStatus(t.id, $event)"
        ></app-maintenance-ticket>
      </div>
    </div>
  `
})
export class MaintenanceViewComponent {
  tickets = signal<Ticket[]>([
    { id: 1401, shop: 'Elysian Garments', box: 'A-101', date: new Date().toISOString(), issue: 'Climate Protocol Instability', status: 'pending' },
    { id: 1402, shop: 'Stellar Gems', box: 'B-005', date: new Date().toISOString(), issue: 'Biometric Entrance Delay', status: 'pending' },
    { id: 1403, shop: 'L’Art du Chocolat', box: 'C-202', date: new Date().toISOString(), issue: 'Ambient Luminosity Flicker', status: 'validated' },
  ]);

  updateStatus(id: number, status: 'validated' | 'rejected') {
    this.tickets.update(list => list.map(t => t.id === id ? { ...t, status } : t));
  }
}
