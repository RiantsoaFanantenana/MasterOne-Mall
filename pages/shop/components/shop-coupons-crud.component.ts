import { Component, Input, Output, EventEmitter, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coupon } from '../../../types';
import { ApiService } from '../../../services/api.service'; // AJOUTER L'IMPORT

@Component({
  selector: 'app-shop-coupons-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-12">
      <!-- En-tête avec bouton de création -->
      <div class="flex justify-between items-center">
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tight">Voucher Management</h3>
        <button (click)="showForm.set(true)" 
                [disabled]="isSubmitting()"
                class="px-8 py-4 bg-lumina-rust text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-lumina-olive transition-all disabled:opacity-50">
          Issue New Coupon
        </button>
      </div>

      <!-- Messages d'état -->
      <div *ngIf="errorMessage()" class="bg-lumina-rust/10 border border-lumina-rust/20 p-6 rounded-3xl text-center">
        <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMessage() }}</p>
      </div>

      <div *ngIf="successMessage()" class="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl text-center">
        <p class="text-[10px] font-black uppercase tracking-widest text-green-600">{{ successMessage() }}</p>
      </div>

      <!-- Indicateur de chargement -->
      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-lumina-rust border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- New Coupon Form -->
        <div *ngIf="showForm()" class="bg-lumina-cream border-2 border-dashed border-lumina-olive/10 p-10 rounded-[40px] flex flex-col space-y-6 animate-in slide-in-from-top-10">
           <div class="space-y-2">
             <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Description</label>
             <input [(ngModel)]="newCoupon.description" 
                    [disabled]="isSubmitting()"
                    placeholder="e.g. VIP Welcome Gift" 
                    class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm disabled:opacity-50" />
           </div>
           
           <div class="space-y-2">
             <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Discount Percentage</label>
             <input type="number" 
                    [(ngModel)]="newCoupon.discountPercentage" 
                    [disabled]="isSubmitting()"
                    min="1" 
                    max="100"
                    placeholder="20" 
                    class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm disabled:opacity-50" />
           </div>
           
           <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Start</label>
                <input [(ngModel)]="newCoupon.start_date" 
                       [disabled]="isSubmitting()"
                       type="date" 
                       class="w-full bg-white p-4 rounded-xl font-bold text-xs disabled:opacity-50" />
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Expiry</label>
                <input [(ngModel)]="newCoupon.end_date" 
                       [disabled]="isSubmitting()"
                       type="date" 
                       class="w-full bg-white p-4 rounded-xl font-bold text-xs disabled:opacity-50" />
              </div>
           </div>
           
           <div class="flex gap-2 pt-4">
              <button (click)="submit()" 
                      [disabled]="isSubmitting() || !isFormValid()"
                      class="flex-1 py-4 bg-lumina-olive text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-lumina-rust transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSubmitting() ? 'CREATING...' : 'Activate' }}
              </button>
              <button (click)="cancelForm()" 
                      [disabled]="isSubmitting()"
                      class="px-6 py-4 bg-white text-lumina-olive rounded-2xl font-black uppercase text-[9px] border border-lumina-olive/10 hover:bg-lumina-rust/10 transition-all disabled:opacity-50">
                Cancel
              </button>
           </div>
        </div>

        <!-- Liste des coupons -->
        <div *ngFor="let c of coupons" class="bg-white p-8 rounded-[40px] border border-lumina-olive/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group flex flex-col">
           <!-- Ticket Perforations -->
           <div class="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-lumina-cream shadow-inner border border-lumina-olive/5"></div>
           <div class="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-lumina-cream shadow-inner border border-lumina-olive/5"></div>

           <div class="flex justify-between items-start mb-6">
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-lumina-tan uppercase tracking-widest mb-1">{{ c.id }}</span>
                <span [ngClass]="c.used_date ? 'bg-lumina-olive/10 text-lumina-olive/40' : 'bg-lumina-mint text-white'" 
                      class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest w-fit">
                  {{ c.used_date ? 'Redeemed' : 'Active' }}
                </span>
              </div>
              <button (click)="deleteCoupon(c.id)" 
                      [disabled]="isSubmitting()"
                      class="text-lumina-rust/30 hover:text-lumina-rust transition-colors disabled:opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
           </div>
           
           <h4 class="text-xl font-black text-lumina-olive mb-4 font-outfit leading-tight">{{ c.description }}</h4>
           
           <div class="mb-4">
             <span class="text-3xl font-black text-lumina-rust">{{ c.discountPercentage }}%</span>
             <span class="text-[10px] font-black text-lumina-olive/40 ml-2">OFF</span>
           </div>
           
           <div class="mt-auto pt-6 border-t border-dashed border-lumina-olive/10 flex justify-between items-end">
              <div>
                <p class="text-[8px] font-black text-lumina-tan uppercase mb-1">Validity</p>
                <p class="text-[10px] font-bold text-lumina-olive/60">
                  {{ c.start_date | date:'shortDate' }} — {{ c.end_date | date:'shortDate' }}
                </p>
              </div>
              <button *ngIf="!c.used_date" 
                      (click)="useCoupon(c.id)" 
                      [disabled]="isSubmitting()"
                      class="px-4 py-2 bg-lumina-rust/10 text-lumina-rust rounded-lg text-[9px] font-black uppercase hover:bg-lumina-rust hover:text-white transition-all disabled:opacity-50">
                Mark as Used
              </button>
           </div>
        </div>
      </div>

      <!-- Message si aucun coupon -->
      <div *ngIf="!isLoading() && coupons.length === 0 && !showForm()" 
           class="text-center py-20 bg-lumina-cream rounded-[60px] border-2 border-dashed border-lumina-olive/10">
        <p class="text-[12px] font-black uppercase tracking-widest text-lumina-olive/30">
          No active vouchers — Issue your first promotion
        </p>
      </div>
    </div>
  `
})
export class ShopCouponsCrudComponent implements OnInit {
  @Input() coupons: Coupon[] = [];
  @Output() onAdd = new EventEmitter<Partial<Coupon>>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onUse = new EventEmitter<string>();
  
  private apiService = inject(ApiService); // Injection du service API
  
  showForm = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  newCoupon = { 
    description: '', 
    start_date: '', 
    end_date: '',
    discountPercentage: 20 // Valeur par défaut
  };

  ngOnInit() {
    // Charger les coupons depuis l'API si nécessaire
    this.loadCoupons();
  }

  private loadCoupons() {
    // Si vous avez un endpoint pour récupérer les coupons du shop
    // this.isLoading.set(true);
    // this.apiService.getShopCoupons().subscribe({
    //   next: (coupons) => {
    //     this.coupons = coupons;
    //     this.isLoading.set(false);
    //   },
    //   error: (error) => {
    //     this.errorMessage.set('Failed to load coupons');
    //     this.isLoading.set(false);
    //   }
    // });
  }

  // Validation du formulaire
  isFormValid(): boolean {
    return !!(
      this.newCoupon.description?.trim() &&
      this.newCoupon.discountPercentage > 0 &&
      this.newCoupon.discountPercentage <= 100 &&
      this.newCoupon.start_date &&
      this.newCoupon.end_date &&
      new Date(this.newCoupon.start_date) < new Date(this.newCoupon.end_date)
    );
  }

  // Soumission du formulaire
  submit() {
    if (!this.isFormValid()) {
      this.errorMessage.set('Please fill all fields correctly');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Appel API pour créer le coupon
    this.apiService.createCoupon({
      title: this.newCoupon.description, // Utiliser description comme title
      description: this.newCoupon.description,
      discountPercentage: this.newCoupon.discountPercentage,
      validUntil: this.newCoupon.end_date
    }).subscribe({
      next: (response) => {
        console.log('Coupon created successfully:', response);
        
        // Émettre l'événement pour le parent
        this.onAdd.emit(this.newCoupon);
        
        // Afficher le message de succès
        this.successMessage.set('Coupon created successfully!');
        
        // Réinitialiser le formulaire
        this.resetForm();
        
        this.isSubmitting.set(false);
        
        // Cacher le formulaire après 1 seconde
        setTimeout(() => {
          this.showForm.set(false);
          this.successMessage.set(null);
        }, 1500);
      },
      error: (error) => {
        console.error('Error creating coupon:', error);
        this.errorMessage.set(error.message || 'Failed to create coupon');
        this.isSubmitting.set(false);
      }
    });
  }

  // Supprimer un coupon
  deleteCoupon(couponId: string) {
    if (!confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Si vous avez un endpoint de suppression
    // this.apiService.deleteCoupon(couponId).subscribe({
    //   next: () => {
    //     this.onDelete.emit(couponId);
    //     this.successMessage.set('Coupon deleted successfully');
    //     this.isSubmitting.set(false);
    //   },
    //   error: (error) => {
    //     this.errorMessage.set(error.message || 'Failed to delete coupon');
    //     this.isSubmitting.set(false);
    //   }
    // });

    // Version sans API (juste événement)
    this.onDelete.emit(couponId);
    this.successMessage.set('Coupon deleted successfully');
    this.isSubmitting.set(false);
    
    setTimeout(() => this.successMessage.set(null), 2000);
  }

  // Marquer un coupon comme utilisé
  useCoupon(couponId: string) {
    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Si vous avez un endpoint pour marquer comme utilisé
    // this.apiService.markCouponAsUsed(couponId).subscribe({
    //   next: () => {
    //     this.onUse.emit(couponId);
    //     this.successMessage.set('Coupon marked as used');
    //     this.isSubmitting.set(false);
    //   },
    //   error: (error) => {
    //     this.errorMessage.set(error.message || 'Failed to update coupon');
    //     this.isSubmitting.set(false);
    //   }
    // });

    // Version sans API (juste événement)
    this.onUse.emit(couponId);
    this.successMessage.set('Coupon marked as used');
    this.isSubmitting.set(false);
    
    setTimeout(() => this.successMessage.set(null), 2000);
  }

  // Annuler le formulaire
  cancelForm() {
    this.resetForm();
    this.showForm.set(false);
    this.errorMessage.set(null);
  }

  // Réinitialiser le formulaire
  private resetForm() {
    this.newCoupon = { 
      description: '', 
      start_date: '', 
      end_date: '',
      discountPercentage: 20
    };
  }

  // Méthode utilitaire pour formater les dates
  formatDateForApi(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }
}