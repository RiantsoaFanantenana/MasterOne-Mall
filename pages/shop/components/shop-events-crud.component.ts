import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MallEvent } from '../../../types';
import { ApiService } from '../../../services/api.service'; // AJOUT

@Component({
  selector: 'app-shop-events-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-10">
      <!-- Header avec bouton de création -->
      <div class="flex justify-between items-center">
        <h3 class="text-3xl font-black text-lumina-olive font-outfit uppercase tracking-tight">Event Protocols</h3>
        <button (click)="showForm.set(true)" 
                [disabled]="isSubmitting()"
                class="px-8 py-4 bg-lumina-rust text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-lumina-olive transition-all disabled:opacity-50">
          New Event
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
        <!-- New Event Form -->
        <div *ngIf="showForm()" class="bg-lumina-cream border-2 border-dashed border-lumina-olive/10 p-10 rounded-[40px] flex flex-col space-y-6 animate-in slide-in-from-top-10">
           <div class="space-y-2">
             <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Event Title</label>
             <input [(ngModel)]="newEvent.title" 
                    [disabled]="isSubmitting()"
                    placeholder="Summer Gala 2026..." 
                    class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm disabled:opacity-50" />
           </div>
           
           <div class="space-y-2">
             <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Description</label>
             <textarea [(ngModel)]="newEvent.description" 
                       [disabled]="isSubmitting()"
                       placeholder="Event narrative..." 
                       class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm resize-none disabled:opacity-50" 
                       rows="3"></textarea>
           </div>
           
           <div class="space-y-2">
             <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Location</label>
             <input [(ngModel)]="newEvent.location" 
                    [disabled]="isSubmitting()"
                    placeholder="Mall Central - Main Atrium" 
                    class="w-full px-6 py-4 bg-white rounded-2xl font-bold text-lumina-olive border-none outline-none shadow-sm disabled:opacity-50" />
           </div>
           
           <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">Start Date</label>
                <input [(ngModel)]="newEvent.start_date" 
                       [disabled]="isSubmitting()"
                       type="date" 
                       class="w-full bg-white p-4 rounded-xl font-bold text-xs disabled:opacity-50" />
              </div>
              <div class="space-y-2">
                <label class="text-[9px] font-black uppercase text-lumina-olive/40 ml-2">End Date</label>
                <input [(ngModel)]="newEvent.end_date" 
                       [disabled]="isSubmitting()"
                       type="date" 
                       class="w-full bg-white p-4 rounded-xl font-bold text-xs disabled:opacity-50" />
              </div>
           </div>
           
           <div class="flex items-center gap-4 px-2">
             <label class="text-[10px] font-black uppercase text-lumina-olive/40 flex items-center gap-2 cursor-pointer">
               <input type="checkbox" 
                      [(ngModel)]="newEvent.is_public" 
                      [disabled]="isSubmitting()"
                      class="w-4 h-4 rounded-md accent-lumina-rust"> 
               Public Event
             </label>
           </div>
           
           <div class="flex gap-2 pt-4">
              <button (click)="submit()" 
                      [disabled]="isSubmitting() || !isFormValid()"
                      class="flex-1 py-4 bg-lumina-olive text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-lumina-rust transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSubmitting() ? 'DEPLOYING...' : 'Deploy' }}
              </button>
              <button (click)="cancelForm()" 
                      [disabled]="isSubmitting()"
                      class="px-6 py-4 bg-white text-lumina-olive rounded-2xl font-black uppercase text-[9px] border border-lumina-olive/10 hover:bg-lumina-rust/10 transition-all disabled:opacity-50">
                Cancel
              </button>
           </div>
        </div>

        <!-- Liste des événements -->
        <div *ngFor="let e of events" class="bg-white p-8 rounded-[40px] border border-lumina-olive/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
           <div class="flex justify-between items-start mb-6">
              <span [ngClass]="e.status === 'published' ? 'bg-lumina-mint' : 'bg-lumina-tan'" 
                    class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                {{ e.status }}
              </span>
              <button (click)="deleteEvent(e.id)" 
                      [disabled]="isSubmitting()"
                      class="text-lumina-rust/30 hover:text-lumina-rust transition-colors disabled:opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
           </div>
           
           <h4 class="text-2xl font-black text-lumina-olive mb-3 font-outfit">{{ e.title }}</h4>
           <p class="text-[11px] text-lumina-olive/50 leading-relaxed mb-6 line-clamp-2">{{ e.description }}</p>
           
           <div class="mb-4" *ngIf="e.location">
             <span class="text-[8px] font-black uppercase text-lumina-tan">📍 {{ e.location }}</span>
           </div>
           
           <div class="pt-6 border-t border-lumina-olive/5 flex justify-between items-center">
              <span class="text-[10px] font-black text-lumina-tan uppercase">
                {{ e.start_date | date:'MMM d' }} — {{ e.end_date | date:'MMM d' }}
              </span>
              <span class="text-[9px] font-black uppercase text-lumina-rust">
                {{ e.is_public ? 'Public' : 'VIP' }}
              </span>
           </div>
        </div>
      </div>

      <!-- Message si aucun événement -->
      <div *ngIf="!isLoading() && events.length === 0 && !showForm()" 
           class="text-center py-20 bg-lumina-cream rounded-[60px] border-2 border-dashed border-lumina-olive/10">
        <p class="text-[12px] font-black uppercase tracking-widest text-lumina-olive/30">
          No events scheduled — Create your first event
        </p>
      </div>
    </div>
  `
})
export class ShopEventsCrudComponent {
  @Input() events: MallEvent[] = [];
  @Output() onAdd = new EventEmitter<Partial<MallEvent>>();
  @Output() onDelete = new EventEmitter<number>();
  
  private apiService = inject(ApiService); // Injection du service API
  
  showForm = signal(false);
  isLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  newEvent = { 
    title: '', 
    description: '', 
    location: '',
    start_date: '', 
    end_date: '', 
    is_public: true, 
    status: 'published' as const 
  };

  // Validation du formulaire
  isFormValid(): boolean {
    return !!(
      this.newEvent.title?.trim() &&
      this.newEvent.description?.trim() &&
      this.newEvent.start_date &&
      this.newEvent.end_date &&
      new Date(this.newEvent.start_date) < new Date(this.newEvent.end_date)
    );
  }

  // Soumission du formulaire
  submit() {
    if (!this.isFormValid()) {
      this.errorMessage.set('Please fill all required fields correctly');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Appel API pour créer l'événement
    this.apiService.createEvent({
      title: this.newEvent.title,
      description: this.newEvent.description,
      eventDate: this.newEvent.start_date, // L'API utilise eventDate
      location: this.newEvent.location || 'Mall Central'
    }).subscribe({
      next: (response) => {
        console.log('Event created successfully:', response);
        
        // Émettre l'événement pour le parent avec l'ID retourné par l'API
        this.onAdd.emit({
          ...this.newEvent,
          id: response.id || Date.now() // Utiliser l'ID de l'API ou générer un ID temporaire
        });
        
        // Afficher le message de succès
        this.successMessage.set('Event created successfully!');
        
        // Réinitialiser le formulaire
        this.resetForm();
        
        this.isSubmitting.set(false);
        
        // Cacher le formulaire après 1.5 secondes
        setTimeout(() => {
          this.showForm.set(false);
          this.successMessage.set(null);
        }, 1500);
      },
      error: (error) => {
        console.error('Error creating event:', error);
        this.errorMessage.set(error.message || 'Failed to create event');
        this.isSubmitting.set(false);
      }
    });
  }

  // Supprimer un événement
  deleteEvent(eventId: number) {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // TODO: Ajouter un endpoint de suppression dans ApiService si nécessaire
    // this.apiService.deleteEvent(eventId).subscribe({
    //   next: () => {
    //     this.onDelete.emit(eventId);
    //     this.successMessage.set('Event deleted successfully');
    //     this.isSubmitting.set(false);
    //   },
    //   error: (error) => {
    //     this.errorMessage.set(error.message || 'Failed to delete event');
    //     this.isSubmitting.set(false);
    //   }
    // });

    // Version sans appel API (juste événement)
    this.onDelete.emit(eventId);
    this.successMessage.set('Event deleted successfully');
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
    this.newEvent = { 
      title: '', 
      description: '', 
      location: '',
      start_date: '', 
      end_date: '', 
      is_public: true, 
      status: 'published' 
    };
  }

  // Formater la date pour l'API
  private formatDateForApi(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }
}