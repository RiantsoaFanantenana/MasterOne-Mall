import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopItemComponent } from './shop-item.component';

@Component({
  selector: 'app-shop-carousel',
  standalone: true,
  imports: [CommonModule, ShopItemComponent],
  template: `
    <section class="bg-lumina-dark py-32 overflow-hidden reveal">
      <div class="px-8 md:px-16 mb-20 max-w-[1400px] mx-auto reveal reveal-left">
        <h2 class="text-4xl md:text-5xl font-black font-outfit text-white tracking-tighter mb-4">
          {{ title || 'Prestige Houses' }}
        </h2>
        <p class="text-lumina-tan font-black uppercase tracking-[0.4em] text-[10px]">
          {{ subtitle || 'Excellence gathered under one roof' }}
        </p>
      </div>
      
      <div class="flex gap-8 px-8 overflow-x-auto pb-12 no-scrollbar reveal reveal-right">
        <!-- Utilisez directement app-shop-item sans div wrapper -->
        <app-shop-item 
          *ngFor="let shop of items"
          class="flex-shrink-0 w-90"
          [coverPic]="shop.cover_pic"
          [logo]="shop.logo"
          [boxId]="shop.id_box"
          [name]="shop.shop_name"
          [description]="shop.description"
          [isLoggedIn]="isLoggedIn"
        ></app-shop-item>
      </div>
    </section>
  `
})
export class ShopCarouselComponent {
  @Input() items: any[] = [];
  @Input() isLoggedIn: boolean = false;
  @Input() title: string = '';
  @Input() subtitle: string = '';
}