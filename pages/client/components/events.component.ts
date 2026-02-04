
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-32 px-8 md:px-16 bg-[#F5F5F4] reveal">
      <div class="max-w-[1400px] mx-auto">
        <div class="flex justify-between items-end mb-24 reveal reveal-left">
          <div>
            <h2 class="text-5xl md:text-6xl font-black font-outfit text-lumina-olive tracking-tighter leading-none">Your Agenda</h2>
            <p class="text-lumina-rust font-black uppercase tracking-widest text-[11px] mt-6 italic">Privileged moments & exclusivities</p>
          </div>
          <button class="text-[11px] font-black uppercase tracking-widest text-lumina-olive border-b-2 border-lumina-olive pb-2 hover:text-lumina-rust hover:border-lumina-rust transition-all">Full calendar</button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div *ngFor="let event of items; let i = index" 
               class="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-2xl group cursor-pointer hover:shadow-3xl transition-all duration-700 border border-black/5 reveal"
               [ngStyle]="{'transition-delay': (i * 0.2) + 's'}">
            <div class="w-full md:w-72 h-64 rounded-xl overflow-hidden shadow-2xl relative">
              <img [src]="event.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div class="absolute top-6 left-6 bg-lumina-rust px-5 py-2 rounded-full shadow-lg">
                <p class="text-[9px] font-black text-white uppercase tracking-widest">{{ event.tag }}</p>
              </div>
            </div>
            <div class="flex-1 py-4 pr-4">
              <div class="flex items-center gap-4 mb-6">
                <span class="w-10 h-[2px] bg-lumina-rust"></span>
                <p class="text-[11px] font-black text-lumina-rust uppercase tracking-[0.3em]">{{ event.date }}</p>
              </div>
              <h4 class="text-3xl font-black text-lumina-olive leading-tight mb-6 group-hover:text-lumina-rust transition-colors font-outfit">{{ event.title }}</h4>
              <p class="text-[13px] text-lumina-olive/60 leading-relaxed line-clamp-3 mb-10 font-medium">{{ event.desc }}</p>
              <button class="flex items-center gap-4 text-[11px] font-black uppercase text-lumina-olive group-hover:translate-x-4 transition-transform group-hover:text-lumina-rust">
                Book Experience
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class EventsComponent {
  @Input() items: any[] = [];
}
