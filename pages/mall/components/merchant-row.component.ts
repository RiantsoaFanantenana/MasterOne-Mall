
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopProfile } from '../../../types';

@Component({
  selector: '[app-merchant-row]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td class="px-12 py-10 flex items-center gap-10">
      <div class="w-20 h-20 rounded-[32px] bg-lumina-cream p-4 shadow-inner overflow-hidden flex items-center justify-center border border-lumina-olive/5">
        <img [src]="merchant.logo" class="max-w-full max-h-full object-contain">
      </div>
      <div>
        <span class="text-lumina-olive font-outfit uppercase tracking-tighter text-3xl block leading-none mb-1">{{ merchant.shop_name }}</span>
        <span class="text-[9px] font-black text-lumina-tan uppercase tracking-widest">Reference House</span>
      </div>
    </td>
    <td class="px-12 py-10 uppercase tracking-[0.3em] text-[10px] text-lumina-olive font-black">Box {{ merchant.id_box }}</td>
    <td class="px-12 py-10">
      <span [ngClass]="merchant.subscription_status === 'premium' ? 'text-lumina-rust border-lumina-rust shadow-lumina-rust/10' : 'text-lumina-olive border-lumina-olive shadow-lumina-olive/10'" 
            class="text-[10px] font-black uppercase tracking-widest px-8 py-3 border rounded-full shadow-xl">
        {{ merchant.subscription_status }} Plan
      </span>
    </td>
    <td class="px-12 py-10 text-right">
      <button class="text-lumina-olive hover:text-lumina-rust font-black uppercase text-[11px] tracking-widest transition-colors">Manage Credentials</button>
    </td>
  `
})
export class MerchantRowComponent {
  @Input() merchant!: ShopProfile;
}
