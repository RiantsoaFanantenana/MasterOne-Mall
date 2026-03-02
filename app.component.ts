import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './components/sidebar.component';
import { HeaderComponent } from './components/header.component';
import { ClientNavbarComponent } from './pages/client/client-navbar.component';
import { LoginModalComponent, UserRole } from './components/login-modal.component';
import { ApiService } from './services/api.service'; // Changé de AuthService à ApiService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    ClientNavbarComponent,
    LoginModalComponent
  ],
  template: `
    <div [ngClass]="isClientMode() ? 'flex flex-col' : 'flex flex-row'" class="h-screen w-full overflow-hidden bg-lumina-cream font-jakarta">
      
      <app-sidebar 
        *ngIf="!isClientMode() && apiService.isAuthenticated()"
        [mode]="getSidebarMode()"
        [activeTab]="currentTab"
        [isOpen]="isSidebarOpen()"
        (tabChange)="navigateTo($event)"
        (logout)="logout()"
        (close)="isSidebarOpen.set(false)"
      ></app-sidebar>

      <app-client-navbar 
        *ngIf="isClientMode()"
        [activeTab]="currentTab"
        [isLoggedIn]="apiService.isAuthenticated()"
        (tabChange)="navigateTo($event)"
        (onLoginRequest)="showLogin.set(true)"
        (logout)="logout()"
      ></app-client-navbar>

      <main class="flex-1 flex flex-col min-h-0 bg-lumina-cream relative overflow-hidden">
        <app-header 
          *ngIf="!isClientMode() && apiService.isAuthenticated()"
          (toggleSidebar)="isSidebarOpen.set(!isSidebarOpen())"
        ></app-header>

        <div class="flex-1 overflow-y-auto custom-main-scroll relative h-full" id="main-scroll-container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>

    <!-- Login Modal -->
    <app-login-modal
      [isVisible]="showLogin()"
      (login)="onLogin($event)"
      (close)="showLogin.set(false)"
    ></app-login-modal>
  `
})
export class AppComponent {
  private router = inject(Router);
  apiService = inject(ApiService); // Changé de AuthService à ApiService
  
  isSidebarOpen = signal(false);
  showLogin = signal(false);
  
  get currentTab(): string {
    const url = this.router.url;
    if (url.startsWith('/admin')) {
      const module = url.split('/')[2] || 'dashboard';
      return module === 'dashboard' ? 'mall' : module;
    }
    if (url.startsWith('/shop')) {
      const module = url.split('/')[2] || 'dashboard';
      if (module === 'dashboard') return 'shop';
      return `shop-${module}`;
    }
    if (url.startsWith('/client')) {
      const module = url.split('/')[2] || '';
      if (module === 'shops') return 'client-shops';
      if (module === 'services') return 'client-services';
      if (module === 'events') return 'client-events';
      if (module === 'wallet') return 'client-wallet';
      return 'client';
    }
    if (url.startsWith('/chat')) return 'chat';
    return 'client';
  }

  getSidebarMode(): 'admin' | 'shop' {
    const role = this.apiService.getUserRole();
    return role === 'admin' ? 'admin' : 'shop';
  }

  isClientMode(): boolean {
    return !this.router.url.startsWith('/admin') && 
           !this.router.url.startsWith('/shop');
  }

  navigateTo(tab: string) {
    const routes: Record<string, string> = {
      // Client routes
      'client': '/client',
      'client-shops': '/client/shops',
      'client-services': '/client/services',
      'client-events': '/client/events',
      'client-wallet': '/client/wallet',
      
      // Admin routes
      'mall': '/admin/dashboard',
      'infrastructure': '/admin/infrastructure',
      'finance': '/admin/finance',
      'contracts': '/admin/contracts',
      'maintenance': '/admin/maintenance',
      
      // Shop routes
      'shop': '/shop/dashboard',
      'shop-profile': '/shop/profile',
      'shop-events': '/shop/events',
      'shop-discounts': '/shop/discounts',
      'shop-coupons': '/shop/coupons',
      'shop-maintenance': '/shop/maintenance',
      'shop-subscription': '/shop/subscription',
      'shop-chat': '/shop/chat',
      
      // Shared
      'ai-assistant': '/admin/ai-assistant',
      'chat': '/chat'
    };

    this.router.navigateByUrl(routes[tab] || '/client');
  }

  onLogin(event: { role: UserRole, username: string, email: string }) {
    console.log('Login event:', event);
    
    // Note: Le login est déjà géré par ApiService dans le modal
    // On ferme juste le modal et on redirige
    this.showLogin.set(false);
    
    // Rediriger selon le rôle
    if (event.role === 'admin') {
      this.router.navigateByUrl('/admin/dashboard');
    } else if (event.role === 'shop') {
      this.router.navigateByUrl('/shop/dashboard');
    } else {
      this.router.navigateByUrl('/client/wallet');
    }
  }

  logout() {
    this.apiService.logout(); // Utilise ApiService pour la déconnexion
    this.router.navigateByUrl('/client');
  }
}