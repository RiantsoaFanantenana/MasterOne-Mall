
import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeroComponent } from './components/hero.component.ts';
import { UniversComponent } from './components/univers.component.ts';
import { ShopCarouselComponent } from './components/shop-carousel.component.ts';
import { ServicesListComponent } from './components/services-list.component.ts';
import { GalleryComponent } from './components/gallery.component.ts';
import { EventsComponent } from './components/events.component.ts';
import { FooterComponent } from './components/footer.component.ts';

@Component({
  selector: 'app-client-view',
  standalone: true,
  imports: [
    CommonModule, 
    HeroComponent,
    UniversComponent,
    ShopCarouselComponent,
    ServicesListComponent,
    GalleryComponent,
    EventsComponent,
    FooterComponent
  ],
  template: `
    <div class="bg-white overflow-x-hidden">
      <app-hero id="home-section"></app-hero>
      
      <app-univers 
        id="dining-section"
        [items]="pillars"
      ></app-univers>
      
      <app-shop-carousel [items]="shopsCarousel"></app-shop-carousel>

      <app-services-list 
        id="services-section"
        [items]="featuredServices"
      ></app-services-list>
      
      <app-gallery></app-gallery>
      
      <app-events 
        id="events-section"
        [items]="events"
      ></app-events>
      
      <app-footer></app-footer>
    </div>
  `
})
export class ClientViewComponent implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit() {
    this.initRevealObserver();
  }

  private initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          // Permet de relancer l'animation lors du scroll back
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.1 });

    const reveals = this.el.nativeElement.querySelectorAll('.reveal');
    reveals.forEach((r: HTMLElement) => observer.observe(r));
  }

  pillars = [
    { category: 'High Fashion', title: 'Trend Studio', desc: 'Discover world-class luxury houses.', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&q=80&w=1200' },
    { category: 'Gastronomy', title: 'The Taste of Exception', desc: 'An unprecedented culinary epic.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200' },
    { category: 'Leisure & Culture', title: 'Escape in the City Heart', desc: 'Cinema and relaxing spas.', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200' },
  ];

  shopsCarousel = [
    { name: 'Aurea Couture', category: 'Ready-to-wear', floor: '1', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=800' },
    { name: 'Obsidian Jewelry', category: 'Jewelry', floor: '0', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800' },
    { name: 'Terra Moda', category: 'Accessories', floor: '2', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800' },
  ];

  featuredServices = [
    { title: 'Private Concierge', desc: 'Personalized welcome and bespoke assistance.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { title: 'Personal Shopper', desc: 'Benefit from our stylists expertise.', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' }
  ];

  events = [
    { date: 'Oct 24 • 18:30', tag: 'Fashion', title: 'Fall / Winter Gala', desc: 'Exclusive runway show.', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000' },
    { date: 'Oct 28 • 15:00', tag: 'Gastro', title: 'Chocolate Workshop', desc: 'Secrets of grand masters.', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000' }
  ];
}
