// pages/mall/contracts-view.component.ts
import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MasterDataService } from '../../services/master-data.service';
import { ShopProfile, OpeningHour, OpeningHourException } from '../../types';
import { ContractEndingSoonResponse } from '../../services/api.service';

// Interface étendue pour inclure contract_end
interface ExtendedShopProfile extends ShopProfile {
  contract_end?: string;
}

@Component({
  selector: 'app-contracts-view',
  standalone: true,
  imports: [CommonModule, FormsModule], // Supprimé MerchantRowComponent
  template: `
    <div class="space-y-12 animate-in fade-in duration-700">
      <!-- En-tête avec alertes -->
      <div class="flex justify-between items-center bg-white p-8 rounded-[40px] border border-lumina-olive/5 shadow-sm">
        <div>
          <h2 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tight">Contract Management</h2>
          <p class="text-[10px] font-black uppercase text-lumina-tan tracking-widest mt-1">Oversee merchant agreements and deployments</p>
        </div>
        
        <!-- Alertes contrats expirant -->
        <div class="relative">
          <button (click)="showAlerts.set(!showAlerts())" 
                  class="relative px-6 py-4 bg-lumina-rust/10 text-lumina-rust rounded-2xl font-black text-[10px] uppercase tracking-widest">
            <span class="mr-2">⚠️</span>
            Alerts
            <span *ngIf="expiringContracts().length > 0" 
                  class="absolute -top-2 -right-2 w-6 h-6 bg-lumina-rust text-white rounded-full text-[9px] flex items-center justify-center font-black">
              {{ expiringContracts().length }}
            </span>
          </button>
          
          <!-- Panneau d'alertes -->
          <div *ngIf="showAlerts()" 
               class="absolute right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl border border-lumina-olive/10 p-6 z-50 animate-in slide-in-from-top-2">
            <h4 class="text-[11px] font-black uppercase text-lumina-rust mb-4 flex items-center gap-2">
              <span class="w-2 h-2 bg-lumina-rust rounded-full animate-pulse"></span>
              Contracts Ending Soon
            </h4>
            <div *ngIf="expiringContracts().length === 0" class="text-center py-8 text-lumina-olive/40 text-[10px]">
              No contracts expiring soon
            </div>
            <div *ngFor="let contract of expiringContracts()" 
                 class="mb-3 p-4 bg-lumina-cream rounded-2xl border border-lumina-rust/10 hover:border-lumina-rust transition-all">
              <div class="flex justify-between items-start mb-2">
                <h5 class="font-black text-lumina-olive">{{ contract.shop.shopName }}</h5>
                <span class="text-[8px] font-black px-2 py-1 bg-lumina-rust/10 text-lumina-rust rounded-full">
                  {{ getDaysUntilExpiry(contract.endDate) }} days
                </span>
              </div>
              <p class="text-[9px] text-lumina-olive/60">Box {{ contract.shop.box }} • Ends {{ contract.endDate | date:'mediumDate' }}</p>
              <div class="flex gap-2 mt-3">
                <button (click)="renewContract(contract)" 
                        class="flex-1 py-2 bg-lumina-olive text-white rounded-xl text-[8px] font-black uppercase">
                  Renew
                </button>
                <button (click)="contactMerchant(contract)" 
                        class="flex-1 py-2 bg-lumina-tan/10 text-lumina-olive rounded-xl text-[8px] font-black uppercase">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages d'erreur/succès -->
      <div *ngIf="errorMessage()" class="bg-lumina-rust/10 border border-lumina-rust/20 p-6 rounded-3xl text-center">
        <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMessage() }}</p>
      </div>

      <div *ngIf="successMessage()" class="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl text-center">
        <p class="text-[10px] font-black uppercase tracking-widest text-green-600">{{ successMessage() }}</p>
      </div>

      <!-- Section Tabs -->
      <div class="flex justify-between items-center mb-12 border-b border-lumina-olive/5 pb-10">
        <div class="flex gap-6">
          <button (click)="switchView('list')" 
                  [ngClass]="view() === 'list' ? 'bg-lumina-olive text-white shadow-xl shadow-lumina-olive/20' : 'text-lumina-olive/40 hover:text-lumina-olive'" 
                  class="px-14 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] transition-all font-outfit">
            Registry ({{ directory().length }})
          </button>
          <button (click)="switchView('form')" 
                  [ngClass]="view() === 'form' ? 'bg-lumina-olive text-white shadow-xl shadow-lumina-olive/20' : 'text-lumina-olive/40 hover:text-lumina-olive'" 
                  class="px-14 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] transition-all font-outfit">
            Onboarding
          </button>
          <button (click)="switchView('expiring')" 
                  [ngClass]="view() === 'expiring' ? 'bg-lumina-rust text-white shadow-xl shadow-lumina-rust/20' : 'text-lumina-olive/40 hover:text-lumina-rust'" 
                  class="px-14 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] transition-all font-outfit">
            Expiring ({{ expiringContracts().length }})
          </button>
        </div>

        <!-- Filtres -->
        <div class="flex gap-3">
          <select (change)="filterByStatus($event)" 
                  class="px-6 py-4 bg-lumina-cream rounded-2xl border border-lumina-olive/10 text-[10px] font-bold text-lumina-olive outline-none">
            <option value="all">All Contracts</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <!-- Merchant List View -->
      <div *ngIf="view() === 'list'" class="bg-white rounded-[60px] border border-lumina-olive/10 shadow-sm overflow-hidden animate-in fade-in">
        <div *ngIf="isLoading()" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-lumina-rust border-t-transparent"></div>
        </div>
        
        <table class="w-full text-left" *ngIf="!isLoading()">
          <thead>
            <tr class="bg-lumina-cream text-[10px] font-black uppercase tracking-[0.3em] text-lumina-olive/40 border-b border-lumina-olive/10">
              <th class="px-12 py-12">Brand House</th>
              <th class="px-12 py-12">Assigned Space</th>
              <th class="px-12 py-12">Contract Status</th>
              <th class="px-12 py-12">End Date</th>
              <th class="px-12 py-12 text-right">Protocol</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of filteredDirectory()" 
                class="border-t border-lumina-olive/5 group transition-all hover:bg-lumina-cream/50">
              <td class="px-12 py-8">
                <div class="flex items-center gap-4">
                  <img [src]="s.logo" class="w-12 h-12 rounded-2xl object-cover">
                  <div>
                    <p class="font-black text-lumina-olive">{{ s.shop_name }}</p>
                    <p class="text-[8px] text-lumina-tan uppercase">{{ s.description | slice:0:50 }}...</p>
                  </div>
                </div>
              </td>
              <td class="px-12 py-8 font-bold text-lumina-olive">Box {{ s.id_box }}</td>
              <td class="px-12 py-8">
                <span [ngClass]="{
                  'bg-lumina-mint text-white': getContractStatus(s) === 'active',
                  'bg-lumina-tan text-white': getContractStatus(s) === 'expiring',
                  'bg-lumina-rust text-white': getContractStatus(s) === 'expired'
                }" class="px-4 py-2 rounded-full text-[8px] font-black uppercase">
                  {{ getContractStatus(s) }}
                </span>
              </td>
              <td class="px-12 py-8 font-bold text-lumina-olive">{{ getContractEndDate(s) | date:'mediumDate' }}</td>
              <td class="px-12 py-8 text-right">
                <button (click)="viewContractDetails(s)" 
                        class="px-6 py-3 bg-lumina-olive/10 text-lumina-olive rounded-xl text-[8px] font-black uppercase hover:bg-lumina-olive hover:text-white transition-all mr-2">
                  View
                </button>
                <button (click)="renewContractFromShop(s)" 
                        class="px-6 py-3 bg-lumina-rust/10 text-lumina-rust rounded-xl text-[8px] font-black uppercase hover:bg-lumina-rust hover:text-white transition-all">
                  Renew
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Expiring Contracts View -->
      <div *ngIf="view() === 'expiring'" class="bg-white p-12 rounded-[60px] border border-lumina-olive/10 shadow-sm animate-in fade-in">
        <h3 class="text-2xl font-black text-lumina-olive mb-8">Contracts Ending Soon</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let contract of expiringContracts()" 
               class="p-6 bg-lumina-cream rounded-3xl border border-lumina-rust/10 hover:border-lumina-rust transition-all">
            <div class="flex justify-between items-start mb-4">
              <h4 class="font-black text-lumina-olive">{{ contract.shop.shopName }}</h4>
              <span class="text-[8px] font-black px-3 py-1 bg-lumina-rust/10 text-lumina-rust rounded-full">
                {{ getDaysUntilExpiry(contract.endDate) }} days left
              </span>
            </div>
            <p class="text-[9px] text-lumina-olive/60 mb-4">Box {{ contract.shop.box }}</p>
            <p class="text-[10px] font-bold mb-2">Start: {{ contract.startDate | date }}</p>
            <p class="text-[10px] font-bold mb-4">End: {{ contract.endDate | date }}</p>
            <div class="flex gap-3">
              <button (click)="renewContract(contract)" 
                      class="flex-1 py-3 bg-lumina-olive text-white rounded-xl text-[8px] font-black uppercase">
                Renew Now
              </button>
              <button (click)="dismissAlert(contract)" 
                      class="px-4 py-3 bg-lumina-tan/10 text-lumina-olive rounded-xl text-[8px] font-black uppercase">
                Dismiss
              </button>
            </div>
          </div>
        </div>
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
              <input [(ngModel)]="form.shopName" 
                     [disabled]="isSubmitting()"
                     placeholder="Elysian Garments" 
                     class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg placeholder:text-lumina-olive/20 disabled:opacity-50" />
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Market Segment</label>
              <div class="relative group">
                <select [(ngModel)]="form.shopType" 
                        [disabled]="isSubmitting()"
                        class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg appearance-none pr-14 cursor-pointer disabled:opacity-50">
                  <option *ngFor="let t of data.shopTypes()" [value]="t.id">{{ t.type_name }}</option>
                </select>
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30 group-focus-within:text-lumina-rust transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Narrative Heritage</label>
              <textarea [(ngModel)]="form.description" 
                        [disabled]="isSubmitting()"
                        rows="5" 
                        placeholder="Tell the story of the brand..." 
                        class="w-full px-8 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg placeholder:text-lumina-olive/20 resize-none leading-relaxed disabled:opacity-50"></textarea>
            </div>
          </div>

          <div class="space-y-12">
            <h4 class="text-[12px] font-black uppercase tracking-[0.6em] text-lumina-tan border-b border-lumina-olive/5 pb-8">Commercial Terms</h4>
            
            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Assigned Atrium Location</label>
              <div class="relative group">
                <select [(ngModel)]="form.boxId" 
                        [disabled]="isSubmitting()"
                        class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg appearance-none pr-14 cursor-pointer disabled:opacity-50">
                  <option *ngFor="let b of data.boxes()" [value]="b.box_number">Box {{ b.box_number }} (Floor {{ b.floor }})</option>
                </select>
                <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-lumina-olive/30 group-focus-within:text-lumina-rust transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Contact Email</label>
              <input type="email" 
                     [(ngModel)]="form.email" 
                     [disabled]="isSubmitting()"
                     placeholder="shop@example.com" 
                     class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all disabled:opacity-50" />
            </div>

            <div class="grid grid-cols-2 gap-10">
              <div class="space-y-3">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Commencement</label>
                <input type="date" 
                       [(ngModel)]="form.startDate" 
                       [disabled]="isSubmitting()"
                       class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all disabled:opacity-50" />
              </div>
              <div class="space-y-3">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Duration (months)</label>
                <input type="number" 
                       [(ngModel)]="form.duration" 
                       [disabled]="isSubmitting()"
                       placeholder="12" 
                       class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all disabled:opacity-50" />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1 block font-jakarta">Agreed Monthly Rent (€)</label>
              <input type="number" 
                     [(ngModel)]="form.rent" 
                     [disabled]="isSubmitting()"
                     class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust transition-all disabled:opacity-50" />
            </div>
          </div>
        </div>

        <div *ngIf="errorMessage()" class="mt-12 p-6 bg-lumina-rust/10 border border-lumina-rust/20 rounded-3xl text-center">
          <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMessage() }}</p>
        </div>

        <div class="mt-32 pt-16 border-t border-lumina-olive/5 flex justify-end gap-12">
           <button (click)="cancelForm()" 
                   [disabled]="isSubmitting()"
                   class="px-14 py-6 font-black text-[12px] uppercase tracking-[0.5em] text-lumina-olive/30 hover:text-lumina-rust transition-colors font-outfit disabled:opacity-50">
             Cancel Protocol
           </button>
           <button (click)="createMerchant()" 
                   [disabled]="isSubmitting() || !isFormValid()"
                   class="px-24 py-6 bg-lumina-olive text-white rounded-[40px] font-black uppercase text-[14px] tracking-[0.6em] shadow-3xl hover:bg-lumina-rust transition-all active:scale-95 font-outfit disabled:opacity-50 disabled:cursor-not-allowed">
             {{ isSubmitting() ? 'DEPLOYING...' : 'Deploy House Asset' }}
           </button>
        </div>
      </div>
    </div>
  `
})
export class ContractsViewComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  data = inject(MasterDataService);
  
  // États
  view = signal<'list' | 'form' | 'expiring'>('list');
  isLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showAlerts = signal(false);
  
  // Données avec type étendu
  directory = signal<ExtendedShopProfile[]>([]);
  expiringContracts = signal<ContractEndingSoonResponse[]>([]);
  
  // Filtre
  statusFilter = signal<string>('all');
  
  // Liste filtrée
  filteredDirectory = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'all') return this.directory();
    
    return this.directory().filter(shop => {
      const status = this.getContractStatus(shop);
      return status === filter;
    });
  });

  form = {
    shopName: '',
    shopType: 1,
    description: '',
    boxId: 'A-101',
    email: '',
    startDate: '',
    duration: 12,
    rent: 1500
  };

  ngOnInit() {
    this.loadShops();
    this.loadExpiringContracts();
  }

  loadShops() {
    this.isLoading.set(true);
    // Simuler un chargement depuis l'API
    setTimeout(() => {
      this.directory.set([
        { 
          user_id: 1, 
          id_type: 1, 
          id_box: 'A-101', 
          shop_name: 'Elysian Garments', 
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EG', 
          cover_pic: '', 
          description: 'The pinnacle of French luxury fashion.', 
          subscription_status: 'premium',
          contract_end: '2026-04-15'
        },
        { 
          user_id: 2, 
          id_type: 3, 
          id_box: 'C-202', 
          shop_name: 'Stellar Gems', 
          logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SG', 
          cover_pic: '', 
          description: 'Rare stones and bespoke jewelry.', 
          subscription_status: 'standard',
          contract_end: '2026-03-20'
        }
      ]);
      this.isLoading.set(false);
    }, 500);
  }

  loadExpiringContracts() {
    this.apiService.getContractsEndingSoon(7).subscribe({
      next: (data) => {
        this.expiringContracts.set(data);
      },
      error: (error) => {
        console.error('Error loading expiring contracts:', error);
      }
    });
  }

  switchView(view: 'list' | 'form' | 'expiring') {
    this.view.set(view);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    if (view === 'expiring') {
      this.loadExpiringContracts();
    }
  }

  filterByStatus(event: any) {
    this.statusFilter.set(event.target.value);
  }

  isFormValid(): boolean {
    return !!(
      this.form.shopName?.trim() &&
      this.form.email?.trim() &&
      this.form.startDate &&
      this.form.duration > 0 &&
      this.form.boxId
    );
  }

  createMerchant() {
    if (!this.validateForm()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.apiService.registerShop({
      shopName: this.form.shopName,
      email: this.form.email,
      shopType: this.form.shopType.toString(),
      duration: this.form.duration,
      startDate: this.form.startDate,
      boxId: this.form.boxId
    }).subscribe({
      next: (response) => {
        console.log('Shop registered successfully:', response);
        
        // Ajouter le shop à la liste locale
        const newMerchant: ExtendedShopProfile = {
          user_id: Date.now(),
          id_type: Number(this.form.shopType),
          id_box: this.form.boxId,
          shop_name: this.form.shopName,
          logo: `https://api.dicebear.com/7.x/initials/svg?seed=${this.form.shopName}`,
          cover_pic: '',
          description: this.form.description,
          subscription_status: 'standard',
          contract_end: this.calculateEndDate(this.form.startDate, this.form.duration)
        };
        
        this.directory.update(v => [newMerchant, ...v]);
        this.successMessage.set('Shop registered successfully!');
        
        // Réinitialiser le formulaire
        setTimeout(() => {
          this.resetForm();
          this.view.set('list');
          this.successMessage.set(null);
        }, 1500);
        
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error registering shop:', error);
        this.errorMessage.set(error.message || 'Failed to register shop. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }

  renewContract(contract: ContractEndingSoonResponse) {
    console.log('Renewing contract:', contract);
    this.successMessage.set(`Renewal initiated for ${contract.shop.shopName}`);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  renewContractFromShop(shop: ExtendedShopProfile) {
    console.log('Renewing contract for shop:', shop);
    this.successMessage.set(`Renewal initiated for ${shop.shop_name}`);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  contactMerchant(contract: ContractEndingSoonResponse) {
    console.log('Contacting merchant:', contract);
    // Ouvrir modal de contact ou rediriger vers chat
  }

  dismissAlert(contract: ContractEndingSoonResponse) {
    this.expiringContracts.update(contracts => 
      contracts.filter(c => c.shop.shopName !== contract.shop.shopName)
    );
  }

  viewContractDetails(shop: ExtendedShopProfile) {
    this.router.navigate(['/admin/contracts', shop.user_id]);
  }

  cancelForm() {
    this.resetForm();
    this.view.set('list');
    this.errorMessage.set(null);
  }

  private validateForm(): boolean {
    if (!this.form.shopName?.trim()) {
      this.errorMessage.set('Shop name is required');
      return false;
    }
    if (!this.form.email?.trim()) {
      this.errorMessage.set('Email is required');
      return false;
    }
    if (!this.form.startDate) {
      this.errorMessage.set('Start date is required');
      return false;
    }
    if (!this.form.duration || this.form.duration < 1) {
      this.errorMessage.set('Valid duration is required');
      return false;
    }
    if (!this.form.boxId) {
      this.errorMessage.set('Box selection is required');
      return false;
    }
    return true;
  }

  private resetForm() {
    this.form = {
      shopName: '',
      shopType: 1,
      description: '',
      boxId: 'A-101',
      email: '',
      startDate: '',
      duration: 12,
      rent: 1500
    };
    this.errorMessage.set(null);
  }

  // Utilitaires
  getContractStatus(shop: ExtendedShopProfile): 'active' | 'expiring' | 'expired' {
    if (!shop.contract_end) return 'active';
    
    const endDate = new Date(shop.contract_end);
    const today = new Date();
    const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilEnd < 0) return 'expired';
    if (daysUntilEnd <= 7) return 'expiring';
    return 'active';
  }

  getContractEndDate(shop: ExtendedShopProfile): Date {
    return shop.contract_end ? new Date(shop.contract_end) : new Date();
  }

  getDaysUntilExpiry(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  private calculateEndDate(startDate: string, durationMonths: number): string {
    const start = new Date(startDate);
    start.setMonth(start.getMonth() + durationMonths);
    return start.toISOString().split('T')[0];
  }

  configureShop(userId: string) {
    this.apiService.configureShop({
      user: userId,
      newPassword: this.generateRandomPassword(),
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${this.form.shopName}`,
      coverPic: '',
      description: this.form.description
    }).subscribe({
      next: (response) => {
        console.log('Shop configured successfully:', response);
        this.successMessage.set('Shop configured successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (error) => {
        console.error('Error configuring shop:', error);
        this.errorMessage.set('Failed to configure shop');
      }
    });
  }

  private generateRandomPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
}