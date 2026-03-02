
import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatConversation } from '../../../types';

@Component({
  selector: 'app-shop-chat-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[700px]">
       <!-- Contacts List -->
       <div class="lg:col-span-4 bg-white rounded-[50px] border border-lumina-olive/10 shadow-sm flex flex-col overflow-hidden">
          <div class="p-8 border-b border-lumina-olive/5 bg-lumina-cream/50">
             <h3 class="text-xs font-black uppercase tracking-[0.4em] text-lumina-olive">Active Channels</h3>
          </div>
          <div class="flex-1 overflow-y-auto no-scrollbar">
             <button *ngFor="let c of conversations" 
                     (click)="activeConvId.set(c.id)"
                     [ngClass]="activeConvId() === c.id ? 'bg-lumina-sage/10' : 'hover:bg-lumina-cream/30'"
                     class="w-full p-8 text-left border-b border-lumina-olive/5 flex items-center gap-6 transition-all relative">
                <div class="w-14 h-14 rounded-2xl bg-lumina-olive text-white flex items-center justify-center font-black text-lg shadow-lg">
                   {{ c.client_name.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                   <div class="flex justify-between items-center mb-1">
                      <span class="font-black text-lumina-olive uppercase text-xs">{{ c.client_name }}</span>
                      <span class="text-[8px] font-bold text-lumina-tan uppercase">{{ c.timestamp | date:'HH:mm' }}</span>
                   </div>
                   <p class="text-[11px] text-lumina-olive/50 truncate font-medium">{{ c.last_message }}</p>
                </div>
                <div *ngIf="c.unread" class="w-2.5 h-2.5 rounded-full bg-lumina-rust absolute right-8 top-12 shadow-lg shadow-lumina-rust/40"></div>
             </button>
          </div>
       </div>

       <!-- Message Area -->
       <div class="lg:col-span-8 bg-white rounded-[50px] border border-lumina-olive/10 shadow-sm flex flex-col overflow-hidden relative">
          <ng-container *ngIf="currentConversation() as conv; else emptyChat">
             <div class="p-8 border-b border-lumina-olive/5 flex justify-between items-center bg-lumina-cream/20">
                <div class="flex items-center gap-5">
                   <div class="w-10 h-10 rounded-xl bg-lumina-mint text-white flex items-center justify-center font-black text-xs shadow-md">
                      {{ conv.client_name.charAt(0) }}
                   </div>
                   <span class="font-black text-lumina-olive uppercase tracking-[0.2em] text-xs">{{ conv.client_name }} Secure Channel</span>
                </div>
             </div>

             <div class="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-white/50">
                <div *ngFor="let m of conv.messages" 
                     [ngClass]="m.role === 'user' ? 'justify-start' : 'justify-end'"
                     class="flex">
                   <div [ngClass]="m.role === 'user' ? 'bg-lumina-cream text-lumina-olive rounded-tr-none' : 'bg-lumina-olive text-white rounded-tl-none shadow-xl'"
                        class="max-w-[75%] p-6 rounded-[32px] border border-lumina-olive/5">
                      <p class="text-sm font-medium leading-relaxed">{{ m.content }}</p>
                      <span class="text-[8px] opacity-40 mt-4 block uppercase font-black text-right">{{ m.timestamp | date:'HH:mm' }}</span>
                   </div>
                </div>
             </div>

             <div class="p-10 border-t border-lumina-olive/5 bg-white">
                <div class="flex items-center gap-6">
                   <input [(ngModel)]="replyText" (keydown.enter)="sendReply()" placeholder="Type your secure response..." class="flex-1 px-8 py-5 bg-lumina-cream rounded-3xl font-bold text-lumina-olive border border-transparent outline-none focus:border-lumina-rust transition-all" />
                   <button (click)="sendReply()" class="w-16 h-16 bg-lumina-olive text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-lumina-rust transition-colors active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                   </button>
                </div>
             </div>
          </ng-container>
          <ng-template #emptyChat>
             <div class="flex-1 flex flex-col items-center justify-center text-center opacity-30 p-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <h4 class="text-2xl font-black font-outfit uppercase tracking-tighter mt-10">Secure Communications Hub</h4>
                <p class="text-xs font-black uppercase tracking-[0.4em] mt-4 leading-relaxed">Select a client conversation to begin encrypted session</p>
             </div>
          </ng-template>
       </div>
    </div>
  `
})
export class ShopChatRoomComponent {
  @Input() conversations: ChatConversation[] = [];
  @Output() onReply = new EventEmitter<{ convId: number, content: string }>();
  
  activeConvId = signal<number | null>(null);
  replyText = '';

  currentConversation = computed(() => this.conversations.find(c => c.id === this.activeConvId()));

  sendReply() {
    if (this.replyText.trim() && this.activeConvId()) {
      this.onReply.emit({ convId: this.activeConvId()!, content: this.replyText.trim() });
      this.replyText = '';
    }
  }
}
