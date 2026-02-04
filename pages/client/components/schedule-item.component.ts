
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="[variant === 'regular' ? 'bg-lumina-cream border-lumina-olive/5' : 'bg-white border-lumina-rust/10 shadow-sm', staggerClass]"
         class="flex justify-between items-center p-6 rounded-2xl border hover:border-lumina-rust transition-all group reveal motion-item">
      
      <div class="flex flex-col">
        <span *ngIf="variant === 'exceptional'" class="text-[9px] font-black uppercase tracking-widest text-lumina-tan mb-1">Special Date</span>
        <span class="text-sm font-black uppercase tracking-widest" [ngClass]="variant === 'regular' ? 'text-lumina-olive' : 'text-lumina-olive'">
          {{ label }}
        </span>
      </div>

      <span class="text-lg font-bold text-lumina-rust font-outfit group-hover:scale-105 transition-transform duration-500">
        {{ time }}
      </span>
    </div>

    <style>
      .motion-item {
        transition: transform 4.5s cubic-bezier(0.15, 1, 0.3, 1), opacity 3.5s ease !important;
      }
    </style>
  `
})
export class ScheduleItemComponent {
  @Input() label!: string;
  @Input() time!: string;
  @Input() variant: 'regular' | 'exceptional' = 'regular';
  @Input() staggerClass: string = '';
}
