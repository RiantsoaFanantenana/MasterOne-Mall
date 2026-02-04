
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-[32px] border border-lumina-olive/10 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-lumina-rust/5 rounded-full group-hover:scale-150 transition-transform"></div>
          <p class="text-[10px] font-black uppercase tracking-widest text-lumina-tan mb-2">Projected Rent (Nov)</p>
          <h3 class="text-4xl font-black text-lumina-olive">428,500 €</h3>
          <p class="mt-4 text-[9px] font-bold text-lumina-mint uppercase">↑ 12.4% vs last period</p>
        </div>
        <div class="bg-white p-8 rounded-[32px] border border-lumina-olive/10 shadow-sm">
          <p class="text-[10px] font-black uppercase tracking-widest text-lumina-tan mb-2">Revenue from Premium</p>
          <h3 class="text-4xl font-black text-lumina-olive">84,200 €</h3>
          <p class="mt-4 text-[9px] font-bold text-lumina-rust uppercase">68% adoption rate</p>
        </div>
        <div class="bg-lumina-rust p-8 rounded-[32px] text-white shadow-xl">
          <p class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Unpaid Balances</p>
          <h3 class="text-4xl font-black">12,850 €</h3>
          <p class="mt-4 text-[9px] font-bold uppercase tracking-widest">3 Alerts active</p>
        </div>
      </div>

      <div class="bg-white rounded-[40px] border border-lumina-olive/10 shadow-sm overflow-hidden">
        <div class="p-8 border-b border-lumina-olive/5 flex justify-between items-center">
          <h3 class="text-xl font-black text-lumina-olive uppercase tracking-tight">Financial Ledger: Rent History</h3>
          <div class="flex gap-4">
            <button class="px-6 py-2.5 bg-lumina-cream text-lumina-olive rounded-xl text-[10px] font-black uppercase hover:bg-white border border-lumina-olive/10 transition-all">Export CSV</button>
            <button class="px-6 py-2.5 bg-lumina-olive text-white rounded-xl text-[10px] font-black uppercase hover:bg-lumina-rust transition-all shadow-lg shadow-lumina-olive/20">Generate Invoices</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <tr class="bg-lumina-cream text-[9px] font-black uppercase tracking-widest text-lumina-olive/40">
              <th class="px-8 py-6">Reference Box</th>
              <th class="px-8 py-6">Surface</th>
              <th class="px-8 py-6">Created Date</th>
              <th class="px-8 py-6">Calculated Rent</th>
              <th class="px-8 py-6">Payment Status</th>
              <th class="px-8 py-6">Action</th>
            </tr>
            <tr *ngFor="let r of rentHistory" class="border-t border-lumina-olive/5 text-sm font-bold group hover:bg-lumina-cream/30 transition-all">
              <td class="px-8 py-6">Box {{ r.box_number }}</td>
              <td class="px-8 py-6">{{ r.surface }}m²</td>
              <td class="px-8 py-6">{{ r.date | date:'mediumDate' }}</td>
              <td class="px-8 py-6">{{ r.amount }} €</td>
              <td class="px-8 py-6">
                <span [ngClass]="r.paid ? 'bg-lumina-mint' : 'bg-lumina-rust'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase text-white">
                  {{ r.paid ? 'Confirmed' : 'Pending' }}
                </span>
              </td>
              <td class="px-8 py-6">
                <button class="w-8 h-8 rounded-lg bg-lumina-olive/5 text-lumina-olive hover:bg-lumina-olive hover:text-white transition-all flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `
})
export class FinanceViewComponent {
  rentHistory = [
    { box_number: 'A-101', surface: 120, date: '2024-11-01', amount: 12500, paid: true },
    { box_number: 'B-005', surface: 85, date: '2024-11-01', amount: 8400, paid: true },
    { box_number: 'C-202', surface: 60, date: '2024-11-01', amount: 5200, paid: false },
    { box_number: 'A-101', surface: 120, date: '2024-10-01', amount: 12500, paid: true }
  ];
}
