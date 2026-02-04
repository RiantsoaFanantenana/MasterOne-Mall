
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-slide-in space-y-10">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xs font-black uppercase tracking-[0.3em] text-lumina-mint mb-2">Merchant Space</h2>
          <h1 class="text-4xl font-black text-lumina-olive font-outfit">My Shop: Horizon Luxe</h1>
        </div>
        <div class="bg-white p-4 rounded-xl border border-lumina-olive/5 shadow-sm">
          <p class="text-[10px] font-black uppercase text-lumina-tan">Shop Status</p>
          <p class="text-lumina-mint font-bold">Open • High Traffic</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-xl border border-lumina-olive/5 shadow-sm hover:shadow-md transition-shadow">
          <p class="text-[10px] font-black uppercase text-lumina-tan mb-2">Daily Sales</p>
          <h3 class="text-3xl font-black text-lumina-olive">4,250 €</h3>
          <p class="text-xs text-lumina-mint mt-2 font-bold">+18% vs yesterday</p>
        </div>
        <div class="bg-white p-6 rounded-xl border border-lumina-olive/5 shadow-sm hover:shadow-md transition-shadow">
          <p class="text-[10px] font-black uppercase text-lumina-tan mb-2">Average Basket</p>
          <h3 class="text-3xl font-black text-lumina-olive">112 €</h3>
          <p class="text-xs text-lumina-rust mt-2 font-bold">-2% vs yesterday</p>
        </div>
        <div class="bg-white p-6 rounded-xl border border-lumina-olive/5 shadow-sm hover:shadow-md transition-shadow">
          <p class="text-[10px] font-black uppercase text-lumina-tan mb-2">Conversion Rate</p>
          <h3 class="text-3xl font-black text-lumina-olive">3.4%</h3>
          <p class="text-xs text-lumina-mint mt-2 font-bold">+0.5% vs yesterday</p>
        </div>
      </div>

      <div class="bg-lumina-olive p-8 rounded-xl text-white shadow-2xl">
        <div class="flex items-start gap-6">
          <div class="bg-lumina-rust p-4 rounded-xl shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div>
            <h3 class="text-2xl font-black mb-2">Retail AI Advice</h3>
            <p class="text-lumina-sage max-w-2xl leading-relaxed text-sm font-medium">
              Traffic in the North corridor will increase by 25% in the next hour. Consider showcasing your accessories in the window to maximize impulse buys.
            </p>
            <button class="mt-6 px-8 py-3 bg-lumina-sage text-lumina-olive rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">Apply Strategy</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ShopViewComponent {}
