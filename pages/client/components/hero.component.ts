import { Component, Output, EventEmitter, Input } from '@angular/core';
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
        <!-- Personalized greeting based on login status -->
        <div class="flex items-center justify-center gap-3 mb-6">
          <p class="text-[11px] md:text-xs uppercase tracking-[0.9em] font-black opacity-80 animate-pulse">
            {{ isLoggedIn ? 'Bienvenue de retour' : 'French Art de Vivre' }}
          </p>
          <span *ngIf="isLoggedIn" class="px-4 py-1 bg-lumina-mint text-white rounded-full text-[8px] font-black uppercase tracking-widest">
            VIP Member
          </span>
        </div>
        
        <h1 class="text-7xl md:text-9xl font-black font-outfit tracking-tighter mb-10 drop-shadow-2xl text-white">
          {{ isLoggedIn ? 'Your Journey' : 'MasterOne' }}
        </h1>
        
        <p class="text-lg md:text-2xl uppercase tracking-[0.4em] font-light opacity-90 mb-14 max-w-3xl mx-auto leading-relaxed">
          {{ isLoggedIn 
            ? 'Continue exploring the sanctuary of refinement' 
            : 'The sanctuary of refinement in the heart of Paris' 
          }}
        </p>
        
        <div class="flex flex-col md:flex-row justify-center gap-8">
          <button (click)="onDiscoverMap.emit()" 
                  class="px-14 py-6 bg-white text-lumina-olive rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
            {{ isLoggedIn ? 'Interactive Map' : 'Discover Map' }}
          </button>
          
          <button (click)="onViewBoutiques.emit()" 
                  class="px-14 py-6 border-2 border-white/50 backdrop-blur-md text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-lumina-olive transition-all">
            {{ isLoggedIn ? 'Your Favorites' : '250 Houses of Excellence' }}
          </button>
        </div>

        <!-- Quick stats for logged in users -->
        <div *ngIf="isLoggedIn" class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-12 text-white/80 text-[10px] font-black uppercase tracking-widest">
          <div class="text-center">
            <span class="block text-2xl text-lumina-mint mb-1">12</span>
            <span>Favorites</span>
          </div>
          <div class="text-center">
            <span class="block text-2xl text-lumina-mint mb-1">3</span>
            <span>Upcoming</span>
          </div>
          <div class="text-center">
            <span class="block text-2xl text-lumina-mint mb-1">5</span>
            <span>Coupons</span>
          </div>
        </div>

        <!-- Scroll indicator for non-logged in -->
        <div *ngIf="!isLoggedIn" class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span class="text-[8px] font-black uppercase tracking-[0.6em] text-white/50">Scroll</span>
          <div class="w-[2px] h-16 bg-gradient-to-b from-white/50 to-transparent animate-scroll"></div>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent {
  @Input() isLoggedIn: boolean = false;
  @Output() onDiscoverMap = new EventEmitter<void>();
  @Output() onViewBoutiques = new EventEmitter<void>();
}