
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer shadow-xl reveal motion-item"
         [ngClass]="staggerClass">
      
      <!-- Cover Pic -->
      <img [src]="coverPic" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-lumina-dark/90 via-lumina-dark/20 to-transparent"></div>
      
      <!-- Content -->
      <div class="absolute inset-x-0 bottom-0 p-10 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl bg-white p-1 shadow-lg overflow-hidden flex-shrink-0">
            <img [src]="logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <span class="text-[9px] font-black text-lumina-tan uppercase tracking-[0.3em]">Box {{ boxId }}</span>
            <h3 class="text-3xl font-black text-white font-outfit leading-tight">{{ name }}</h3>
          </div>
        </div>
        
        <p class="text-white/70 text-xs leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 line-clamp-3 font-medium">
          {{ description }}
        </p>
        
        <button (click)="select.emit(); $event.stopPropagation()" class="text-white text-[10px] font-black uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-all">
          Visit Store
        </button>
      </div>
    </div>

    <style>
      .motion-item {
        transition: transform 4.5s cubic-bezier(0.15, 1, 0.3, 1), opacity 3.5s ease !important;
      }
    </style>
  `
})
export class ShopItemComponent {
  @Input() coverPic!: string;
  @Input() logo!: string;
  @Input() boxId!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() staggerClass: string = '';
  @Output() select = new EventEmitter<void>();
}
