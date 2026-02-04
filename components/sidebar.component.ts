
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe.ts';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <!-- Mobile Overlay -->
    <div 
      *ngIf="isOpen" 
      (click)="close.emit()"
      class="fixed inset-0 bg-lumina-dark/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Sidebar Container -->
    <aside 
      [ngClass]="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="fixed lg:relative w-72 h-screen flex-shrink-0 bg-lumina-olive text-lumina-cream flex flex-col shadow-2xl z-50 transition-transform duration-500 ease-out"
    >
      <button 
        (click)="close.emit()"
        class="lg:hidden absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-lumina-rust transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      <div class="p-8 pb-10">
        <div class="flex items-center gap-4 px-2">
          <div [ngClass]="mode === 'admin' ? 'bg-lumina-rust' : 'bg-lumina-mint'" 
               class="p-2.5 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-all duration-300">
            <svg *ngIf="mode === 'admin'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <svg *ngIf="mode === 'shop'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div class="flex flex-col text-white">
            <span class="text-2xl font-black font-outfit tracking-tighter leading-none uppercase">MasterOne</span>
            <span class="text-[9px] uppercase tracking-[0.4em] font-black text-lumina-sage mt-1.5 opacity-60">
              {{ mode === 'admin' ? 'Management' : 'Retail Space' }}
            </span>
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-5 space-y-2 custom-scrollbar no-scrollbar">
        <div class="px-4 mb-4 mt-2">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-lumina-sage/30">Master Intelligence</p>
        </div>
        
        <button 
          *ngFor="let item of getMenuItems()"
          (click)="handleTabChange(item.id)"
          [ngClass]="activeTab === item.id ? 'bg-lumina-sage text-lumina-olive shadow-xl scale-105 translate-x-1' : 'hover:bg-white/5 text-lumina-cream/50 hover:text-white'"
          class="flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden"
        >
          <div *ngIf="activeTab === item.id" 
               [ngClass]="mode === 'admin' ? 'bg-lumina-rust' : 'bg-lumina-mint'"
               class="absolute left-0 w-1.5 h-7 rounded-r-full shadow-lg"></div>
          
          <div [innerHTML]="item.icon | safeHtml" 
               class="w-5 h-5 transition-transform duration-500 group-hover:rotate-6 flex items-center justify-center"
               [class.text-lumina-olive]="activeTab === item.id">
          </div>
          <span class="text-[11px] font-black tracking-widest uppercase">{{ item.label }}</span>
        </button>
      </nav>

      <div class="p-8 mt-auto border-t border-white/5 bg-black/10">
        <div class="flex items-center gap-4">
          <div class="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="flex flex-col text-white">
            <span class="text-[10px] font-black uppercase tracking-widest leading-none">MasterOne Operations</span>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-lumina-mint animate-pulse"></span>
              <span class="text-[9px] uppercase tracking-widest text-lumina-sage/60 font-bold">Secure Session</span>
            </div>
          </div>
        </div>
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
        { id: 'mall', label: 'Overview', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>' },
        { id: 'flux', label: 'Visitor Flow', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>' },
        { id: 'energy', label: 'Grid Control', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
        { id: 'chat', label: 'Master AI', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
      ];
    } else {
      return [
        { id: 'shop', label: 'Dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
        { id: 'sales', label: 'Revenue Log', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect width="20" height="14" x="2" y="5" rx="2"/></svg>' },
        { id: 'marketing', label: 'Campaigns', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>' },
        { id: 'chat', label: 'Retail AI', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
      ];
    }
  }
}
