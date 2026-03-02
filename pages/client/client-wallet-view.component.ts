
import { Component, AfterViewInit, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer.component';
import { CouponItemComponent } from './components/coupon-item.component';

interface Coupon {
  id: string;
  create_at: string;
  start_date: string;
  end_date: string;
  description: string;
}

@Component({
  selector: 'app-client-wallet-view',
  standalone: true,
  imports: [CommonModule, FooterComponent, CouponItemComponent],
  template: `
    <div class="bg-lumina-cream min-h-screen flex flex-col motion-slide-in">
      <main class="flex-1">
        <!-- Hero Section -->
        <section class="bg-lumina-olive py-24 text-white overflow-hidden relative">
          <div class="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
             <svg class="w-[800px] h-[800px] animate-spin-slow" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="1" stroke-dasharray="2 10"/></svg>
          </div>
          <div class="px-8 md:px-16 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
            <div class="max-w-2xl text-center md:text-left reveal-header">
              <h2 class="text-lumina-tan font-black uppercase tracking-[0.5em] text-[10px] mb-6">Member Dashboard</h2>
              <h1 class="text-5xl md:text-7xl font-black font-outfit tracking-tighter mb-8 leading-none">Your Lumina Wallet</h1>
              <p class="text-white/70 text-lg font-medium leading-relaxed">Centralized rewards, unique experiences, and exclusive challenges. Your journey at Lumina starts here.</p>
            </div>
            <div class="bg-white/10 backdrop-blur-xl p-10 rounded-[40px] border border-white/20 shadow-2xl flex flex-col items-center reveal motion-item">
              <div class="w-16 h-16 bg-lumina-rust rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              <span class="text-[10px] font-black uppercase tracking-[0.3em] text-lumina-tan mb-2">Total Coupons</span>
              <span class="text-7xl font-black font-outfit">{{ coupons().length }}</span>
              <button class="mt-8 px-8 py-3 bg-lumina-rust text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all">Redeem All</button>
            </div>
          </div>
        </section>

        <!-- Main Content Grid -->
        <div class="px-8 md:px-16 max-w-[1400px] mx-auto py-32 grid grid-cols-1 lg:grid-cols-3 gap-24">
          
          <!-- Coupons Section -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-4 mb-16 reveal-header">
              <span class="w-12 h-[2px] bg-lumina-rust"></span>
              <h2 class="text-3xl font-black font-outfit text-lumina-olive uppercase tracking-tight">Active Coupons</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <app-coupon-item 
                *ngFor="let coupon of coupons(); let i = index"
                [id]="coupon.id"
                [description]="coupon.description"
                [endDate]="coupon.end_date"
                [createAt]="coupon.create_at"
                [staggerClass]="'stagger-' + (i % 6 + 1)"
              ></app-coupon-item>

              <div *ngIf="coupons().length === 0" class="col-span-2 py-24 text-center border-2 border-dashed border-lumina-olive/10 rounded-[40px] reveal motion-item">
                <p class="text-lumina-olive/30 font-black uppercase tracking-[0.3em]">No coupons found. Play to win!</p>
              </div>
            </div>
          </div>

          <!-- Gamification Section -->
          <div class="space-y-24">
            <!-- Wheel of Fortune -->
            <div class="reveal-container">
              <div class="flex items-center gap-4 mb-10 reveal-header">
                <span class="w-8 h-[2px] bg-lumina-rust"></span>
                <h3 class="text-2xl font-black font-outfit text-lumina-olive uppercase tracking-tight">Daily Wheel</h3>
              </div>
              
              <div class="bg-white p-10 rounded-[40px] shadow-xl text-center flex flex-col items-center overflow-hidden reveal motion-item">
                <div class="relative w-64 h-64 mb-10">
                  <!-- The Wheel -->
                  <div class="w-full h-full rounded-full border-[10px] border-lumina-olive relative transition-transform duration-[4000ms] cubic-bezier(0.1, 1, 0.1, 1)"
                       [style.transform]="'rotate(' + wheelRotation + 'deg)'">
                    <div class="absolute inset-0 rounded-full overflow-hidden">
                      <div *ngFor="let seg of wheelSegments; let i = index" 
                           class="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
                           [style.transform]="'rotate(' + (i * 45) + 'deg) skewY(-45deg)'"
                           [style.background]="i % 2 === 0 ? '#646E57' : '#8C4A33'">
                      </div>
                    </div>
                    <!-- Indicator dots -->
                    <div *ngFor="let dot of [0,1,2,3,4,5,6,7]" 
                         class="absolute w-2 h-2 bg-white rounded-full z-20"
                         [style.left.%]="50 + 44 * Math.cos(dot * Math.PI / 4)"
                         [style.top.%]="50 + 44 * Math.sin(dot * Math.PI / 4)"></div>
                  </div>
                  <!-- The Pointer -->
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-10 bg-white shadow-lg z-30" style="clip-path: polygon(0 0, 100% 0, 50% 100%);"></div>
                  <!-- Spin Center -->
                  <div class="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full shadow-xl z-30 border-4 border-lumina-olive flex items-center justify-center">
                    <div class="w-2 h-2 bg-lumina-rust rounded-full"></div>
                  </div>
                </div>
                
                <button 
                  (click)="spinWheel()"
                  [disabled]="isSpinning"
                  class="w-full py-5 bg-lumina-olive text-white rounded-2xl font-black uppercase tracking-widest hover:bg-lumina-rust transition-all disabled:opacity-20 shadow-xl shadow-lumina-olive/20"
                >
                  {{ isSpinning ? 'SPINNING...' : 'SPIN TO WIN!' }}
                </button>
                <p class="mt-4 text-[9px] font-black text-lumina-tan uppercase tracking-widest">1 daily spin allowed</p>
              </div>
            </div>

            <!-- Treasure Hunt -->
            <div class="reveal-container">
              <div class="flex items-center gap-4 mb-10 reveal-header">
                <span class="w-8 h-[2px] bg-lumina-rust"></span>
                <h3 class="text-2xl font-black font-outfit text-lumina-olive uppercase tracking-tight">QR Treasure Hunt</h3>
              </div>
              <div class="bg-lumina-rust p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group reveal motion-item">
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                <div class="relative z-10">
                  <div class="w-12 h-12 bg-white rounded-xl mb-6 flex items-center justify-center text-lumina-rust">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/><path d="M12 12h.01"/></svg>
                  </div>
                  <h4 class="text-2xl font-black font-outfit mb-4">Find & Scan</h4>
                  <p class="text-white/70 text-sm font-medium leading-relaxed mb-8">Scan QR codes hidden throughout the mall corridors to collect rare coupons and digital badges.</p>
                  <button class="w-full py-4 bg-white text-lumina-rust rounded-2xl font-black uppercase tracking-widest hover:bg-lumina-olive hover:text-white transition-all">Open Scanner</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <app-footer></app-footer>
    </div>

    <style>
      .reveal-header {
        opacity: 0;
        transform: translateY(20px);
        transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .reveal-header.active {
        opacity: 1;
        transform: translateY(0);
      }
      .motion-item {
        transition: transform 4.5s cubic-bezier(0.15, 1, 0.3, 1), opacity 3.5s ease !important;
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 20s linear infinite;
      }
    </style>
  `
})
export class ClientWalletViewComponent implements AfterViewInit {
  private el = inject(ElementRef);
  Math = Math;

  coupons = signal<Coupon[]>([
    { id: 'LUM-8821-X', create_at: '2024-11-10', start_date: '2024-11-10', end_date: '2024-11-20', description: 'VIP Early Access - 10% Off Sitewide' },
    { id: 'GOLD-421-B', create_at: '2024-11-12', start_date: '2024-11-15', end_date: '2024-12-01', description: 'Exclusive Gift with Purchase at Horizon Luxe' }
  ]);

  wheelSegments = Array(8).fill(0);
  wheelRotation = 0;
  isSpinning = false;

  spinWheel() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    
    // Add extra rotations and a random final position
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const finalAngle = Math.floor(Math.random() * 360);
    this.wheelRotation += (extraSpins * 360) + finalAngle;

    setTimeout(() => {
      this.isSpinning = false;
      this.addWonCoupon();
    }, 4000);
  }

  addWonCoupon() {
    const rewards = [
      '20% Discount Storewide',
      'Free Coffee at Le Petit Café',
      'VIP Parking Upgrade',
      'Private Lounge Access (1h)',
      '15% Off Jewelry Collections'
    ];
    const newCoupon: Coupon = {
      id: 'WIN-' + Math.floor(Math.random() * 9999) + '-W',
      create_at: new Date().toISOString(),
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Wheel Prize: ' + rewards[Math.floor(Math.random() * rewards.length)]
    };
    this.coupons.update(prev => [newCoupon, ...prev]);
  }

  ngAfterViewInit() {
    this.initRevealObserver();
  }

  private initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          // Scrollback logic for all reveals in the wallet
          if (entry.target.classList.contains('reveal')) {
            entry.target.classList.remove('active');
          }
        }
      });
    }, { threshold: 0.1 });

    const reveals = this.el.nativeElement.querySelectorAll('.reveal, .reveal-header');
    reveals.forEach((r: HTMLElement) => observer.observe(r));
  }
}
