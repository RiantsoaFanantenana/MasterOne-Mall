
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionType } from '../../../types';

@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white p-12 rounded-[60px] border border-lumina-olive/10 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden h-full flex flex-col">
      <div class="absolute -right-6 -top-6 w-32 h-32 bg-lumina-rust/5 rounded-full group-hover:scale-150 transition-transform"></div>
      
      <div class="flex justify-between items-start mb-12 relative z-10">
        <div>
          <h4 class="text-4xl font-black text-lumina-olive font-outfit uppercase leading-none tracking-tighter mb-2">{{ sub.name }}</h4>
          <p class="text-[10px] font-black text-lumina-tan uppercase tracking-widest">Enterprise Tier</p>
        </div>
        <span class="text-5xl font-black text-lumina-rust font-outfit leading-none">{{ sub.price }}€</span>
      </div>

      <div class="space-y-4 mb-14 relative z-10 flex-1">
        <div *ngFor="let f of sub.features" class="flex items-center gap-4 text-[10px] font-black text-lumina-olive/50 uppercase tracking-widest">
          <div class="w-2.5 h-2.5 rounded-full bg-lumina-mint shadow-lg shadow-lumina-mint/40"></div>
          {{ f }}
        </div>
      </div>

      <button (click)="onDelete.emit(sub.id)" 
              class="w-full py-6 border-2 border-lumina-rust/10 text-lumina-rust rounded-[32px] text-[11px] font-black uppercase tracking-widest hover:bg-lumina-rust hover:text-white transition-all active:scale-95 shadow-lg shadow-lumina-rust/5">
        Decommission Plan
      </button>
    </div>
  `
})
export class SubscriptionCardComponent {
  @Input() sub!: SubscriptionType;
  @Output() onDelete = new EventEmitter<number>();
}
