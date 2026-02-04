
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe.ts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="space-y-10">
      <div class="flex justify-between items-end motion-slide-in stagger-1">
        <div>
          <p class="text-lumina-tan font-semibold">Lumina Center • Retail Experience Management</p>
        </div>
        <div class="flex gap-4">
          <button class="px-6 py-3 bg-white border border-lumina-olive/10 text-lumina-olive rounded-xl font-bold shadow-sm">Settings</button>
          <button class="px-6 py-3 bg-lumina-rust text-white rounded-xl font-bold shadow-xl shadow-lumina-rust/20">New Report</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of mallStats; let i = index" 
             class="bg-white p-6 rounded-xl border border-lumina-olive/5 shadow-sm hover:shadow-md transition-all group motion-slide-in"
             [ngClass]="'stagger-' + (i + 1)">
          <div class="flex justify-between items-start mb-6">
            <div class="p-3 bg-lumina-sage/10 rounded-xl text-lumina-olive group-hover:bg-lumina-sage/20 transition-colors flex items-center justify-center" [innerHTML]="stat.icon | safeHtml"></div>
            <div class="flex items-center gap-1 text-xs font-black uppercase" [ngClass]="stat.trend >= 0 ? 'text-lumina-mint' : 'text-lumina-rust'">
              {{ stat.trend >= 0 ? '↑' : '↓' }} {{ stat.trend }}%
            </div>
          </div>
          <div>
            <p class="text-lumina-tan text-[10px] font-black uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <h3 class="text-3xl font-black text-lumina-olive tracking-tight">{{ stat.value }}</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white p-8 rounded-xl border border-lumina-olive/5 shadow-sm motion-slide-in stagger-3">
          <div class="flex justify-between items-center mb-10">
            <h3 class="font-black text-2xl text-lumina-olive">Shop Visitation</h3>
            <div class="flex bg-lumina-olive/5 p-1 rounded-xl">
              <button class="px-5 py-2 text-xs font-bold bg-lumina-olive text-white rounded-lg shadow-md transition-all">Real-time</button>
              <button class="px-5 py-2 text-xs font-bold text-lumina-olive/40">Historical</button>
            </div>
          </div>
          <div class="h-[300px] flex items-end gap-4 justify-between">
            <div *ngFor="let bar of trafficData; let i = index" 
                 class="relative flex-1 group"
                 [style.height.%]="bar.value / 1.1">
              <div class="absolute inset-0 bg-lumina-sage/30 rounded-t-lg group-hover:bg-lumina-sage/50 transition-all duration-300"></div>
              <div class="absolute bottom-0 inset-x-0 bg-lumina-olive rounded-t-lg transition-all duration-700" [style.height.%]="bar.value"></div>
            </div>
          </div>
          <div class="flex justify-between mt-6 text-[10px] text-lumina-tan font-black uppercase tracking-[0.2em]">
            <span *ngFor="let bar of trafficData">{{ bar.name }}</span>
          </div>
        </div>

        <div class="bg-white p-8 rounded-xl border border-lumina-olive/5 shadow-sm flex flex-col motion-slide-in stagger-4">
          <h3 class="font-black text-2xl text-lumina-olive mb-8">AI Recommendations</h3>
          <div class="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div *ngIf="loading" class="flex flex-col items-center py-20">
               <div class="w-10 h-10 border-4 border-lumina-olive/5 border-t-lumina-rust rounded-full animate-spin"></div>
            </div>
            <div *ngFor="let s of mallSuggestions" class="p-5 bg-lumina-cream border border-lumina-olive/5 rounded-xl hover:border-lumina-mint/50 transition-all group cursor-pointer">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-2 py-0.5 bg-lumina-mint/20 text-lumina-olive text-[9px] font-black rounded uppercase">{{ s.type }}</span>
              </div>
              <h4 class="font-bold text-lumina-olive text-sm group-hover:text-lumina-rust transition-colors mb-2">{{ s.title }}</h4>
              <p class="text-[11px] text-lumina-olive/60 leading-relaxed">{{ s.description }}</p>
            </div>
          </div>
          <button (click)="onRefresh.emit()" class="w-full mt-6 py-4 bg-lumina-tan/10 text-lumina-olive rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-lumina-tan/20 transition-all">Refresh Insights</button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  @Input() mallStats: any[] = [];
  @Input() trafficData: any[] = [];
  @Input() mallSuggestions: any[] = [];
  @Input() loading: boolean = false;
  @Output() onRefresh = new EventEmitter<void>();
}
