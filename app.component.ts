
import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from './services/gemini.service.ts';
import { Message } from './types.ts';
import { SidebarComponent } from './components/sidebar.component.ts';
import { HeaderComponent } from './components/header.component.ts';
import { ClientNavbarComponent } from './pages/client/client-navbar.component.ts';
import { MallViewComponent } from './pages/mall/mall-view.component.ts';
import { ShopViewComponent } from './pages/shop/shop-view.component.ts';
import { ClientViewComponent } from './pages/client/client-view.component.ts';
import { ClientShopsViewComponent } from './pages/client/client-shops-view.component.ts';
import { ClientServicesViewComponent } from './pages/client/client-services-view.component.ts';
import { ClientEventsViewComponent } from './pages/client/client-events-view.component.ts';
import { ClientWalletViewComponent } from './pages/client/client-wallet-view.component.ts';
import { ChatComponent } from './components/chat.component.ts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    SidebarComponent, 
    HeaderComponent, 
    ClientNavbarComponent,
    MallViewComponent,
    ShopViewComponent,
    ClientViewComponent,
    ClientShopsViewComponent,
    ClientServicesViewComponent,
    ClientEventsViewComponent,
    ClientWalletViewComponent,
    ChatComponent
  ],
  template: `
    <div [ngClass]="isClientMode() ? 'flex flex-col' : 'flex flex-row'" class="h-screen w-full overflow-hidden bg-lumina-cream font-jakarta">
      
      <!-- Admin/Shop Sidebar -->
      <app-sidebar 
        *ngIf="!isClientMode() && isLoggedIn()"
        [mode]="activeTab() === 'mall' || activeTab() === 'flux' || activeTab() === 'energy' ? 'admin' : 'shop'"
        [activeTab]="activeTab()" 
        [isOpen]="isSidebarOpen()"
        (tabChange)="activeTab.set($event)"
        (logout)="logout()"
        (close)="isSidebarOpen.set(false)"
      ></app-sidebar>

      <!-- Client Top Navbar -->
      <app-client-navbar 
        *ngIf="isClientMode()"
        [activeTab]="activeTab()"
        [isLoggedIn]="isLoggedIn()"
        (tabChange)="handleTabChange($event)"
        (onLoginRequest)="showLogin.set(true)"
        (logout)="logout()"
      ></app-client-navbar>

      <main class="flex-1 flex flex-col min-h-0 bg-lumina-cream relative overflow-hidden">
        <!-- Admin Header -->
        <app-header 
          *ngIf="!isClientMode() && isLoggedIn()"
          (toggleSidebar)="isSidebarOpen.set(!isSidebarOpen())"
        ></app-header>

        <div class="flex-1 overflow-y-auto custom-main-scroll relative h-full" id="main-scroll-container">
          
          <!-- Authentication Modal -->
          <div *ngIf="showLogin()" class="fixed inset-0 z-[100] flex items-center justify-center bg-lumina-dark/40 backdrop-blur-xl p-6">
            <div class="bg-white p-10 lg:p-14 rounded-[40px] shadow-3xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-500 border border-lumina-olive/10">
              <div class="text-center mb-10">
                <div class="w-20 h-20 bg-lumina-rust rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h2 class="text-4xl font-black text-lumina-olive font-outfit uppercase tracking-tighter">MasterOne Access</h2>
                <p class="text-lumina-tan text-[10px] font-black uppercase tracking-[0.4em] mt-3 opacity-60">MasterOne Secure Ecosystem</p>
              </div>

              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4">Access Profile</label>
                  <select [(ngModel)]="loginRole" class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-2xl font-bold outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all appearance-none cursor-pointer text-lumina-olive text-sm">
                    <option value="client">V.I.P. Visitor (Wallet Access)</option>
                    <option value="mall">Mall Operations Director</option>
                    <option value="shop">Store Boutique Manager</option>
                  </select>
                </div>

                <div class="space-y-2" *ngIf="loginRole !== 'client'">
                  <label class="text-[10px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4">Secure Passcode</label>
                  <input 
                    type="password" 
                    [(ngModel)]="loginPassword"
                    placeholder="••••••••"
                    (keydown.enter)="login()"
                    class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-2xl font-bold outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all text-lumina-olive text-sm"
                  />
                </div>

                <div *ngIf="loginRole === 'client'" class="p-8 bg-lumina-rust/5 rounded-3xl border border-lumina-rust/10 mb-2">
                   <p class="text-[11px] font-bold text-lumina-olive/60 leading-relaxed italic text-center">
                     Unlocking your MasterOne Visitor Profile grants access to private events, early sales, and our automated concierge.
                   </p>
                </div>

                <button (click)="login()" class="w-full py-6 bg-lumina-olive text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-lumina-rust transition-all shadow-2xl shadow-lumina-olive/20 active:scale-[0.98] text-xs">
                  {{ loginRole === 'client' ? 'Unlock MasterOne' : 'Authorize Entrance' }}
                </button>

                <div class="pt-8 border-t border-lumina-olive/5 text-center">
                  <button (click)="cancelLogin()" class="group flex items-center justify-center gap-3 mx-auto text-lumina-tan hover:text-lumina-rust transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-2 transition-transform"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    <span class="text-[10px] font-black uppercase tracking-[0.3em]">Exit Protocol</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Views Routing -->
          <div [ngClass]="isClientMode() ? 'w-full' : 'max-w-7xl mx-auto w-full p-6 md:p-12 lg:p-16'">
            <app-mall-view 
              *ngIf="activeTab() === 'mall'"
              [stats]="mallStats"
              [traffic]="trafficData"
              [suggestions]="mallSuggestions()"
              [loading]="loadingSuggestions()"
              (onRefresh)="fetchMallSuggestions()"
            ></app-mall-view>

            <app-shop-view 
              *ngIf="activeTab() === 'shop'"
            ></app-shop-view>

            <app-client-view *ngIf="activeTab() === 'client'"></app-client-view>
            <app-client-shops-view *ngIf="activeTab() === 'client-shops'"></app-client-shops-view>
            <app-client-services-view *ngIf="activeTab() === 'client-services'"></app-client-services-view>
            <app-client-events-view *ngIf="activeTab() === 'client-events'"></app-client-events-view>
            <app-client-wallet-view *ngIf="activeTab() === 'client-wallet'"></app-client-wallet-view>

            <div *ngIf="activeTab() === 'chat'" [ngClass]="isClientMode() ? 'p-6 md:p-16 max-w-5xl mx-auto' : ''">
              <app-chat
                [messages]="messages()"
                [isTyping]="isTyping()"
                (sendMessage)="handleSendMessage($event)"
                (clearChat)="messages.set([])"
              ></app-chat>
            </div>

            <div *ngIf="['flux', 'energy', 'sales', 'marketing'].includes(activeTab())" class="py-32 text-center animate-pulse">
               <div class="w-16 h-16 bg-lumina-tan/20 rounded-full mx-auto mb-6 flex items-center justify-center text-lumina-tan">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
               </div>
               <h2 class="text-2xl font-black text-lumina-olive font-outfit uppercase tracking-widest">Synchronizing MasterOne Data...</h2>
               <p class="text-lumina-olive/40 text-xs font-bold mt-4 uppercase tracking-[0.3em]">Connecting to MasterOne Cloud v3.1</p>
            </div>
          </div>
        </div>
      </main>

      <!-- Floating AI Button -->
      <button 
        *ngIf="isClientMode() && activeTab() !== 'chat'"
        (click)="activeTab.set('chat')"
        class="fixed bottom-10 right-10 w-16 h-16 bg-lumina-rust text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-lumina-olive transition-all z-[60] group border-4 border-white/20 backdrop-blur-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-12 transition-transform"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span class="absolute right-full mr-6 bg-lumina-dark text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap shadow-2xl border border-white/10 pointer-events-none">
          MasterOne AI Concierge
        </span>
      </button>
    </div>
  `
})
export class AppComponent {
  private gemini = inject(GeminiService);
  
  activeTab = signal('client');
  isLoggedIn = signal(false);
  showLogin = signal(false);
  isSidebarOpen = signal(false);
  
  loginRole = 'client'; 
  loginPassword = '';

  isTyping = signal(false);
  messages = signal<Message[]>([]);
  mallSuggestions = signal<any[]>([]);
  loadingSuggestions = signal(false);

  isClientMode() {
    const publicTabs = ['client', 'client-shops', 'client-services', 'client-events', 'client-wallet', 'chat'];
    const tab = this.activeTab();
    if (tab === 'chat' && this.isLoggedIn() && (this.loginRole === 'mall' || this.loginRole === 'shop')) {
      return false;
    }
    return publicTabs.includes(tab);
  }

  handleTabChange(tab: string) {
    if (tab.endsWith('-section')) {
      if (this.activeTab() !== 'client') this.activeTab.set('client');
      setTimeout(() => {
        const element = document.getElementById(tab);
        const container = document.getElementById('main-scroll-container');
        if (element && container) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    if ((tab === 'mall' || tab === 'shop') && !this.isLoggedIn()) {
      this.loginRole = tab === 'mall' ? 'mall' : 'shop';
      this.showLogin.set(true);
    } else {
      this.activeTab.set(tab);
      const container = document.getElementById('main-scroll-container');
      if (container) container.scrollTop = 0;
    }
    this.isSidebarOpen.set(false);
  }

  login() {
    if (this.loginRole === 'client') {
      this.isLoggedIn.set(true); 
      this.showLogin.set(false);
      this.activeTab.set('client-wallet');
      return;
    }
    if (this.loginPassword.trim()) {
      this.isLoggedIn.set(true);
      this.showLogin.set(false);
      this.activeTab.set(this.loginRole === 'mall' ? 'mall' : 'shop');
      this.loginPassword = ''; 
    }
  }

  cancelLogin() {
    this.showLogin.set(false);
  }

  logout() {
    this.isLoggedIn.set(false);
    this.activeTab.set('client');
    this.messages.set([]);
    this.isSidebarOpen.set(false);
  }

  mallStats = [
    { label: 'Visits Today', value: '14.8k', trend: 15.4, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
    { label: 'Active Boutiques', value: '184', trend: 0.5, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/></svg>' },
    { label: 'Grid Efficiency', value: '94%', trend: 2.1, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
    { label: 'Gross Revenue', value: '128.4k€', trend: 4.8, icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  ];

  trafficData = [
    { name: 'Mon', value: 55 }, { name: 'Tue', value: 48 }, { name: 'Wed', value: 72 },
    { name: 'Thu', value: 64 }, { name: 'Fri', value: 88 }, { name: 'Sat', value: 95 },
    { name: 'Sun', value: 42 },
  ];

  constructor() {
    effect(() => {
      if (this.activeTab() === 'mall' && this.mallSuggestions().length === 0) {
        this.fetchMallSuggestions();
      }
    });
  }

  async fetchMallSuggestions() {
    this.loadingSuggestions.set(true);
    try {
      const result = await this.gemini.getSmartSuggestions('Context: MasterOne shopping mall optimization Paris 2024.');
      this.mallSuggestions.set(result);
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingSuggestions.set(false);
    }
  }

  async handleSendMessage(content: string) {
    const userMsg: Message = { id: Math.random().toString(), role: 'user', content, timestamp: Date.now() };
    this.messages.update(prev => [...prev, userMsg]);
    this.isTyping.set(true);

    try {
      const response = await this.gemini.analyzeContent(`Question: ${content}`);
      const aiMsg: Message = { id: Math.random().toString(), role: 'assistant', content: response, timestamp: Date.now() };
      this.messages.update(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      this.isTyping.set(false);
    }
  }
}
