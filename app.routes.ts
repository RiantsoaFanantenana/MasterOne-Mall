// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full'
  },
  {
    path: 'client',
    loadComponent: () => import('./pages/client/client-view.component').then(m => m.ClientViewComponent)
  },
  {
    path: 'client/shops',
    loadComponent: () => import('./pages/client/client-shops-view.component').then(m => m.ClientShopsViewComponent)
  },
  {
    path: 'client/shop/:id',  // ← NOUVEAU : Détail d'une boutique
    loadComponent: () => import('./pages/client/client-shops-view.component').then(m => m.ClientShopsViewComponent)
  },
  {
    path: 'client/services',
    loadComponent: () => import('./pages/client/client-services-view.component').then(m => m.ClientServicesViewComponent)
  },
  {
    path: 'client/events',
    loadComponent: () => import('./pages/client/client-events-view.component').then(m => m.ClientEventsViewComponent)
  },
  {
    path: 'client/event/:id',  // ← NOUVEAU : Détail d'un événement
    loadComponent: () => import('./pages/client/client-events-view.component').then(m => m.ClientEventsViewComponent)
  },
  {
    path: 'client/wallet',
    loadComponent: () => import('./pages/client/client-wallet-view.component').then(m => m.ClientWalletViewComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat.component').then(m => m.ChatComponent)
  },

  // Admin routes
  {
    path: 'admin',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/mall/mall-view.component').then(m => m.MallViewComponent),
    data: { module: 'mall' }
  },
  {
    path: 'admin/infrastructure',
    loadComponent: () => import('./pages/mall/mall-view.component').then(m => m.MallViewComponent),
    data: { module: 'infrastructure' }
  },
  {
    path: 'admin/finance',
    loadComponent: () => import('./pages/mall/mall-view.component').then(m => m.MallViewComponent),
    data: { module: 'finance' }
  },
  {
    path: 'admin/contracts',
    loadComponent: () => import('./pages/mall/mall-view.component').then(m => m.MallViewComponent),
    data: { module: 'contracts' }
  },
  {
    path: 'admin/maintenance',
    loadComponent: () => import('./pages/mall/mall-view.component').then(m => m.MallViewComponent),
    data: { module: 'maintenance' }
  },
  {
    path: 'admin/ai-assistant',
    loadComponent: () => import('./components/chat.component').then(m => m.ChatComponent)
  },

  // Shop routes
  {
    path: 'shop',
    redirectTo: 'shop/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'shop/dashboard',
    loadComponent: () => import('./pages/shop/shop-view.component').then(m => m.ShopViewComponent),
    data: { module: 'shop' }
  },
  {
    path: 'shop/profile',
    loadComponent: () => import('./pages/shop/shop-view.component').then(m => m.ShopViewComponent),
    data: { module: 'shop-profile' }
  },
  {
    path: 'shop/events',
    loadComponent: () => import('./pages/shop/shop-view.component').then(m => m.ShopViewComponent),
    data: { module: 'shop-events' }
  },
  {
    path: 'shop/discounts',
    loadComponent: () => import('./pages/shop/shop-view.component').then(m => m.ShopViewComponent),
    data: { module: 'shop-discounts' }
  },
  {
    path: 'shop/coupons',
    loadComponent: () => import('./pages/shop/shop-view.component').then(m => m.ShopViewComponent),
    data: { module: 'shop-coupons' }
  },
  {
    path: 'shop/maintenance',
    loadComponent: () => import('./pages/shop/shop-view.component').then(m => m.ShopViewComponent),
    data: { module: 'shop-maintenance' }
  },
  {
    path: 'shop/subscription',
    loadComponent: () => import('./pages/shop/shop-view.component').then(m => m.ShopViewComponent),
    data: { module: 'shop-subscription' }
  },
  {
    path: 'shop/chat',
    loadComponent: () => import('./pages/shop/shop-view.component').then(m => m.ShopViewComponent),
    data: { module: 'shop-chat' }
  },
  {
    path: 'shop/ai-assistant',
    loadComponent: () => import('./components/chat.component').then(m => m.ChatComponent)
  },

  // Route fallback
  {
    path: '**',
    redirectTo: 'client'
  }
];