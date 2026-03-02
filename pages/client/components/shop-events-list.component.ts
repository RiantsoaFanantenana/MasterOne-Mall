
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopEventItemComponent } from './shop-event-item.component';

@Component({
  selector: 'app-shop-events-list',
  standalone: true,
  imports: [CommonModule, ShopEventItemComponent],
  template: `
    <div class="space-y-10">
      <div class="flex items-center gap-4">
         <h3 class="text-[11px] font-black uppercase tracking-[0.4em] text-lumina-rust">Events Log</h3>
         <div class="flex-1 h-[1px] bg-lumina-rust/10"></div>
      </div>
      
      <div class="space-y-4 min-h-[50px]">
        <div *ngIf="events.length === 0" class="py-16 border-2 border-dashed border-lumina-olive/10 rounded-[32px] text-center">
          <p class="text-[10px] font-black text-lumina-olive/30 uppercase tracking-widest">No event history</p>
        </div>
        
        <div *ngFor="let e of events; let i = index" 
             class="animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both"
             [style.animation-delay]="(i * 100) + 'ms'">
          <app-shop-event-item
            [title]="e.title"
            [description]="e.description"
            [startDate]="e.start_date"
            [endDate]="e.end_date"
            [status]="e.status"
            [isPublic]="e.is_public"
            [createdAt]="e.created_at"
            class="block"
          ></app-shop-event-item>
        </div>
      </div>
    </div>
  `
})
export class ShopEventsListComponent {
  @Input() events: any[] = [];
}
