
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../services/master-data.service.ts';
import { BoxRowComponent } from './components/box-row.component.ts';
import { SubscriptionCardComponent } from './components/subscription-card.component.ts';
import { BoxRegistrationComponent } from './components/box-registration.component.ts';
import { CategoryRegistrationComponent } from './components/category-registration.component.ts';
import { SubscriptionRegistrationComponent } from './components/subscription-registration.component.ts';
import { ThreeDPlanComponent } from './components/three-d-plan.component.ts';

@Component({
  selector: 'app-infrastructure-view',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    BoxRowComponent, 
    SubscriptionCardComponent,
    BoxRegistrationComponent,
    CategoryRegistrationComponent,
    SubscriptionRegistrationComponent,
    ThreeDPlanComponent
  ],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <!-- Sub-navigation -->
      <div class="flex gap-10 border-b border-lumina-olive/10 pb-8 overflow-x-auto no-scrollbar">
        <button *ngFor="let tab of tabs" 
                (click)="activeSubTab.set(tab.id)"
                [ngClass]="activeSubTab() === tab.id ? 'text-lumina-rust border-b-2 border-lumina-rust shadow-sm' : 'text-lumina-olive/30 hover:text-lumina-olive'"
                class="px-4 py-3 font-black uppercase text-[11px] tracking-[0.4em] transition-all whitespace-nowrap">
          {{ tab.label }}
        </button>
      </div>

      <!-- 3D DISCOVERY SECTION -->
      <div *ngIf="activeSubTab() === 'discovery'" class="space-y-8">
        <div class="bg-white p-8 lg:p-12 rounded-[60px] border border-lumina-olive/10 shadow-sm mb-8">
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
            <div>
              <h3 class="text-4xl font-black text-lumina-olive font-outfit uppercase tracking-tighter leading-none mb-3">Discovery Plan Alpha</h3>
              <p class="text-[11px] font-black text-lumina-tan uppercase tracking-[0.4em]">Real-time Spatial Asset Interaction</p>
            </div>
            <div class="w-full lg:w-auto">
              <div class="relative group">
                <input type="text" [(ngModel)]="searchId" placeholder="Input House ID or Slot (e.g. PA05)" 
                       class="w-full lg:w-[400px] px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-full font-bold text-sm outline-none focus:border-lumina-rust focus:ring-8 focus:ring-lumina-rust/5 transition-all shadow-inner placeholder:text-lumina-olive/20">
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/20 group-focus-within:text-lumina-rust transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div>
          </div>
          
          <app-three-d-plan 
            [floors]="data.mallFloors()"
            [selectedRoomId]="searchId"
            [selectedSpotId]="searchId"
          ></app-three-d-plan>
        </div>
      </div>

      <!-- BOXES SECTION -->
      <div *ngIf="activeSubTab() === 'boxes'" class="space-y-12">
        <app-box-registration (onAdd)="data.addBox($event)"></app-box-registration>

        <div class="bg-white rounded-[60px] border border-lumina-olive/10 overflow-hidden shadow-sm">
          <table class="w-full text-left">
            <tr class="bg-lumina-cream text-[10px] font-black uppercase tracking-widest text-lumina-olive/40 border-b border-lumina-olive/10">
              <th class="px-12 py-10">ID</th>
              <th class="px-12 py-10">Floor</th>
              <th class="px-12 py-10">Surface</th>
              <th class="px-12 py-10">Status</th>
              <th class="px-12 py-10 text-right">Actions</th>
            </tr>
            <tr *ngFor="let b of data.boxes()" app-box-row [box]="b" (onDelete)="data.deleteBox($event)" class="border-t border-lumina-olive/5 transition-all"></tr>
          </table>
        </div>
      </div>

      <!-- SHOP TYPES SECTION -->
      <div *ngIf="activeSubTab() === 'types'" class="max-w-4xl space-y-12">
        <app-category-registration (onAdd)="data.addShopType($event)"></app-category-registration>
        
        <div class="bg-white rounded-[60px] border border-lumina-olive/10 shadow-sm divide-y divide-lumina-olive/5">
          <div *ngFor="let t of data.shopTypes()" class="flex items-center justify-between p-12 hover:bg-lumina-cream/50 transition-all first:rounded-t-[60px] last:rounded-b-[60px]">
             <span class="font-black text-lumina-olive uppercase tracking-[0.4em] text-xs">{{ t.type_name }}</span>
             <button (click)="data.deleteShopType(t.id)" class="text-lumina-rust/40 hover:text-lumina-rust font-black uppercase text-[10px] tracking-widest transition-colors">Remove Category</button>
          </div>
        </div>
      </div>

      <!-- SUBSCRIPTIONS SECTION -->
      <div *ngIf="activeSubTab() === 'subscriptions'" class="space-y-12">
        <app-subscription-registration (onAdd)="data.addSubscriptionType($event)"></app-subscription-registration>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <app-subscription-card *ngFor="let s of data.subscriptionTypes()" [sub]="s" (onDelete)="data.deleteSubscriptionType($event)"></app-subscription-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class InfrastructureViewComponent {
  data = inject(MasterDataService);
  activeSubTab = signal('discovery');
  searchId = '';

  tabs = [
    { id: 'discovery', label: 'Discovery Plan' },
    { id: 'boxes', label: 'Space Assets' },
    { id: 'types', label: 'Merchant Categories' },
    { id: 'subscriptions', label: 'Pricing Architecture' }
  ];
}
