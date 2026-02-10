
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe.ts';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div *ngIf="isOpen" (click)="close.emit()" class="fixed inset-0 bg-lumina-dark/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"></div>

    <aside [ngClass]="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="fixed lg:relative w-72 h-screen flex-shrink-0 bg-lumina-olive text-lumina-cream flex flex-col shadow-2xl z-50 transition-transform duration-500 ease-out">
      
      <div class="p-8 pb-10">
        <div class="flex items-center gap-4 px-2">
          <div [ngClass]="mode === 'admin' ? 'bg-lumina-rust' : 'bg-lumina-mint'" 
               class="p-2.5 rounded-2xl shadow-lg transform -rotate-3 transition-all duration-300">
            <svg *ngIf="mode === 'admin'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <svg *ngIf="mode === 'shop'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div class="flex flex-col text-white">
            <span class="text-2xl font-black font-outfit tracking-tighter leading-none uppercase">MasterOne</span>
            <span class="text-[9px] uppercase tracking-[0.4em] font-black text-lumina-sage mt-1.5 opacity-60">
              {{ mode === 'admin' ? 'Operations' : 'Storefront' }}
            </span>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-5 space-y-1.5 custom-scrollbar no-scrollbar">
        <div class="px-4 mb-3 mt-2">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-lumina-sage/30">Management</p>
        </div>
        
        <button 
          *ngFor="let item of getMenuItems()"
          (click)="handleTabChange(item.id)"
          [ngClass]="activeTab === item.id ? 'bg-lumina-sage text-lumina-olive shadow-xl scale-[1.02]' : 'hover:bg-white/5 text-lumina-cream/50 hover:text-white'"
          class="flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden"
        >
          <div [innerHTML]="item.icon | safeHtml" class="w-5 h-5 flex items-center justify-center transition-colors" [class.text-lumina-olive]="activeTab === item.id"></div>
          <span class="text-[11px] font-black tracking-widest uppercase text-left leading-tight">{{ item.label }}</span>
        </button>
      </nav>

      <div class="mt-auto p-5 pb-8">
        <button (click)="logout.emit()" class="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-lumina-cream/40 hover:text-white hover:bg-lumina-rust/20 transition-all group">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span class="text-[11px] font-black uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() mode: 'admin' | 'shop' = 'admin';
  @Input() activeTab: string = '';
  @Input() isOpen: boolean = false;
  @Output() tabChange = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  handleTabChange(id: string) {
    this.tabChange.emit(id);
    this.close.emit();
  }

  getMenuItems() {
    if (this.mode === 'admin') {
      return [
        { id: 'mall', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
        { id: 'infrastructure', label: 'Infrastructure', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/></svg>' },
        { id: 'finance', label: 'Finance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
        { id: 'contracts', label: 'Contracts', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>' },
        { id: 'maintenance', label: 'Maintenance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
        { id: 'ai-assistant', label: 'AI Strategist', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.3"/><path d="M12 12l9.8 3.6"/><path d="M12 12l-5.2 8.5"/></svg>' },
      ];
    } else {
      return [
        { id: 'shop', label: 'Overview', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
        { id: 'shop-profile', label: 'Maison Identity', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>' },
        { id: 'shop-events', label: 'Agenda Protocol', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
        { id: 'shop-discounts', label: 'Strategic Offers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" x2="12" y1="18" y2="6"/></svg>' },
        { id: 'shop-coupons', label: 'VIP Vouchers', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect width="20" height="14" x="2" y="5" rx="2"/></svg>' },
        { id: 'shop-maintenance', label: 'Ops Tickets', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
        { id: 'shop-subscription', label: 'Membership Plan', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>' },
        { id: 'shop-chat', label: 'Client Concierge', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
        { id: 'ai-assistant', label: 'AI Strategist', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.3"/><path d="M12 12l9.8 3.6"/><path d="M12 12l-5.2 8.5"/></svg>' },
      ];
    }
  }
}
