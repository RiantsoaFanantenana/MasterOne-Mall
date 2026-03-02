// pages/client/components/client-navbar.component.ts
import { Component, Output, EventEmitter, Input, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterDataService } from '../../services/master-data.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-client-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full flex flex-col sticky top-0 z-50">
      <!-- Top bar with login status -->
      <div class="bg-lumina-olive text-white/80 py-2.5 px-6 md:px-16 flex justify-between items-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest border-b border-white/5 overflow-hidden">
        <div class="flex gap-4 md:gap-6">
          <span class="flex items-center gap-2 truncate max-w-[150px] md:max-w-none">
            <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Renaissance Ave, Paris
          </span>
          <span class="hidden sm:flex items-center gap-2">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            contact&#64;masterone-mall.com
          </span>
        </div>
        <div class="flex items-center gap-4">
           <span *ngIf="isLoggedIn" class="text-lumina-mint flex items-center gap-1.5">
             <span class="w-1.5 h-1.5 rounded-full bg-lumina-mint animate-pulse"></span>
             {{ getUserDisplayName() }}
           </span>
        </div>
      </div>

      <!-- Main navigation -->
      <nav class="h-20 bg-white/95 backdrop-blur-xl shadow-sm border-b border-lumina-olive/5 px-6 md:px-16 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer group" (click)="navigateTo('client')">
          <div class="bg-lumina-rust p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-lg">
             <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <span class="text-xl md:text-2xl font-black font-outfit tracking-tighter text-lumina-olive uppercase">MasterOne</span>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden lg:flex items-center gap-8 xl:gap-10 h-full">
          <button 
            *ngFor="let nav of navItems"
            (click)="navigateTo(nav.id)" 
            [ngClass]="activeTab === nav.id ? 'text-lumina-rust border-b-2 border-lumina-rust' : 'text-lumina-olive/60 border-b-2 border-transparent'"
            class="text-[11px] font-black uppercase tracking-widest hover:text-lumina-rust transition-all pb-1 h-full flex items-center">
            {{ nav.label }}
            <span *ngIf="nav.id === 'client-wallet' && isLoggedIn" class="ml-2 w-1.5 h-1.5 rounded-full bg-lumina-rust animate-pulse"></span>
          </button>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-3 md:gap-4">
          <button (click)="navigateTo('chat')" [ngClass]="activeTab === 'chat' ? 'bg-lumina-rust text-white shadow-lg' : 'bg-lumina-olive/5 text-lumina-olive'" class="p-2.5 rounded-xl transition-all shadow-sm">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
          
          <ng-container *ngIf="!isLoggedIn">
            <button (click)="onLoginRequest.emit()" class="hidden sm:block px-6 py-3 bg-lumina-olive text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-lumina-rust transition-all shadow-md active:scale-95">
              Member Access
            </button>
          </ng-container>
          
          <ng-container *ngIf="isLoggedIn">
            <button (click)="logout.emit()" class="hidden sm:flex items-center gap-2 px-6 py-3 bg-lumina-rust text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-lumina-olive transition-all shadow-md active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Exit
            </button>
          </ng-container>
          
          <button (click)="toggleMobileMenu()" class="lg:hidden p-2.5 rounded-xl bg-lumina-olive/5 text-lumina-olive hover:bg-lumina-rust hover:text-white transition-all">
            <svg *ngIf="!isMenuOpen()" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            <svg *ngIf="isMenuOpen()" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <div *ngIf="isMenuOpen()" class="lg:hidden fixed inset-0 z-[100] bg-lumina-dark/95 backdrop-blur-md flex flex-col p-10 animate-fade-in">
        <div class="flex justify-between items-center mb-16">
          <div class="flex items-center gap-3">
             <div class="bg-lumina-rust p-1.5 rounded-lg shadow-lg">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
             </div>
             <span class="text-3xl font-black font-outfit tracking-tighter text-white uppercase">MasterOne</span>
          </div>
          <button (click)="isMenuOpen.set(false)" class="p-3 rounded-full bg-white/10 text-white transition-all">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        
        <div class="flex flex-col gap-8 flex-1">
          <button *ngFor="let nav of navItems" (click)="navigateTo(nav.id)" class="text-left py-4 border-b border-white/5 flex items-center justify-between group">
            <span [ngClass]="activeTab === nav.id ? 'text-lumina-rust' : 'text-white'" class="text-2xl font-black font-outfit uppercase tracking-tighter group-hover:translate-x-2 transition-transform">{{ nav.label }}</span>
            <svg class="w-6 h-6 text-white/20 group-hover:text-lumina-rust transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        <div class="mt-auto py-10 border-t border-white/10">
          <button *ngIf="!isLoggedIn" (click)="onLoginRequest.emit(); isMenuOpen.set(false)" class="w-full py-6 bg-white text-lumina-dark rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">
            Member Access
          </button>
          <button *ngIf="isLoggedIn" (click)="logout.emit(); isMenuOpen.set(false)" class="w-full py-6 bg-lumina-rust text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Exit Session
          </button>
        </div>
      </div>
    </div>
  `
})
export class ClientNavbarComponent {
  @Input() activeTab: string = 'client';
  @Input() isLoggedIn: boolean = false;
  @Output() tabChange = new EventEmitter<string>();
  @Output() onLoginRequest = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  
  private apiService = inject(ApiService);
  private router = inject(Router);
  public data = inject(MasterDataService);
  
  isMenuOpen = signal(false);

  navItems = [
    { id: 'client', label: 'Home' },
    { id: 'client-shops', label: 'Boutiques' },
    { id: 'client-events', label: 'Agenda' },
    { id: 'client-services', label: 'Services' },
    { id: 'client-wallet', label: 'Wallet' }
  ];

  getUserDisplayName(): string {
    const userEmail = this.apiService.getUserId(); // Ou autre méthode pour obtenir l'email
    return userEmail ? userEmail.split('@')[0] : 'VIP Member';
  }

  toggleMobileMenu() { 
    this.isMenuOpen.update(v => !v); 
  }
  
  navigateTo(tab: string) {
    if (tab === 'client-wallet' && !this.isLoggedIn) {
      this.onLoginRequest.emit();
    } else {
      this.tabChange.emit(tab);
    }
    this.isMenuOpen.set(false);
  }
}