
import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataService } from '../../services/master-data.service.ts';
import { ShopProfileFormComponent } from './components/shop-profile-form.component.ts';
import { ShopEventsCrudComponent } from './components/shop-events-crud.component.ts';
import { ShopDiscountsCrudComponent } from './components/shop-discounts-crud.component.ts';
import { ShopCouponsCrudComponent } from './components/shop-coupons-crud.component.ts';
import { ShopTicketsManagerComponent } from './components/shop-tickets-manager.component.ts';
import { ShopChatRoomComponent } from './components/shop-chat-room.component.ts';

@Component({
  selector: 'app-shop-view',
  standalone: true,
  imports: [
    CommonModule, 
    ShopProfileFormComponent, 
    ShopEventsCrudComponent, 
    ShopDiscountsCrudComponent, 
    ShopCouponsCrudComponent,
    ShopTicketsManagerComponent,
    ShopChatRoomComponent
  ],
  template: `
    <div class="space-y-10 animate-in fade-in duration-700">
      <!-- Header Area -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-lumina-olive/5 pb-10">
        <div>
          <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-lumina-mint mb-2">Merchant Control v4.0</h2>
          <h1 class="text-4xl font-black text-lumina-olive font-outfit uppercase tracking-tighter leading-none">
            {{ myProfile()?.shop_name }} <span class="text-lumina-tan/40 ml-2 font-jakarta text-2xl">#{{ myProfile()?.id_box }}</span>
          </h1>
        </div>
      </div>

      <!-- Module Orchestration -->
      <div [ngSwitch]="activeModule">
        
        <div *ngSwitchCase="'shop'" class="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-5">
           <div class="bg-white p-10 rounded-[40px] border border-lumina-olive/5 shadow-sm">
             <p class="text-[9px] font-black uppercase tracking-widest text-lumina-tan mb-2">Daily Traffic</p>
             <h3 class="text-4xl font-black text-lumina-olive">1.2k</h3>
             <p class="text-[10px] font-bold text-lumina-mint mt-2 uppercase">↑ 5.2% vs yesterday</p>
           </div>
           <div class="bg-white p-10 rounded-[40px] border border-lumina-olive/5 shadow-sm">
             <p class="text-[9px] font-black uppercase tracking-widest text-lumina-tan mb-2">Active Coupons</p>
             <h3 class="text-4xl font-black text-lumina-olive">{{ myCoupons().length }}</h3>
             <p class="text-[10px] font-bold text-lumina-rust mt-2 uppercase">2 Redemptions today</p>
           </div>
           <div class="bg-white p-10 rounded-[40px] border border-lumina-olive/5 shadow-sm">
             <p class="text-[9px] font-black uppercase tracking-widest text-lumina-tan mb-2">Pending Tickets</p>
             <h3 class="text-4xl font-black text-lumina-olive">{{ myTickets().length }}</h3>
             <p class="text-[10px] font-bold text-lumina-tan mt-2 uppercase">Tech units dispatched</p>
           </div>
           <div class="bg-lumina-rust p-10 rounded-[40px] text-white shadow-xl">
             <p class="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Plan Status</p>
             <h3 class="text-xl font-black uppercase leading-tight">Premium House Partner</h3>
           </div>
        </div>

        <app-shop-profile-form *ngSwitchCase="'shop-profile'" 
          [profile]="myProfile()!" 
          (onSave)="data.updateProfile($event)">
        </app-shop-profile-form>

        <app-shop-events-crud *ngSwitchCase="'shop-events'" 
          [events]="myEvents()" 
          (onAdd)="data.addEvent($event)" 
          (onDelete)="data.deleteEvent($event)">
        </app-shop-events-crud>

        <app-shop-discounts-crud *ngSwitchCase="'shop-discounts'" 
          [discounts]="myDiscounts()" 
          [coupons]="myCoupons()"
          (onAdd)="data.addDiscount($event)" 
          (onDelete)="data.deleteDiscount($event)">
        </app-shop-discounts-crud>

        <app-shop-coupons-crud *ngSwitchCase="'shop-coupons'"
          [coupons]="myCoupons()"
          (onAdd)="data.addCoupon($event)"
          (onDelete)="data.deleteCoupon($event)"
          (onUse)="data.useCoupon($event)">
        </app-shop-coupons-crud>

        <app-shop-tickets-manager *ngSwitchCase="'shop-maintenance'" 
          [tickets]="myTickets()" 
          (onAdd)="data.addTicket($event)">
        </app-shop-tickets-manager>

        <app-shop-chat-room *ngSwitchCase="'shop-chat'"
          [conversations]="myConversations()"
          (onReply)="data.sendChatResponse($event.convId, $event.content)">
        </app-shop-chat-room>

        <div *ngSwitchCase="'shop-subscription'" class="bg-white p-16 rounded-[60px] border border-lumina-olive/10 shadow-sm animate-in fade-in">
           <h3 class="text-4xl font-black text-lumina-olive font-outfit uppercase tracking-tighter mb-10">Membership Architecture</h3>
           <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
             <div class="p-12 bg-lumina-cream rounded-[40px] border border-lumina-olive/5">
               <p class="text-xs font-black uppercase text-lumina-tan tracking-widest mb-2">Current Tier</p>
               <h4 class="text-4xl font-black text-lumina-rust mb-10">Premium House</h4>
               <ul class="space-y-6 mb-12">
                 <li class="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-lumina-olive/60"><div class="w-2.5 h-2.5 rounded-full bg-lumina-mint"></div> AI Strategic Recommendations</li>
                 <li class="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-lumina-olive/60"><div class="w-2.5 h-2.5 rounded-full bg-lumina-mint"></div> Priority Push Protocol</li>
                 <li class="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-lumina-olive/60"><div class="w-2.5 h-2.5 rounded-full bg-lumina-mint"></div> Featured Discovery Highlight</li>
               </ul>
               <button class="w-full py-6 bg-lumina-olive text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl">Upgrade to Elite Partnership</button>
             </div>
             
             <div class="flex flex-col justify-center">
                <div class="bg-lumina-olive/5 p-10 rounded-[40px] border border-dashed border-lumina-olive/20 text-center">
                   <p class="text-xs font-bold text-lumina-olive/60 leading-relaxed italic">"Your house currently ranks in the top 10% of visitor engagement. Deploying a VIP Gala event could increase conversions by an additional 14% this quarter."</p>
                   <p class="mt-6 text-[9px] font-black uppercase tracking-widest text-lumina-rust">— MasterOne Intelligence</p>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  `
})
export class ShopViewComponent {
  data = inject(MasterDataService);
  @Input() activeModule: string = 'shop';

  myProfile = computed(() => this.data.shopProfiles().find(p => p.user_id === this.data.activeShopId()));
  myEvents = computed(() => this.data.events().filter(e => e.shop_id === this.data.activeShopId()));
  myDiscounts = computed(() => this.data.discounts().filter(d => d.shop_id === this.data.activeShopId()));
  myCoupons = computed(() => this.data.coupons());
  myTickets = computed(() => this.data.boxTickets().filter(t => t.shop_id === this.data.activeShopId()));
  myConversations = computed(() => this.data.conversations().filter(c => c.shop_id === this.data.activeShopId()));
}
