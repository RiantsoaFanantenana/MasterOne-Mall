
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../types.ts';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[50px] border border-lumina-olive/5 shadow-2xl overflow-hidden motion-slide-in">
      <div class="bg-lumina-olive p-10 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="w-14 h-14 rounded-[24px] bg-lumina-rust flex items-center justify-center text-white shadow-xl rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.3"/><path d="M12 12l9.8 3.6"/><path d="M12 12l-5.2 8.5"/></svg>
          </div>
          <div>
            <h2 class="text-white text-2xl font-black leading-tight font-outfit uppercase tracking-tighter">MasterOne Retail AI</h2>
            <p class="text-lumina-sage text-[10px] font-black uppercase tracking-[0.4em]">Neural Operations Hub v3.1</p>
          </div>
        </div>
        <button (click)="clearChat.emit()" class="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-colors">Decommission Chat</button>
      </div>

      <div class="flex-1 overflow-y-auto p-12 space-y-10 bg-white/50 custom-scrollbar">
        <div *ngIf="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center motion-slide-in stagger-2">
          <div class="w-24 h-24 bg-lumina-olive/5 rounded-full flex items-center justify-center mb-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-20 text-lumina-olive"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 class="text-3xl font-black text-lumina-olive mb-4 uppercase font-outfit tracking-tight">Intelligence Assistant</h3>
          <p class="text-lumina-tan max-w-sm text-sm font-medium leading-relaxed">Ask MasterOne's neural network for retail optimization insights or mall operations data.</p>
        </div>

        <div *ngFor="let msg of messages" 
             class="flex motion-slide-in"
             [ngClass]="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <div class="max-w-[80%] p-8 rounded-[32px] shadow-sm"
               [ngClass]="{
                 'bg-lumina-rust text-white rounded-tr-none shadow-3xl shadow-lumina-rust/20': msg.role === 'user',
                 'bg-lumina-cream text-lumina-olive border border-lumina-olive/5 rounded-tl-none': msg.role !== 'user'
               }">
            <p class="text-[15px] leading-relaxed font-bold font-outfit tracking-tight">{{ msg.content }}</p>
            <span class="text-[9px] opacity-40 mt-6 block font-black uppercase tracking-[0.3em]">{{ msg.timestamp | date:'HH:mm' }}</span>
          </div>
        </div>

        <div *ngIf="isTyping" class="flex justify-start">
          <div class="bg-lumina-cream p-6 rounded-[24px] rounded-tl-none flex gap-2 items-center border border-lumina-olive/5">
            <div class="w-2 h-2 bg-lumina-rust rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-lumina-rust rounded-full animate-bounce delay-75"></div>
            <div class="w-2 h-2 bg-lumina-rust rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>

      <div class="p-10 bg-white border-t border-lumina-olive/5 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.03)]">
        <div class="flex items-center gap-6">
          <div class="flex-1 relative group">
            <input 
              [(ngModel)]="userInput"
              (keydown.enter)="handleSend()"
              placeholder="Query MasterOne Intelligence..." 
              class="w-full px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[35px] font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-8 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg placeholder:text-lumina-olive/20"
            />
          </div>
          <button 
            (click)="handleSend()"
            [disabled]="!userInput.trim() || isTyping"
            class="w-20 h-20 bg-lumina-rust hover:bg-lumina-olive disabled:opacity-30 rounded-[30px] text-white transition-all shadow-3xl active:scale-90 flex items-center justify-center rotate-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="-translate-x-0.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent {
  @Input() messages: Message[] = [];
  @Input() isTyping: boolean = false;
  @Output() sendMessage = new EventEmitter<string>();
  @Output() clearChat = new EventEmitter<void>();
  userInput: string = '';

  handleSend() {
    if (this.userInput.trim() && !this.isTyping) {
      this.sendMessage.emit(this.userInput);
      this.userInput = '';
    }
  }
}
