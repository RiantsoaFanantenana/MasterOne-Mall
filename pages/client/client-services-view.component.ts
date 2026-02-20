
import { Component, AfterViewInit, ElementRef, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer.component';
import { ScheduleItemComponent } from './components/schedule-item.component';
import { ThreeDPlanComponent } from '../mall/components/three-d-plan.component';
import { MasterDataService } from '../../services/master-data.service';

interface OpeningHour { id: number; day: string; start_time: string; end_time: string; }
interface ExceptionalOpening { id: number; date: string; start_time: string; end_time: string; }

@Component({
  selector: 'app-client-services-view',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, ScheduleItemComponent, ThreeDPlanComponent],
  template: `
    <div class="bg-white min-h-screen flex flex-col motion-slide-in">
      <main class="flex-1">
        <!-- HEADER -->
        <section class="relative py-24 bg-lumina-olive text-white overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" class="w-full h-full object-cover" />
          </div>
          <div class="relative z-10 px-8 md:px-16 max-w-[1400px] mx-auto text-center reveal-header">
            <h2 class="text-lumina-tan font-black uppercase tracking-[0.5em] text-[10px] mb-6">Concierge & Valet Protocol</h2>
            <h1 class="text-5xl md:text-7xl font-black font-outfit tracking-tighter mb-8">MasterOne Service</h1>
            <p class="text-lg text-white/70 max-w-2xl mx-auto font-medium italic">Exceptional support for a seamless Parisian journey.</p>
          </div>
        </section>

        <!-- PARKING & 3D PLAN SECTION -->
        <section class="py-32 bg-lumina-cream border-y border-lumina-olive/5">
          <div class="px-8 md:px-16 max-w-[1400px] mx-auto">
            <div class="flex flex-col lg:flex-row justify-between items-end mb-16 gap-10">
              <div class="max-w-2xl reveal reveal-left">
                <div class="flex items-center gap-4 mb-6">
                   <span class="w-12 h-[3px] bg-lumina-rust"></span>
                   <h3 class="text-sm font-black uppercase tracking-[0.6em] text-lumina-tan">Valet Protocol Alpha</h3>
                </div>
                <h2 class="text-5xl font-black font-outfit text-lumina-olive tracking-tighter leading-tight">Interactive Map & Smart Parking</h2>
                <p class="text-lumina-olive/60 mt-6 text-sm leading-relaxed">Navigate the atrium or locate your vehicle in our high-security parking. Register your spot ID below to enable tracking on the discovery engine.</p>
              </div>

              <div *ngIf="isLoggedIn" class="w-full lg:w-96 bg-white p-8 rounded-[40px] shadow-2xl border border-lumina-olive/5 reveal reveal-right">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-10 h-10 bg-lumina-rust rounded-2xl flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h10c.6 0 1.1-.2 1.5-.5.4.3.9.5 1.5.5Z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                  </div>
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] text-lumina-olive">Your Vehicle Location</span>
                </div>
                <div class="space-y-3">
                  <label class="text-[9px] font-black uppercase tracking-widest text-lumina-tan ml-1">Input Spot ID (e.g. PA12)</label>
                  <div class="flex gap-2">
                    <input 
                      type="text" 
                      [(ngModel)]="spotInput" 
                      placeholder="PA01"
                      class="flex-1 px-6 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-2xl font-bold text-lumina-olive outline-none focus:border-lumina-rust transition-all uppercase"
                    />
                    <button (click)="saveSpot()" class="px-6 py-4 bg-lumina-olive text-white rounded-2xl font-black text-[10px] uppercase hover:bg-lumina-rust transition-all">Track</button>
                  </div>
                </div>
                <div *ngIf="dataService.clientParkingSpot()" class="mt-6 flex items-center justify-between text-xs font-bold text-lumina-rust border-t border-lumina-olive/5 pt-4">
                  <span>Current: {{ dataService.clientParkingSpot() }}</span>
                  <button (click)="clearSpot()" class="opacity-40 hover:opacity-100 transition-opacity">Clear</button>
                </div>
              </div>
            </div>

            <div class="rounded-[80px] overflow-hidden shadow-3xl border border-lumina-olive/10 bg-white relative reveal">
              <app-three-d-plan 
                [floors]="dataService.mallFloors()"
                [shops]="allShops"
                [initialFloorIndex]="0"
                [selectedSpotId]="dataService.clientParkingSpot()"
              ></app-three-d-plan>
              
              <!-- LEGEND -->
              <div class="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md px-8 py-6 rounded-[32px] border border-lumina-olive/5 shadow-xl flex gap-10">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-lumina-rust"></div>
                  <span class="text-[9px] font-black uppercase tracking-widest text-lumina-olive">Your Spot</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-lumina-olive/10"></div>
                  <span class="text-[9px] font-black uppercase tracking-widest text-lumina-olive">Occupied</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-lumina-mint/40"></div>
                  <span class="text-[9px] font-black uppercase tracking-widest text-lumina-olive">Available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- REGULAR SCHEDULE SECTION -->
        <section class="py-32 px-8 md:px-16 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <div class="flex items-center gap-4 mb-12 reveal reveal-header">
              <span class="w-12 h-[2px] bg-lumina-rust"></span>
              <h3 class="text-3xl font-black font-outfit text-lumina-olive uppercase tracking-tight">Master Schedule</h3>
            </div>
            <div class="space-y-4">
              <app-schedule-item *ngFor="let h of openingHours; let i = index" [label]="h.day" [time]="h.start_time + ' — ' + h.end_time" variant="regular" [staggerClass]="'stagger-' + (i % 6 + 1)"></app-schedule-item>
            </div>
          </div>
          <div>
            <div class="flex items-center gap-4 mb-12 reveal reveal-header">
              <span class="w-12 h-[2px] bg-lumina-rust"></span>
              <h3 class="text-3xl font-black font-outfit text-lumina-olive uppercase tracking-tight">Exclusivities</h3>
            </div>
            <div class="space-y-4">
              <app-schedule-item *ngFor="let ex of exceptionalHours; let i = index" [label]="ex.date" [time]="ex.start_time + ' — ' + ex.end_time" variant="exceptional" [staggerClass]="'stagger-' + (i % 6 + 1)"></app-schedule-item>
              <div *ngIf="exceptionalHours.length === 0" class="py-12 text-center text-lumina-olive/30 font-black uppercase tracking-widest border-2 border-dashed border-lumina-olive/10 rounded-2xl reveal">No exceptions scheduled</div>
            </div>
          </div>
        </section>

        <!-- ONBOARDING SECTION -->
        <section class="py-32 bg-lumina-dark text-white overflow-hidden">
          <div class="px-8 md:px-16 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div class="reveal reveal-header">
              <h2 class="text-5xl font-black font-outfit tracking-tighter mb-8 leading-none">Become a MasterOne Partner</h2>
              <p class="text-white/60 mb-10 leading-relaxed font-medium">Join the inner circle of houses of excellence. MasterOne offers unparalleled visibility in the heart of Paris for brands redefining elegance and innovation.</p>
              <ul class="space-y-6 mb-12">
                <li class="flex items-center gap-4 group">
                  <div class="w-10 h-10 rounded-full bg-lumina-rust/20 flex items-center justify-center text-lumina-rust transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <span class="text-sm font-bold">Premium Visibility 15k+ daily visitors</span>
                </li>
                <li class="flex items-center gap-4 group">
                  <div class="w-10 h-10 rounded-full bg-lumina-rust/20 flex items-center justify-center text-lumina-rust transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <span class="text-sm font-bold">Digital Ecosystem with MasterOne AI</span>
                </li>
              </ul>
            </div>
            <div class="reveal reveal-header bg-white p-10 md:p-14 rounded-[30px] shadow-2xl">
              <div class="text-center mb-10"><h3 class="text-3xl font-black font-outfit text-lumina-olive mb-2">Integration Request</h3><p class="text-lumina-tan text-xs font-black uppercase tracking-widest">Join the MasterOne Journey</p></div>
              <div *ngIf="submitted()" class="py-12 text-center animate-in fade-in">
                <div class="w-20 h-20 bg-lumina-mint/20 text-lumina-mint rounded-full flex items-center justify-center mx-auto mb-6"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
                <h4 class="text-xl font-black text-lumina-olive mb-2">Request Sent</h4><p class="text-lumina-olive/60 text-sm font-medium">MasterOne services will review your profile.</p>
              </div>
              <form *ngIf="!submitted()" (ngSubmit)="handleRequestSubmit()" class="space-y-6">
                <div class="space-y-1.5"><label class="text-[10px] font-black uppercase tracking-widest text-lumina-olive/60 ml-4">Pro Email</label><input type="email" [(ngModel)]="requestMail" name="email" required placeholder="contact@your-brand.com" class="w-full px-6 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-2xl outline-none font-bold text-lumina-olive" /></div>
                <div class="space-y-1.5"><label class="text-[10px] font-black uppercase tracking-widest text-lumina-olive/60 ml-4">House Story</label><textarea [(ngModel)]="requestDesc" name="description" required rows="4" placeholder="Tell us about your universe..." class="w-full px-6 py-4 bg-lumina-cream border border-lumina-olive/10 rounded-2xl outline-none font-bold text-lumina-olive resize-none"></textarea></div>
                <button type="submit" [disabled]="!requestMail || !requestDesc" class="w-full py-5 bg-lumina-rust text-white rounded-2xl font-black uppercase tracking-widest hover:bg-lumina-olive shadow-xl transition-all">Send Application</button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <app-footer></app-footer>
    </div>
  `
})
export class ClientServicesViewComponent implements AfterViewInit {
  @Input() isLoggedIn: boolean = false;
  
  private el = inject(ElementRef);
  public dataService = inject(MasterDataService);
  
  submitted = signal(false);
  requestMail = '';
  requestDesc = '';
  spotInput = '';

  allShops = [
    { user_id: 10, id_type: 1, id_box: 'BOX-C1', shop_name: 'Elysian Garments', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EG', cover_pic: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200', description: 'The pinnacle of French luxury fashion. Every stitch tells a story of heritage and innovation.' },
    { user_id: 11, id_type: 2, id_box: 'BOX-B5', shop_name: 'Stellar Gems', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SG', cover_pic: 'https://images.unsplash.com/photo-1573408339311-259bfa032d31?auto=format&fit=crop&q=80&w=1200', description: 'Rare stones and bespoke jewelry design for those who appreciate true brilliance.' },
    { user_id: 12, id_type: 3, id_box: 'BOX-A2', shop_name: 'L\'Art du Chocolat', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AC', cover_pic: 'https://images.unsplash.com/photo-1548907040-4baa42d100c9?auto=format&fit=crop&q=80&w=1200', description: 'An odyssey of taste through cocoa beans selected from the world\'s most prestigious plantations.' },
    { user_id: 13, id_type: 4, id_box: 'BOX-A6', shop_name: 'Velvet Skin', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VS', cover_pic: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200', description: 'Exclusive beauty rituals and advanced skincare treatments in a sanctuary of peace.' }
  ];

  openingHours: OpeningHour[] = [
    { id: 1, day: 'Mon - Wed', start_time: '10:00', end_time: '21:00' },
    { id: 2, day: 'Thu - Sat', start_time: '10:00', end_time: '22:00' },
    { id: 3, day: 'Sunday', start_time: '10:00', end_time: '20:00' }
  ];
  
  exceptionalHours: ExceptionalOpening[] = [
    { id: 1, date: 'National Holidays', start_time: '10:00', end_time: '19:00' }
  ];

  saveSpot() {
    if (this.spotInput.trim()) {
      this.dataService.clientParkingSpot.set(this.spotInput.trim().toUpperCase());
      this.spotInput = '';
    }
  }

  clearSpot() {
    this.dataService.clientParkingSpot.set(null);
  }

  ngAfterViewInit() { this.initRevealObserver(); }
  
  private initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    const reveals = this.el.nativeElement.querySelectorAll('.reveal, .reveal-header');
    reveals.forEach((r: HTMLElement) => observer.observe(r));
  }
  
  handleRequestSubmit() { if (this.requestMail && this.requestDesc) { this.submitted.set(true); } }
}
