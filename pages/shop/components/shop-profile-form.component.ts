
import { Component, Input, Output, EventEmitter, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopProfile } from '../../../types.ts';
import { ShopDetailsComponent } from '../../client/components/shop-details.component.ts';
import { MasterDataService } from '../../../services/master-data.service.ts';

@Component({
  selector: 'app-shop-profile-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopDetailsComponent],
  template: `
    <div class="space-y-12">
      <div class="flex justify-between items-center bg-white p-8 rounded-[40px] border border-lumina-olive/5 shadow-sm">
        <div>
           <h3 class="text-2xl font-black text-lumina-olive font-outfit uppercase tracking-tight">Public Identity Management</h3>
           <p class="text-[10px] font-black uppercase text-lumina-tan tracking-widest mt-1">Configure your brand narrative on the MasterOne portal</p>
        </div>
        <button (click)="previewMode.set(!previewMode())" 
                [ngClass]="previewMode() ? 'bg-lumina-rust text-white' : 'bg-lumina-olive text-white'"
                class="px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">
          {{ previewMode() ? 'Exit Preview' : 'Live Client Preview' }}
        </button>
      </div>

      <div *ngIf="!previewMode()" class="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-top-4">
         <div class="bg-white p-12 rounded-[50px] border border-lumina-olive/10 shadow-sm space-y-8">
            <div class="space-y-3">
               <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Boutique Nomenclature</label>
               <input [(ngModel)]="profile.shop_name" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive outline-none focus:border-lumina-rust transition-all" />
            </div>
            <div class="space-y-3">
               <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Brand Narrative (Description)</label>
               <textarea [(ngModel)]="profile.description" rows="5" class="w-full px-8 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive resize-none leading-relaxed outline-none focus:border-lumina-rust transition-all"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Logo Asset URL</label>
                <input [(ngModel)]="profile.logo" class="w-full px-6 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-2xl font-bold text-xs text-lumina-olive/60" />
              </div>
              <div class="space-y-3">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Cover Pic URL</label>
                <input [(ngModel)]="profile.cover_pic" class="w-full px-6 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-2xl font-bold text-xs text-lumina-olive/60" />
              </div>
            </div>
            <button (click)="onSave.emit(profile)" class="w-full py-6 bg-lumina-olive text-white rounded-[30px] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-lumina-rust transition-all active:scale-[0.98]">Synchronize Profile</button>
         </div>

         <div class="flex flex-col items-center justify-center p-12 bg-lumina-cream rounded-[50px] border-2 border-dashed border-lumina-olive/10 text-center">
            <div class="w-32 h-32 rounded-[40px] bg-white p-4 shadow-3xl mb-8 rotate-3 border border-lumina-olive/5 overflow-hidden">
               <img [src]="profile.logo" class="w-full h-full object-contain">
            </div>
            <h4 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tighter mb-4">{{ profile.shop_name }}</h4>
            <p class="text-xs text-lumina-olive/40 font-medium leading-relaxed max-w-xs">{{ profile.description }}</p>
         </div>
      </div>

      <div *ngIf="previewMode()" class="border-4 border-lumina-olive/5 rounded-[60px] overflow-hidden bg-white shadow-3xl scale-95 origin-top animate-in zoom-in-95">
         <div class="bg-lumina-dark text-white text-center py-4 text-[9px] font-black uppercase tracking-[0.6em]">MasterOne Portal Simulation Mode (Read Only)</div>
         <app-shop-details 
          [shop]="profile" 
          [shops]="data.shopProfiles()"
          [events]="myEvents()"
          [discounts]="myDiscounts()"
          [isLoggedIn]="true"
         ></app-shop-details>
      </div>
    </div>
  `
})
export class ShopProfileFormComponent {
  @Input() profile!: ShopProfile;
  @Output() onSave = new EventEmitter<ShopProfile>();
  
  data = inject(MasterDataService);
  previewMode = signal(false);

  myEvents = computed(() => this.data.events().filter(e => e.shop_id === this.profile.user_id));
  myDiscounts = computed(() => this.data.discounts().filter(d => d.shop_id === this.profile.user_id));
}
