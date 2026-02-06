
import { Component, Input, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopItemComponent } from './shop-item.component.ts';

export interface ShopType {
  id: number;
  type_name: string;
}

export interface ShopProfile {
  user_id: number;
  id_type: number;
  id_box: string;
  shop_name: string;
  logo: string;
  cover_pic: string;
  description: string;
}

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ShopItemComponent],
  template: `
    <section class="py-32 px-8 md:px-16 bg-white">
      <div class="max-w-[1400px] mx-auto">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div class="reveal active">
            <p class="text-lumina-rust font-black uppercase tracking-[0.4em] text-[10px] mb-4">Directory</p>
            <h2 class="text-5xl font-black font-outfit text-lumina-olive tracking-tighter leading-none">Explore Our Boutiques</h2>
          </div>
          
          <div class="w-full md:w-96 relative reveal active">
            <div class="space-y-3 w-full">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/60 ml-1">Search Protocol</label>
              <div class="relative">
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="onSearchChange($event)"
                  placeholder="Brand nomenclature..." 
                  class="w-full px-8 py-5 bg-lumina-cream border border-lumina-olive/10 rounded-3xl font-bold text-lumina-olive text-lg shadow-inner shadow-black/5 outline-none focus:border-lumina-rust transition-all"
                />
                <svg class="absolute right-6 top-1/2 -translate-y-1/2 text-lumina-olive/40" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Favorites Section (DYNAMIQUE) -->
        <div *ngIf="isLoggedIn && favoriteShops().length > 0" class="mb-32 bg-lumina-dark reveal active animate-in fade-in slide-in-from-top-10 duration-1000">
          <div class="flex items-center gap-6 mb-12">
            <div class="w-14 h-14 bg-lumina-rust rounded-[24px] flex items-center justify-center text-white shadow-3xl shadow-lumina-rust/20 rotate-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.04 3 5.5L12 21l7-7Z"/></svg>
            </div>
            <div>
              <h3 class="text-4xl font-black font-outfit text-lumina-olive tracking-tight uppercase leading-none mb-2">Private Selection</h3>
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-lumina-tan opacity-60">Your Curated Maison Excellence</p>
            </div>
          </div>
          
          <div class="flex gap-10 overflow-x-auto pb-12 px-2 -mx-2 no-scrollbar scroll-smooth">
            <div *ngFor="let shop of favoriteShops()" class="w-[380px] flex-shrink-0 transition-transform hover:scale-[1.02]">
               <app-shop-item 
                [coverPic]="shop.cover_pic"
                [logo]="shop.logo"
                [boxId]="shop.id_box"
                [name]="shop.shop_name"
                [description]="shop.description"
                [isLoggedIn]="isLoggedIn"
                [isFavorite]="true"
                (select)="onSelect.emit(shop)"
                (onFavoriteToggle)="onFavoriteToggle.emit(shop.user_id)"
              ></app-shop-item>
            </div>
          </div>
          <div class="h-[1px] bg-lumina-olive/5 w-full mt-10"></div>
        </div>

        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-4 mb-20 reveal active">
          <button 
            (click)="selectedTypeId.set(null)"
            [class.bg-lumina-olive]="selectedTypeId() === null"
            [class.text-white]="selectedTypeId() === null"
            class="px-10 py-4 rounded-full border border-lumina-olive/10 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:border-lumina-rust shadow-sm"
          > All Categories </button>
          <button 
            *ngFor="let type of shopTypes"
            (click)="selectedTypeId.set(type.id)"
            [class.bg-lumina-olive]="selectedTypeId() === type.id"
            [class.text-white]="selectedTypeId() === type.id"
            class="px-10 py-4 rounded-full border border-lumina-olive/10 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:border-lumina-rust shadow-sm"
          > {{ type.type_name }} </button>
        </div>

        <!-- Shop Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <app-shop-item 
            *ngFor="let shop of filteredShops(); let i = index"
            [coverPic]="shop.cover_pic"
            [logo]="shop.logo"
            [boxId]="shop.id_box"
            [name]="shop.shop_name"
            [description]="shop.description"
            [isLoggedIn]="isLoggedIn"
            [isFavorite]="isShopFavorite(shop.user_id)"
            [staggerClass]="'stagger-' + (i % 6 + 1)"
            (select)="onSelect.emit(shop)"
            (onFavoriteToggle)="onFavoriteToggle.emit(shop.user_id)"
          ></app-shop-item>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredShops().length === 0" class="py-40 text-center border-2 border-dashed border-lumina-olive/5 rounded-[60px]">
           <p class="text-lumina-olive/30 font-black uppercase tracking-[0.4em] text-sm">No boutique found in this directory</p>
        </div>
      </div>
    </section>
  `
})
export class ShopListComponent {
  @Input() shopTypes: ShopType[] = [];
  @Input() shops: ShopProfile[] = [];
  @Input() isLoggedIn: boolean = false;
  @Input() favorites: Set<number> = new Set();
  @Output() onSelect = new EventEmitter<ShopProfile>();
  @Output() onFavoriteToggle = new EventEmitter<number>();

  searchQuery = '';
  selectedTypeId = signal<number | null>(null);
  
  onSearchChange(val: string) {
    this.searchQuery = val;
  }

  isShopFavorite(userId: number) {
    return this.favorites.has(userId);
  }

  favoriteShops = computed(() => {
    return this.shops.filter(s => this.favorites.has(s.user_id));
  });

  filteredShops = computed(() => {
    let list = this.shops;
    if (this.selectedTypeId()) {
      list = list.filter(s => s.id_type === this.selectedTypeId());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(s => s.shop_name.toLowerCase().includes(q));
    }
    return list;
  });
}
