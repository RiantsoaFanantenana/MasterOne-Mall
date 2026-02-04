
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-lumina-dark text-white pt-32 pb-16 px-8 md:px-16 overflow-hidden relative reveal">
      <div class="max-w-[1400px] mx-auto relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-32">
          <div class="space-y-12">
            <div class="flex items-center gap-5">
              <div class="bg-lumina-rust p-3 rounded-xl shadow-lg shadow-lumina-rust/20">
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <span class="text-4xl font-black font-outfit tracking-tighter">MasterOne</span>
            </div>
            <p class="text-white/40 text-[13px] leading-relaxed max-w-xs font-medium">An emblematic address dedicated to elegance, gastronomy and culture in the heart of the capital.</p>
            <div class="flex gap-4">
              <a *ngFor="let social of ['FB', 'IG', 'LI', 'PIN']" href="#" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black hover:bg-lumina-rust hover:border-transparent transition-all shadow-sm">
                {{ social }}
              </a>
            </div>
          </div>

          <div class="space-y-12">
            <h4 class="text-[11px] font-black uppercase tracking-[0.5em] text-lumina-tan">Discover</h4>
            <ul class="space-y-5 text-xs font-bold text-white/40">
              <li class="hover:text-white transition-colors cursor-pointer">Our Boutiques</li>
              <li class="hover:text-white transition-colors cursor-pointer">Restaurants & Bars</li>
              <li class="hover:text-white transition-colors cursor-pointer">Culture Agenda</li>
            </ul>
          </div>

          <div class="space-y-12">
            <h4 class="text-[11px] font-black uppercase tracking-[0.5em] text-lumina-tan">MasterOne & You</h4>
            <ul class="space-y-5 text-xs font-bold text-white/40">
              <li class="hover:text-white transition-colors cursor-pointer">Mall Map</li>
              <li class="hover:text-white transition-colors cursor-pointer">Access & Parking</li>
              <li class="hover:text-white transition-colors cursor-pointer">Help & Contact</li>
            </ul>
          </div>

          <div class="space-y-12">
            <h4 class="text-[11px] font-black uppercase tracking-[0.5em] text-lumina-tan">Invitation</h4>
            <p class="text-[13px] text-white/40 font-medium">Join the MasterOne circle for our exclusive events.</p>
            <div class="relative">
              <input type="email" placeholder="your&#64;email.com" class="w-full bg-white/5 border-b border-white/20 py-5 outline-none text-xs focus:border-lumina-rust transition-all" />
            </div>
          </div>
        </div>
        <div class="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <p class="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">© 2024 MasterOne Retail Group • Paris</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
