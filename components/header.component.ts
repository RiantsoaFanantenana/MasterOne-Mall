
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-24 lg:h-20 border-b border-lumina-olive/5 flex items-center justify-between px-6 lg:px-10 bg-white/90 backdrop-blur-xl sticky top-0 z-30">
      <div class="flex items-center gap-4 lg:gap-6 w-full max-w-xl">
        <!-- Mobile Menu Toggle -->
        <button 
          (click)="toggleSidebar.emit()"
          class="lg:hidden p-3 rounded-2xl bg-lumina-olive/5 text-lumina-olive hover:bg-lumina-rust hover:text-white transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>

        <!-- Search Bar -->
        <div class="hidden sm:flex items-center gap-4 bg-lumina-olive/5 px-6 py-3 rounded-2xl border border-lumina-olive/5 w-full shadow-inner focus-within:bg-white focus-within:shadow-lg focus-within:border-lumina-rust/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-40 text-lumina-olive"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            class="bg-transparent border-none outline-none text-[13px] w-full text-lumina-olive font-bold placeholder:text-lumina-olive/30"
          />
        </div>
      </div>

      <div class="flex items-center gap-4 lg:gap-8">
        <!-- Notifications -->
        <button class="relative p-3 rounded-2xl hover:bg-lumina-olive/5 transition-colors text-lumina-olive group">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-12 transition-transform"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span class="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-lumina-rust border-2 border-white rounded-full shadow-sm"></span>
        </button>

        <div class="h-10 w-[1px] bg-lumina-olive/10 hidden lg:block"></div>

        <!-- User Profile -->
        <div class="flex items-center gap-4 group cursor-pointer">
          <div class="hidden md:flex flex-col text-right">
            <p class="text-xs font-black text-lumina-olive tracking-tight leading-none mb-1 group-hover:text-lumina-rust transition-colors uppercase">HQ Operations</p>
            <p class="text-[9px] text-lumina-tan uppercase font-black tracking-[0.2em] leading-none opacity-60">Control Center</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-lumina-olive flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}
