
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-univers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-32 px-8 md:px-16 max-w-[1400px] mx-auto overflow-hidden reveal">
      <div class="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <div class="max-w-xl reveal reveal-left">
          <p class="text-lumina-tan font-black uppercase tracking-[0.4em] text-[10px] mb-4">Inspiration</p>
          <h2 class="text-5xl md:text-6xl font-black font-outfit text-lumina-olive tracking-tighter leading-none">Three Universes, One Unique Destination</h2>
        </div>
        <div class="w-32 h-[1px] bg-lumina-olive/20 hidden md:block reveal reveal-right"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div *ngFor="let pillar of items; let i = index" 
             class="group relative h-[650px] rounded-2xl overflow-hidden cursor-pointer shadow-3xl reveal"
             [ngStyle]="{'transition-delay': (i * 0.15) + 's'}">
          <img [src]="pillar.image" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-lumina-dark/95 via-transparent to-transparent"></div>
          <div class="absolute bottom-14 left-10 right-10">
            <span class="text-[10px] font-black text-lumina-tan uppercase tracking-[0.4em] mb-4 block">{{ pillar.category }}</span>
            <h3 class="text-4xl font-black text-white font-outfit mb-5 leading-tight">{{ pillar.title }}</h3>
            <p class="text-white/70 text-xs leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">{{ pillar.desc }}</p>
            <button class="text-white text-[10px] font-black uppercase tracking-widest border-b border-white/30 pb-1">Immerse</button>
          </div>
        </div>
      </div>
    </section>
  `
})
export class UniversComponent {
  @Input() items: any[] = [];
}
