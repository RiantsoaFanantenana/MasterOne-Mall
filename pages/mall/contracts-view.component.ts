
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../services/master-data.service';
import { ShopProfile, OpeningHour, OpeningHourException } from '../../types';
import { MerchantRowComponent } from './components/merchant-row.component';

@Component({
  selector: 'app-contracts-view',
  standalone: true,
  imports: [CommonModule, FormsModule, MerchantRowComponent],
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <!-- Section Tabs -->
      <div class="flex justify-between items-center mb-12 border-b border-lumina-olive/5 pb-10">
        <div class="flex gap-6">
          <button (click)="view.set('list')" 
                  [ngClass]="view() === 'list' ? 'bg-lumina-olive text-white shadow-xl shadow-lumina-olive/20' : 'text-lumina-olive/40 hover:text-lumina-olive'" 
                  class="px-14 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] transition-all font-outfit">
            Registry
          </button>
          <button (click)="view.set('form')" 
                  [ngClass]="view() === 'form' ? 'bg-lumina-olive text-white shadow-xl shadow-lumina-olive/20' : 'text-lumina-olive/40 hover:text-lumina-olive'" 
                  class="px-14 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] transition-all font-outfit">
            Onboarding
          </button>
        </div>
      </div>

      <!-- Merchant List View -->
      <div *ngIf="view() === 'list'" class="bg-white rounded-[60px] border border-lumina-olive/10 shadow-sm overflow-hidden animate-in fade-in">
        <table class="w-full text-left">
          <tr class="bg-lumina-cream text-[10px] font-black uppercase tracking-[0.3em] text-lumina-olive/40 border-b border-lumina-olive/10">
            <th class="px-12 py-12">Brand House</th>
            <th class="px-12 py-12">Assigned Space</th>
            <th class="px-12 py-12">Contract Status</th>
            <th class="px-12 py-12 text-right">Protocol</th>
          </tr>
          <tr *ngFor="let s of directory()" app-merchant-row [merchant]="s" class="border-t border-lumina-olive/5 group transition-all"></tr>
        </table>
      </div>

      <!-- Onboarding Unified Form -->
      <div *ngIf="view() === 'form'" class="bg-white p-14 lg:p-24 rounded-[80px] border border-lumina-olive/10 shadow-3xl max-w-7xl mx-auto animate-in zoom-in-95 duration-1000">
        <div class="flex items-center gap-10 mb-24">
          <div class="w-24 h-24 bg-lumina-rust rounded-[40px] flex items-center justify-center text-white shadow-3xl rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <h3 class="text-5xl font-black text-lumina-olive uppercase tracking-tighter leading-none mb-5 font-outfit">House Deployment</h3>
            <p class="text-[14px] font-black uppercase tracking-[0.6em] text-lumina-tan opacity-60 italic font-jakarta leading-none">Architecting the future of retail</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-16">
          <div class="space-y-12">
            <h4 class="text-[12px] font-black uppercase tracking-[0.6em] text-lumina-tan border-b border-lumina-olive/5 pb-8">Core Identity</h4>
            
            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Maison Nomenclature</label>
              <input [(ngModel)]="form.shop_name" placeholder="Elysian Garments" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg placeholder:text-lumina-olive/20" />
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Market Segment</label>
              <div class="relative group">
                <select [(ngModel)]="form.id_type" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg appearance-none pr-14 cursor-pointer">
                  <option *ngFor="let t of data.shopTypes()" [value]="t.id">{{ t.type_name }}</option>
                </select>
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30 group-focus-within:text-lumina-rust transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Narrative Heritage</label>
              <textarea [(ngModel)]="form.description" rows="5" placeholder="Tell the story of the brand..." class="w-full px-8 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg placeholder:text-lumina-olive/20 resize-none leading-relaxed"></textarea>
            </div>
          </div>

          <div class="space-y-12">
            <h4 class="text-[12px] font-black uppercase tracking-[0.6em] text-lumina-tan border-b border-lumina-olive/5 pb-8">Commercial Terms</h4>
            
            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Assigned Atrium Location</label>
              <div class="relative group">
                <select [(ngModel)]="form.id_box" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg appearance-none pr-14 cursor-pointer">
                  <option *ngFor="let b of data.boxes()" [value]="b.box_number">Box {{ b.box_number }} (Floor {{ b.floor }})</option>
                </select>
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30 group-focus-within:text-lumina-rust transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-10">
              <div class="space-y-3">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Commencement</label>
                <input type="date" [(ngModel)]="form.start_date" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all" />
              </div>
              <div class="space-y-3">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Termination</label>
                <input type="date" [(ngModel)]="form.end_date" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all" />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Agreed Monthly Rent (€)</label>
              <input type="number" [(ngModel)]="form.rent" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all" />
            </div>
          </div>
        </div>

        <div class="mt-32 pt-16 border-t border-lumina-olive/5 flex justify-end gap-12">
           <button (click)="view.set('list')" 
                   class="px-14 py-6 font-black text-[12px] uppercase tracking-[0.5em] text-lumina-olive/30 hover:text-lumina-rust transition-colors font-outfit">
             Cancel Protocol
           </button>
           <button (click)="createMerchant()" 
                   class="px-24 py-6 bg-lumina-olive text-white rounded-[40px] font-black uppercase text-[14px] tracking-[0.6em] shadow-3xl hover:bg-lumina-rust transition-all active:scale-95 font-outfit">
             Deploy House Asset
           </button>
        </div>
      </div>
    </div>
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

  createMerchant() {
    if(!this.form.shop_name) return;
    const newMerchant: ShopProfile = {
      user_id: Date.now(),
      id_type: Number(this.form.id_type),
      id_box: this.form.id_box,
      shop_name: this.form.shop_name,
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${this.form.shop_name}`,
      cover_pic: '',
      description: this.form.description,
      subscription_status: 'standard',
      opening_hours: [...this.form.opening_hours],
      exceptions: [...this.form.exceptions]
    };
    this.directory.update(v => [newMerchant, ...v]);
    this.view.set('list');
    this.form = { shop_name: '', id_type: 1, description: '', id_box: 'A-101', start_date: '', end_date: '', rent: 1500, opening_hours: [{ id: 1, day: 'Mon-Sat', start_time: '10:00', end_time: '21:00' }], exceptions: [] };
  }
}
