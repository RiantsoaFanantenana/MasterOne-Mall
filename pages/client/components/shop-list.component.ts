
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
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div class="reveal reveal-header">
            <p class="text-lumina-rust font-black uppercase tracking-[0.4em] text-[10px] mb-4">Directory</p>
            <h2 class="text-5xl font-black font-outfit text-lumina-olive tracking-tighter leading-none">Explore Our Boutiques</h2>
          </div>
          
          <div class="w-full md:w-96 relative reveal reveal-header">
            <input 
              type="text" 
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search for a brand..." 
              class="w-full bg-lumina-cream border-b-2 border-lumina-olive/20 py-4 px-2 outline-none focus:border-lumina-rust transition-all text-lumina-olive font-bold text-sm placeholder:text-lumina-olive/30"
            />
            <svg class="absolute right-4 top-1/2 -translate-y-1/2 text-lumina-olive/40" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-4 mb-16 reveal reveal-header">
          <button 
            (click)="selectedTypeId.set(null)"
            [class.bg-lumina-olive]="selectedTypeId() === null"
            [class.text-white]="selectedTypeId() === null"
            class="px-8 py-3 rounded-full border border-lumina-olive/10 text-[10px] font-black uppercase tracking-widest transition-all hover:border-lumina-rust"
          > All </button>
          <button 
            *ngFor="let type of shopTypes"
            (click)="selectedTypeId.set(type.id)"
            [class.bg-lumina-olive]="selectedTypeId() === type.id"
            [class.text-white]="selectedTypeId() === type.id"
            class="px-8 py-3 rounded-full border border-lumina-olive/10 text-[10px] font-black uppercase tracking-widest transition-all hover:border-lumina-rust"
          > {{ type.type_name }} </button>
        </div>

        <!-- Shop Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <app-shop-item 
            *ngFor="let shop of filteredShops(); let i = index"
            [coverPic]="shop.cover_pic"
            [logo]="shop.logo"
            [boxId]="shop.id_box"
            [name]="shop.shop_name"
            [description]="shop.description"
            [staggerClass]="'stagger-' + (i % 6 + 1)"
            (select)="onSelect.emit(shop)"
          ></app-shop-item>
        </div>

        <!-- No Results -->
        <div *ngIf="filteredShops().length === 0" class="py-32 text-center text-lumina-olive/40 font-black uppercase tracking-widest">
           No boutique found for this selection
        </div>
      </div>
    </section>
  `
})
export class ShopListComponent {
  @Input() shopTypes: ShopType[] = [];
  @Input() shops: ShopProfile[] = [];
  @Output() onSelect = new EventEmitter<ShopProfile>();

  searchQuery = '';
  selectedTypeId = signal<number | null>(null);
  
  onSearchChange(val: string) {
    this.searchQuery = val;
  }

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
