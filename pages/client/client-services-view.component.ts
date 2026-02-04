
import { Component, AfterViewInit, ElementRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer.component.ts';
import { ScheduleItemComponent } from './components/schedule-item.component.ts';

interface OpeningHour { id: number; day: string; start_time: string; end_time: string; }
interface ExceptionalOpening { id: number; date: string; start_time: string; end_time: string; }

@Component({
  selector: 'app-client-services-view',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, ScheduleItemComponent],
  template: `
    <div class="bg-white min-h-screen flex flex-col motion-slide-in">
      <main class="flex-1">
        <section class="relative py-24 bg-lumina-olive text-white overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" class="w-full h-full object-cover" />
          </div>
          <div class="relative z-10 px-8 md:px-16 max-w-[1400px] mx-auto text-center reveal-header">
            <h2 class="text-lumina-tan font-black uppercase tracking-[0.5em] text-[10px] mb-6">Concierge & Opening Hours</h2>
            <h1 class="text-5xl md:text-7xl font-black font-outfit tracking-tighter mb-8">MasterOne Service</h1>
            <p class="text-lg text-white/70 max-w-2xl mx-auto font-medium">MasterOne welcomes you in a setting of serenity. Find our opening hours and join our prestigious ecosystem.</p>
          </div>
        </section>

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
  private el = inject(ElementRef);
  submitted = signal(false);
  requestMail = '';
  requestDesc = '';
  openingHours: OpeningHour[] = [
    { id: 1, day: 'Mon - Wed', start_time: '10:00', end_time: '21:00' },
    { id: 2, day: 'Thu - Sat', start_time: '10:00', end_time: '22:00' },
    { id: 3, day: 'Sunday', start_time: '10:00', end_time: '20:00' }
  ];
  exceptionalHours: ExceptionalOpening[] = [
    { id: 1, date: 'National Holidays', start_time: '10:00', end_time: '19:00' }
  ];
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
