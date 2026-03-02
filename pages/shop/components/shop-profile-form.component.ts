import { Component, Input, Output, EventEmitter, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopProfile } from '../../../types';
import { ShopDetailsComponent } from '../../client/components/shop-details.component';
import { MasterDataService } from '../../../services/master-data.service';
import { ApiService } from '../../../services/api.service'; // Ajout de l'import

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

      <!-- Message d'erreur -->
      <div *ngIf="errorMessage()" class="bg-lumina-rust/10 border border-lumina-rust/20 p-6 rounded-3xl text-center">
        <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMessage() }}</p>
      </div>

      <!-- Message de succès -->
      <div *ngIf="successMessage()" class="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl text-center">
        <p class="text-[10px] font-black uppercase tracking-widest text-green-600">{{ successMessage() }}</p>
      </div>

      <div *ngIf="!previewMode()" class="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-top-4">
         <div class="bg-white p-12 rounded-[50px] border border-lumina-olive/10 shadow-sm space-y-8">
            <div class="space-y-3">
               <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Boutique Nomenclature</label>
               <input [(ngModel)]="profile.shop_name" 
                      [disabled]="isSubmitting()"
                      class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive outline-none focus:border-lumina-rust transition-all disabled:opacity-50" />
            </div>
            <div class="space-y-3">
               <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Brand Narrative (Description)</label>
               <textarea [(ngModel)]="profile.description" 
                         [disabled]="isSubmitting()"
                         rows="5" class="w-full px-8 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive resize-none leading-relaxed outline-none focus:border-lumina-rust transition-all disabled:opacity-50"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Logo Asset URL</label>
                <input [(ngModel)]="profile.logo" 
                       [disabled]="isSubmitting()"
                       class="w-full px-6 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-2xl font-bold text-xs text-lumina-olive/60 disabled:opacity-50" />
              </div>
              <div class="space-y-3">
                <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Cover Pic URL</label>
                <input [(ngModel)]="profile.cover_pic" 
                       [disabled]="isSubmitting()"
                       class="w-full px-6 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-2xl font-bold text-xs text-lumina-olive/60 disabled:opacity-50" />
              </div>
            </div>

            <!-- Nouveau mot de passe (optionnel) -->
            <div class="space-y-3" *ngIf="showPasswordField">
               <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">New Password (Optional)</label>
               <input type="password" 
                      [(ngModel)]="newPassword" 
                      [disabled]="isSubmitting()"
                      placeholder="Leave blank to keep current password"
                      class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive outline-none focus:border-lumina-rust transition-all disabled:opacity-50" />
            </div>

            <button (click)="saveProfile()" 
                    [disabled]="isSubmitting()"
                    class="w-full py-6 bg-lumina-olive text-white rounded-[30px] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-lumina-rust transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting() ? 'SYNCHRONIZING...' : 'Synchronize Profile' }}
            </button>
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
export class ShopProfileFormComponent implements OnInit {
  @Input() profile!: ShopProfile;
  @Output() onSave = new EventEmitter<ShopProfile>();
  
  private apiService = inject(ApiService); // Injection de l'ApiService
  data = inject(MasterDataService);
  
  previewMode = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  newPassword = ''; // Pour le changement de mot de passe optionnel
  
  showPasswordField = true; // À ajuster selon vos besoins

  myEvents = computed(() => this.data.events().filter(e => e.shop_id === this.profile.user_id));
  myDiscounts = computed(() => this.data.discounts().filter(d => d.shop_id === this.profile.user_id));

  ngOnInit() {
    // Vérifier si le profil est déjà configuré
    this.checkConfigurationStatus();
  }

  private checkConfigurationStatus() {
    // Logique pour déterminer si le mot de passe doit être affiché
    // Par exemple, si c'est la première configuration
    const isFirstTime = !localStorage.getItem(`shop_configured_${this.profile.user_id}`);
    this.showPasswordField = isFirstTime;
  }

  saveProfile() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Validation basique
    if (!this.profile.shop_name?.trim()) {
      this.errorMessage.set('Shop name is required');
      return;
    }

    this.isSubmitting.set(true);

    // Appel à configureShop via ApiService
    this.apiService.configureShop({
      user: this.profile.user_id.toString(), // Convertir en string si nécessaire
      newPassword: this.newPassword || this.generateRandomPassword(), // Utiliser le nouveau mot de passe ou en générer un
      logo: this.profile.logo || this.generateDefaultLogo(),
      coverPic: this.profile.cover_pic || '',
      description: this.profile.description || ''
    }).subscribe({
      next: (response) => {
        console.log('Shop configured successfully:', response);
        
        // Marquer comme configuré
        localStorage.setItem(`shop_configured_${this.profile.user_id}`, 'true');
        
        // Afficher le message de succès
        this.successMessage.set('Profile synchronized successfully!');
        
        // Émettre l'événement de sauvegarde
        this.onSave.emit(this.profile);
        
        // Masquer le champ mot de passe pour les prochaines fois
        this.showPasswordField = false;
        this.newPassword = '';
        
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error configuring shop:', error);
        this.errorMessage.set(error.message || 'Failed to synchronize profile. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }

  private generateRandomPassword(): string {
    // Générer un mot de passe aléatoire sécurisé
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  private generateDefaultLogo(): string {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.profile.shop_name || 'Shop')}`;
  }

  // Pour réinitialiser les messages
  clearMessages() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }
}