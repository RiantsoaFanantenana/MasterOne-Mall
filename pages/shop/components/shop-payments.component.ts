import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service'; // AJOUTER L'IMPORT

@Component({
  selector: 'app-shop-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-12">
      <div class="bg-white p-12 rounded-[50px] border border-lumina-olive/10 shadow-sm">
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tight mb-8">Monthly Charges</h3>
        
        <!-- Error/Success Messages -->
        <div *ngIf="errorMessage()" class="mb-6 p-4 bg-lumina-rust/10 border border-lumina-rust/20 rounded-2xl text-center">
          <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMessage() }}</p>
        </div>
        
        <div *ngIf="successMessage()" class="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
          <p class="text-[10px] font-black uppercase tracking-widest text-green-600">{{ successMessage() }}</p>
        </div>

        <!-- Pending Charges -->
        <div class="space-y-4 mb-8">
          <div *ngFor="let charge of pendingCharges" 
               class="flex items-center justify-between p-6 bg-lumina-cream rounded-3xl border border-lumina-olive/5">
            <div>
              <p class="text-[11px] font-black uppercase tracking-widest text-lumina-olive/60">{{ charge.month }}/{{ charge.year }}</p>
              <p class="text-2xl font-black text-lumina-olive">{{ charge.amount }} €</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-[9px] font-black uppercase text-lumina-rust bg-lumina-rust/10 px-4 py-2 rounded-xl">Pending</span>
              <input type="checkbox" 
                     [checked]="selectedCharges.includes(charge.id)"
                     (change)="toggleCharge(charge.id)"
                     class="w-6 h-6 rounded-lg border-2 border-lumina-olive/20">
            </div>
          </div>
        </div>

        <!-- Pay Button -->
        <button (click)="processPayment()"
                [disabled]="selectedCharges.length === 0 || isSubmitting()"
                class="w-full py-6 bg-lumina-olive text-white rounded-[30px] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-lumina-rust transition-all disabled:opacity-50">
          {{ isSubmitting() ? 'PROCESSING...' : 'Pay Selected Charges' }}
        </button>
      </div>

      <!-- Payment History -->
      <div class="bg-white p-12 rounded-[50px] border border-lumina-olive/10 shadow-sm">
        <h4 class="text-xl font-black text-lumina-olive font-outfit uppercase tracking-tight mb-6">Payment History</h4>
        <div class="space-y-3">
          <div *ngFor="let payment of paymentHistory" 
               class="flex items-center justify-between p-4 border-b border-lumina-olive/5 last:border-0">
            <div>
              <p class="text-[10px] font-black text-lumina-olive/60">{{ payment.date | date }}</p>
              <p class="text-sm font-bold text-lumina-olive">{{ payment.amount }} €</p>
            </div>
            <span [class.bg-green-500]="payment.status === 'accepted'"
                  [class.bg-lumina-tan]="payment.status === 'review'"
                  [class.bg-lumina-rust]="payment.status === 'rejected'"
                  class="px-3 py-1 rounded-full text-[8px] font-black uppercase text-white">
              {{ payment.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShopPaymentsComponent {
  @Input() monthlyCharges: any[] = [];
  @Input() paymentHistory: any[] = [];
  @Output() onPay = new EventEmitter<any>();

  private apiService = inject(ApiService);
  
  selectedCharges: string[] = [];
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  get pendingCharges() {
    return this.monthlyCharges.filter(c => c.status === 'pending');
  }

  toggleCharge(chargeId: string) {
    const index = this.selectedCharges.indexOf(chargeId);
    if (index === -1) {
      this.selectedCharges.push(chargeId);
    } else {
      this.selectedCharges.splice(index, 1);
    }
  }

  processPayment() {
    if (this.selectedCharges.length === 0) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const paymentData = {
      periods: this.selectedCharges.map(id => {
        const charge = this.monthlyCharges.find(c => c.id === id);
        return {
          month: charge.month,
          year: charge.year
        };
      }),
      chargesIds: this.selectedCharges
    };

    this.onPay.emit(paymentData);
    
    // Simulation de succès
    setTimeout(() => {
      this.successMessage.set('Payment processed successfully!');
      this.selectedCharges = [];
      this.isSubmitting.set(false);
      
      setTimeout(() => this.successMessage.set(null), 3000);
    }, 2000);
  }
}