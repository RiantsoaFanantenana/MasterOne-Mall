
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../components/dashboard.component.ts';

@Component({
  selector: 'app-mall-view',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <div class="motion-slide-in">
      <div class="mb-10">
        <h2 class="text-xs font-black uppercase tracking-[0.3em] text-lumina-rust mb-2">General Management</h2>
        <h1 class="text-4xl font-black text-lumina-olive font-outfit">Lumina Management</h1>
      </div>
      
      <app-dashboard 
        [mallStats]="stats"
        [trafficData]="traffic"
        [mallSuggestions]="suggestions"
        [loading]="loading"
        (onRefresh)="onRefresh.emit()"
      ></app-dashboard>
    </div>
  `
})
export class MallViewComponent {
  @Input() stats: any[] = [];
  @Input() traffic: any[] = [];
  @Input() suggestions: any[] = [];
  @Input() loading: boolean = false;
  @Output() onRefresh = new EventEmitter<void>();
}
