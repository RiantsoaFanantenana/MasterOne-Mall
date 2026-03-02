
import { Component, Input, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterDataService } from '../../../services/master-data.service';

@Component({
  selector: 'app-shop-direct-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Overlay/Window - Repositioned to show it's triggered from header -->
    <div *ngIf="data.isDirectChatOpen() && data.clientActiveShop() as shop" 
         class="fixed top-24 right-6 md:right-16 z-[100] w-[calc(100vw-3rem)] md:w-96 h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-[40px] shadow-3xl border border-lumina-olive/10 flex flex-col overflow-hidden animate-in slide-in-from-top-10 fade-in duration-500">
      
      <div class="p-8 bg-lumina-mint text-white flex justify-between items-center">
         <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
              {{ shop.shop_name.charAt(0) }}
            </div>
            <div>
              <h4 class="font-black uppercase tracking-tighter text-sm leading-none">{{ shop.shop_name }}</h4>
              <p class="text-[8px] font-black uppercase tracking-widest opacity-60 mt-1">Direct Assistance Channel</p>
            </div>
         </div>
         <button (click)="data.isDirectChatOpen.set(false)" class="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
         </button>
      </div>

      <div class="flex-1 overflow-y-auto p-8 space-y-6 bg-lumina-cream/30 custom-scrollbar" #scrollContainer>
         <div *ngIf="!conversation()" class="h-full flex flex-col items-center justify-center text-center p-6 opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p class="text-[10px] font-black uppercase tracking-widest mt-4">Ask the House of Excellence anything</p>
         </div>

         <div *ngFor="let m of conversation()?.messages" 
              [ngClass]="m.role === 'user' ? 'justify-end' : 'justify-start'"
              class="flex">
            <div [ngClass]="m.role === 'user' ? 'bg-lumina-olive text-white rounded-tr-none' : 'bg-white text-lumina-olive rounded-tl-none border border-lumina-olive/5'"
                 class="max-w-[85%] p-4 rounded-[24px] shadow-sm">
               <p class="text-xs font-medium leading-relaxed">{{ m.content }}</p>
            </div>
         </div>
      </div>

      <div class="p-6 bg-white border-t border-lumina-olive/5">
         <div class="flex gap-3">
            <input [(ngModel)]="messageText" (keydown.enter)="send()" placeholder="Type your inquiry..." 
                   class="flex-1 px-6 py-4 bg-lumina-cream rounded-2xl text-xs font-bold text-lumina-olive outline-none focus:ring-2 focus:ring-lumina-mint/20 border border-transparent" />
            <button (click)="send()" class="w-12 h-12 bg-lumina-mint text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
         </div>
      </div>
    </div>
  `
})
export class ShopDirectChatComponent {
  data = inject(MasterDataService);
  messageText = '';

  conversation = computed(() => {
    const shop = this.data.clientActiveShop();
    if (!shop) return null;
    return this.data.conversations().find(c => c.shop_id === shop.user_id && c.client_id === 'client_001');
  });

  send() {
    const shop = this.data.clientActiveShop();
    if (this.messageText.trim() && shop) {
      this.data.sendClientMessage(shop.user_id, this.messageText.trim());
      this.messageText = '';
    }
  }
}
