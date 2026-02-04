
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../services/master-data.service.ts';
import { ShopProfile, OpeningHour, OpeningHourException } from '../../types.ts';
import { MerchantRowComponent } from './components/merchant-row.component.ts';

@Component({
  selector: 'app-contracts-view',
  standalone: true,
  imports: [CommonModule, FormsModule, MerchantRowComponent],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <!-- Section Tabs -->
      <div class="flex justify-between items-center mb-12 border-b border-lumina-olive/5 pb-10">
        <div class="flex gap-8">
          <button (click)="view.set('list')" 
                  [ngClass]="view() === 'list' ? 'bg-lumina-olive text-white shadow-xl shadow-lumina-olive/20' : 'text-lumina-olive/40 hover:text-lumina-olive'" 
                  class="px-12 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all font-outfit">
            Merchant Registry
          </button>
          <button (click)="view.set('form')" 
                  [ngClass]="view() === 'form' ? 'bg-lumina-olive text-white shadow-xl shadow-lumina-olive/20' : 'text-lumina-olive/40 hover:text-lumina-olive'" 
                  class="px-12 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all font-outfit">
            New Onboarding
          </button>
        </div>
      </div>

      <!-- Merchant List View -->
      <div *ngIf="view() === 'list'" class="bg-white rounded-[40px] border border-lumina-olive/10 shadow-sm overflow-hidden animate-in fade-in">
        <table class="w-full text-left">
          <tr class="bg-lumina-cream text-[10px] font-black uppercase tracking-widest text-lumina-olive/40 border-b border-lumina-olive/10">
            <th class="px-10 py-10">Brand House</th>
            <th class="px-10 py-10">Assigned Space</th>
            <th class="px-10 py-10">Contract Status</th>
            <th class="px-10 py-10 text-right">Protocol</th>
          </tr>
          <tr *ngFor="let s of directory()" app-merchant-row [merchant]="s" class="border-t border-lumina-olive/5 group transition-all"></tr>
        </table>
      </div>

      <!-- Onboarding Unified Form -->
      <div *ngIf="view() === 'form'" class="bg-white p-12 lg:p-20 rounded-[60px] border border-lumina-olive/10 shadow-2xl max-w-6xl mx-auto animate-in zoom-in-95 duration-700">
        <div class="flex items-center gap-10 mb-20">
          <div class="w-20 h-20 bg-lumina-rust rounded-[32px] flex items-center justify-center text-white shadow-xl rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <h3 class="text-4xl font-black text-lumina-olive uppercase tracking-tighter leading-none mb-4 font-outfit">Integration Protocol</h3>
            <p class="text-[12px] font-black uppercase tracking-widest text-lumina-tan opacity-60 font-jakarta italic">Architecting excellence</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16">
          <!-- Step 1: Merchant Profile -->
          <div class="space-y-12">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-lumina-tan border-b border-lumina-olive/5 pb-8 font-jakarta">1. Brand Identity</h4>
            
            <div class="space-y-3">
              <label class="erp-label">Boutique Label</label>
              <input [(ngModel)]="form.shop_name" placeholder="Elysian Garments" class="erp-input w-full" />
            </div>

            <div class="space-y-3">
              <label class="erp-label">Brand Segment</label>
              <div class="relative">
                <select [(ngModel)]="form.id_type" class="erp-input w-full appearance-none cursor-pointer pr-12">
                  <option *ngFor="let t of data.shopTypes()" [value]="t.id">{{ t.type_name }}</option>
                </select>
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="erp-label">Maison Narrative</label>
              <textarea [(ngModel)]="form.description" rows="5" placeholder="History..." 
                        class="erp-input w-full resize-none py-6 rounded-[32px]"></textarea>
            </div>
          </div>

          <!-- Step 2: Operational Contract -->
          <div class="space-y-12">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-lumina-tan border-b border-lumina-olive/5 pb-8 font-jakarta">2. Commercial Lease</h4>
            
            <div class="space-y-3">
              <label class="erp-label">Assign Mall Location</label>
              <div class="relative">
                <select [(ngModel)]="form.id_box" class="erp-input w-full appearance-none cursor-pointer pr-12">
                  <option *ngFor="let b of data.boxes()" [value]="b.box_number">Box {{ b.box_number }} (Floor {{ b.floor }})</option>
                </select>
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            
            <div class="space-y-3">
              <label class="erp-label">Strategic Partnership Tier</label>
              <div class="relative group">
                <select [(ngModel)]="selectedSubId" (change)="onSubChange()" 
                        class="erp-input w-full appearance-none cursor-pointer pr-40">
                  <option *ngFor="let s of data.subscriptionTypes()" [value]="s.id">{{ s.name }}</option>
                </select>
                <div class="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 bg-lumina-rust text-white px-5 py-2 rounded-xl font-black text-[9px] shadow-lg uppercase tracking-widest leading-none font-outfit">
                  {{ getSelectedSubPrice() }}€
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="erp-label">Inception Date</label>
                <input type="date" [(ngModel)]="form.start_date" class="erp-input w-full" />
              </div>
              <div class="space-y-3">
                <label class="erp-label">Term Date</label>
                <input type="date" [(ngModel)]="form.end_date" class="erp-input w-full" />
              </div>
            </div>

            <div class="space-y-3">
              <label class="erp-label">Agreed Monthly Rent (€)</label>
              <input type="number" [(ngModel)]="form.rent" class="erp-input w-full bg-lumina-olive/5" />
            </div>
          </div>
        </div>

        <div class="mt-24 pt-12 border-t border-lumina-olive/5 flex justify-end gap-10">
           <button (click)="view.set('list')" 
                   class="px-10 py-5 font-black text-[10px] uppercase tracking-widest text-lumina-olive/30 hover:text-lumina-rust transition-colors font-outfit">
             Discard
           </button>
           <button (click)="createMerchant()" 
                   class="px-14 py-5 bg-lumina-olive text-white rounded-[24px] font-black uppercase text-[12px] tracking-widest shadow-xl hover:bg-lumina-rust transition-all active:scale-95 font-outfit">
             Deploy Merchant Protocol
           </button>
        </div>
      </div>
    </div>

    <style>
      .erp-label { @apply text-[10px] font-black uppercase tracking-widest text-lumina-olive/40 ml-6 mb-2 block font-jakarta; }
      .erp-input { @apply px-8 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-[24px] font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all placeholder:text-lumina-olive/20; }
    </style>
  `
})
export class ContractsViewComponent {
  data = inject(MasterDataService);
  view = signal('list');
  selectedSubId = 1;

  directory = signal<ShopProfile[]>([
    { user_id: 1, id_type: 1, id_box: 'A-101', shop_name: 'Elysian Garments', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EG', cover_pic: '', description: 'The pinnacle of French luxury fashion.', subscription_status: 'premium' },
    { user_id: 2, id_type: 3, id_box: 'C-202', shop_name: 'Stellar Gems', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SG', cover_pic: '', description: 'Rare stones and bespoke jewelry.', subscription_status: 'standard' }
  ]);

  form = {
    shop_name: '',
    id_type: 1,
    description: '',
    id_box: 'A-101',
    start_date: '',
    end_date: '',
    rent: 1500,
    opening_hours: [{ id: 1, day: 'Mon-Sat', start_time: '10:00', end_time: '21:00' }] as OpeningHour[],
    exceptions: [] as OpeningHourException[]
  };

  getSelectedSubPrice() {
    const sub = this.data.subscriptionTypes().find(s => s.id == this.selectedSubId);
    return sub ? sub.price : 0;
  }

  onSubChange() {
    this.form.rent = this.getSelectedSubPrice();
  }

  createMerchant() {
    if(!this.form.shop_name) return;
    const selectedSub = this.data.subscriptionTypes().find(s => s.id == this.selectedSubId);
    const newMerchant: ShopProfile = {
      user_id: Date.now(),
      id_type: Number(this.form.id_type),
      id_box: this.form.id_box,
      shop_name: this.form.shop_name,
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${this.form.shop_name}`,
      cover_pic: '',
      description: this.form.description,
      subscription_status: (selectedSub?.name.toLowerCase().includes('premium') || selectedSub?.name.toLowerCase().includes('elite') ? 'premium' : 'standard') as any,
      opening_hours: [...this.form.opening_hours],
      exceptions: [...this.form.exceptions]
    };
    this.directory.update(v => [newMerchant, ...v]);
    this.view.set('list');
    this.form = { shop_name: '', id_type: 1, description: '', id_box: 'A-101', start_date: '', end_date: '', rent: 1500, opening_hours: [{ id: 1, day: 'Mon-Sat', start_time: '10:00', end_time: '21:00' }], exceptions: [] };
  }
}
