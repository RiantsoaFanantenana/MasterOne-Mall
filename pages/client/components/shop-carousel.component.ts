
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-lumina-dark py-32 overflow-hidden reveal">
      <div class="px-8 md:px-16 mb-20 max-w-[1400px] mx-auto reveal reveal-left">
        <h2 class="text-4xl md:text-5xl font-black font-outfit text-white tracking-tighter mb-4">Prestige Houses</h2>
        <p class="text-lumina-tan font-black uppercase tracking-[0.4em] text-[10px]">Excellence gathered under one roof</p>
      </div>
      
      <div class="flex gap-8 px-8 overflow-x-auto pb-12 no-scrollbar reveal reveal-right">
        <div *ngFor="let store of items" class="flex-shrink-0 w-80 h-[450px] bg-white rounded-2xl overflow-hidden group relative cursor-pointer shadow-xl">
          <img [src]="store.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
          <div class="absolute bottom-10 left-8 right-8 text-white">
            <h4 class="text-2xl font-black font-outfit mb-2">{{ store.name }}</h4>
            <p class="text-[10px] font-bold text-white/70 uppercase tracking-widest">Level {{ store.floor }}</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ShopCarouselComponent {
  @Input() items: any[] = [];
}
