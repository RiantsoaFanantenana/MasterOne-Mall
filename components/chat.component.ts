// components/chat.component.ts - Version avec ChangeDetectorRef
import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../services/gemini.service';
import { ApiService } from '../services/api.service';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[50px] border border-lumina-olive/5 shadow-2xl overflow-hidden motion-slide-in">
      <!-- Header avec rôle -->
      <div class="bg-lumina-olive p-10 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="w-14 h-14 rounded-[24px] bg-lumina-rust flex items-center justify-center text-white shadow-xl rotate-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.3"/><path d="M12 12l9.8 3.6"/><path d="M12 12l-5.2 8.5"/></svg>
          </div>
          <div>
            <h2 class="text-white text-2xl font-black leading-tight font-outfit uppercase tracking-tighter">
              MasterOne {{ roleDisplayName }}
            </h2>
            <p class="text-lumina-sage text-[10px] font-black uppercase tracking-[0.4em]">
              {{ roleDescription }}
            </p>
          </div>
        </div>
        <button (click)="clearChat()" class="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-colors">
          Decommission Chat
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-12 space-y-10 bg-white/50 custom-scrollbar" #messagesContainer>
        <!-- Welcome message -->
        <div *ngIf="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center motion-slide-in stagger-2">
          <div class="w-24 h-24 bg-lumina-olive/5 rounded-full flex items-center justify-center mb-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-20 text-lumina-olive"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 class="text-3xl font-black text-lumina-olive mb-4 uppercase font-outfit tracking-tight">
            {{ welcomeTitle }}
          </h3>
          <p class="text-lumina-tan max-w-sm text-sm font-medium leading-relaxed">
            {{ welcomeMessage }}
          </p>
        </div>

        <!-- Message list -->
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

        <!-- Typing indicator -->
        <div *ngIf="isTyping" class="flex justify-start">
          <div class="bg-lumina-cream p-6 rounded-[24px] rounded-tl-none flex gap-2 items-center border border-lumina-olive/5">
            <div class="w-2 h-2 bg-lumina-rust rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-lumina-rust rounded-full animate-bounce delay-75"></div>
            <div class="w-2 h-2 bg-lumina-rust rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-10 bg-white border-t border-lumina-olive/5 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.03)]">
        <div class="flex items-center gap-6">
          <div class="flex-1 relative group">
            <input 
              [(ngModel)]="userInput"
              (keydown.enter)="handleSend()"
              [placeholder]="inputPlaceholder"
              [disabled]="isTyping"
              class="w-full px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[35px] font-bold text-lumina-olive font-outfit outline-none focus:border-lumina-rust focus:ring-8 focus:ring-lumina-rust/5 transition-all shadow-inner shadow-black/5 text-lg placeholder:text-lumina-olive/20 disabled:opacity-50"
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
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  private geminiService = inject(GeminiService);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef); // Ajout de ChangeDetectorRef
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages: Message[] = [];
  userInput: string = '';
  
  // Variables simples
  isTyping = false;
  private scrollAfterViewUpdate = false;
  private typingTimeout: any = null;
  private requestInProgress = false;
  
  // Propriétés basées sur le rôle
  roleDisplayName: string = 'Assistant';
  roleDescription: string = 'Neural Operations Hub v3.1';
  welcomeTitle: string = 'Intelligence Assistant';
  welcomeMessage: string = 'Ask MasterOne\'s neural network for retail optimization insights or mall operations data.';
  inputPlaceholder: string = 'Query MasterOne Intelligence...';

  ngOnInit() {
    this.updateContextForRole();
    this.loadChatHistory();
  }

  ngAfterViewChecked() {
    if (this.scrollAfterViewUpdate) {
      this.scrollToBottom();
      this.scrollAfterViewUpdate = false;
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  private updateContextForRole() {
    if (this.apiService.isAdmin()) {
      this.roleDisplayName = 'Admin';
      this.roleDescription = 'Mall Operations • Strategic Command';
      this.welcomeTitle = 'Mall Administration Console';
      this.welcomeMessage = 'Access mall-wide analytics, tenant management, infrastructure oversight, and strategic planning tools.';
      this.inputPlaceholder = 'Query mall operations or request analytics...';
    } 
    else if (this.apiService.isShop()) {
      this.roleDisplayName = 'Manager';
      this.roleDescription = 'Boutique Operations • Performance Hub';
      this.welcomeTitle = 'Shop Management Suite';
      this.welcomeMessage = 'Monitor inventory, optimize staffing, manage promotions, and analyze customer flow for your boutique.';
      this.inputPlaceholder = 'Ask about your shop performance...';
    }
    else if (this.apiService.isClient()) {
      this.roleDisplayName = 'Assistant';
      this.roleDescription = 'Concierge • Experience Guide';
      this.welcomeTitle = 'Your Personal Concierge';
      this.welcomeMessage = 'Discover events, find exclusive discounts, navigate the mall, and get personalized boutique recommendations.';
      this.inputPlaceholder = 'Ask about events, shops, or directions...';
    }
    else {
      this.roleDisplayName = 'Guest';
      this.roleDescription = 'Visitor • Limited Access';
      this.welcomeTitle = 'Welcome to MasterOne';
      this.welcomeMessage = 'Please log in to access personalized assistance.';
      this.inputPlaceholder = 'Log in to start chatting...';
    }
  }

  private loadChatHistory() {
    const role = this.apiService.getUserRole();
    const saved = localStorage.getItem(`chat_history_${role}`);
    if (saved) {
      try {
        this.messages = JSON.parse(saved).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    }
  }

  private saveChatHistory() {
    const role = this.apiService.getUserRole();
    localStorage.setItem(`chat_history_${role}`, JSON.stringify(this.messages));
  }

  private forceStopTyping() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
    this.isTyping = false;
    this.requestInProgress = false;
    
    // Forcer la détection de changements
    this.cdr.detectChanges();
    
    console.log('Typing indicator forcé à false');
  }

  async handleSend() {
    const message = this.userInput.trim();
    
    if (!message || this.isTyping || this.requestInProgress) {
      console.log('Envoi bloqué - déjà en cours');
      return;
    }

    if (!this.apiService.isAuthenticated()) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Please log in to use the chat assistant.',
        timestamp: new Date()
      };
      this.messages = [...this.messages, errorMessage];
      this.saveChatHistory();
      this.scrollAfterViewUpdate = true;
      return;
    }

    // Message utilisateur
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    this.messages = [...this.messages, userMessage];
    this.userInput = '';
    this.saveChatHistory();
    this.scrollAfterViewUpdate = true;

    // Activer le typing indicator
    this.isTyping = true;
    this.requestInProgress = true;
    
    // Forcer la détection de changements
    this.cdr.detectChanges();
    
    // Timeout de sécurité
    this.typingTimeout = setTimeout(() => {
      if (this.isTyping) {
        console.log('Timeout de sécurité - arrêt forcé du typing');
        this.forceStopTyping();
        
        const timeoutMessage: Message = {
          role: 'assistant',
          content: 'The request is taking too long. Please try again.',
          timestamp: new Date()
        };
        this.messages = [...this.messages, timeoutMessage];
        this.saveChatHistory();
        this.scrollAfterViewUpdate = true;
        this.cdr.detectChanges();
      }
    }, 10000);

    try {
      const context = this.getContextForRole();
      const enhancedPrompt = context 
        ? `[Context: ${JSON.stringify(context)}]\n\nUser Role: ${this.apiService.getUserRole()}\n\n${message}`
        : `User Role: ${this.apiService.getUserRole()}\n\n${message}`;
      
      console.log('Envoi de la requête à Gemini...');
      const response = await this.geminiService.analyzeContent(enhancedPrompt);
      console.log('Réponse reçue de Gemini');
      
      if (this.requestInProgress) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        
        this.messages = [...this.messages, assistantMessage];
        this.saveChatHistory();
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      
      if (this.requestInProgress) {
        const errorMessage: Message = {
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again.',
          timestamp: new Date()
        };
        
        this.messages = [...this.messages, errorMessage];
        this.saveChatHistory();
      }
      
    } finally {
      // Arrêter le typing indicator
      this.forceStopTyping();
      this.scrollAfterViewUpdate = true;
      this.cdr.detectChanges(); // Forcer une dernière mise à jour
    }
  }

  private getContextForRole(): any {
    if (this.apiService.isAdmin()) {
      return {
        role: 'admin',
        permissions: ['mall-wide', 'financial', 'infrastructure', 'tenant-management'],
        context: 'Full mall administration access'
      };
    } 
    else if (this.apiService.isShop()) {
      return {
        role: 'shop',
        shopId: localStorage.getItem('shopId'),
        permissions: ['inventory', 'staff', 'promotions', 'sales'],
        context: 'Single boutique management'
      };
    }
    else if (this.apiService.isClient()) {
      return {
        role: 'client',
        context: 'Visitor assistance and wayfinding'
      };
    }
    return null;
  }

  clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.messages = [];
      this.saveChatHistory();
      this.cdr.detectChanges();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        setTimeout(() => {
          element.scrollTop = element.scrollHeight;
        }, 50);
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}