
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative h-[95vh] overflow-hidden flex items-center justify-center motion-slide-in">
      <img 
        src="https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80&w=2400" 
        class="absolute inset-0 w-full h-full object-cover scale-110"
        alt="MasterOne Mall Interior"
      />
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="relative z-10 text-center text-white px-6">
        <p class="text-[11px] md:text-xs uppercase tracking-[0.9em] font-black opacity-80 mb-8 animate-pulse">French Art de Vivre</p>
        <h1 class="text-7xl md:text-9xl font-black font-outfit tracking-tighter mb-10 drop-shadow-2xl text-white">MasterOne</h1>
        <p class="text-lg md:text-2xl uppercase tracking-[0.4em] font-light opacity-90 mb-14 max-w-3xl mx-auto leading-relaxed">The sanctuary of refinement in the heart of Paris</p>
        <div class="flex flex-col md:flex-row justify-center gap-8">
          <button class="px-14 py-6 bg-white text-lumina-olive rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Discover Map</button>
          <button class="px-14 py-6 border-2 border-white/50 backdrop-blur-md text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-lumina-olive transition-all">250 Houses of Excellence</button>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent {}
