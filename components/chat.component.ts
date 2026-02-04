
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../types.ts';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-14rem)] flex flex-col bg-white rounded-xl border border-lumina-olive/5 shadow-xl overflow-hidden motion-slide-in">
      <div class="bg-lumina-olive p-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-lumina-rust flex items-center justify-center shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.3"/><path d="M12 12l9.8 3.6"/><path d="M12 12l-5.2 8.5"/></svg>
          </div>
          <div>
            <h2 class="text-white text-lg font-black leading-tight">MasterOne Retail Intelligence</h2>
            <p class="text-lumina-sage text-[10px] font-bold uppercase tracking-widest">Master Cloud v3.1</p>
          </div>
        </div>
        <button (click)="clearChat.emit()" class="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-tighter">Reset Protocol</button>
      </div>

      <div class="flex-1 overflow-y-auto p-8 space-y-6 bg-white/50 custom-scrollbar">
        <div *ngIf="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center motion-slide-in stagger-2">
          <div class="w-16 h-16 bg-lumina-olive/5 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-20 text-lumina-olive"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 class="text-xl font-black text-lumina-olive mb-2">MasterOne Assistant</h3>
          <p class="text-lumina-tan max-w-sm text-sm font-medium">Ask questions about MasterOne Mall optimization or boutique performance.</p>
        </div>

        <div *ngFor="let msg of messages" 
             class="flex motion-slide-in"
             [ngClass]="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <div class="max-w-[75%] p-5 rounded-xl shadow-sm"
               [ngClass]="{
                 'bg-lumina-rust text-white rounded-tr-none shadow-lg shadow-lumina-rust/20': msg.role === 'user',
                 'bg-lumina-sage/10 text-lumina-olive border border-lumina-sage/20 rounded-tl-none': msg.role !== 'user'
               }">
            <p class="text-sm leading-relaxed font-semibold">{{ msg.content }}</p>
            <span class="text-[9px] opacity-40 mt-3 block font-black uppercase tracking-widest">{{ msg.timestamp | date:'HH:mm' }}</span>
          </div>
        </div>

        <div *ngIf="isTyping" class="flex justify-start">
          <div class="bg-lumina-sage/5 p-5 rounded-xl rounded-tl-none flex gap-1.5 items-center">
            <div class="w-1.5 h-1.5 bg-lumina-olive rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-lumina-olive rounded-full animate-bounce delay-75"></div>
            <div class="w-1.5 h-1.5 bg-lumina-olive rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-white border-t border-lumina-olive/5 motion-slide-in stagger-3">
        <div class="flex items-center gap-3 bg-lumina-cream p-2 rounded-xl border border-lumina-olive/10 focus-within:border-lumina-rust focus-within:bg-white focus-within:shadow-lg transition-all">
          <input 
            [(ngModel)]="userInput"
            (keydown.enter)="handleSend()"
            placeholder="Query MasterOne Intelligence..." 
            class="flex-1 bg-transparent px-4 py-3 outline-none text-lumina-olive font-bold text-sm"
          />
          <button 
            (click)="handleSend()"
            [disabled]="!userInput.trim() || isTyping"
            class="p-4 bg-lumina-rust hover:bg-lumina-olive disabled:opacity-20 rounded-xl text-white transition-all shadow-lg group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
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
