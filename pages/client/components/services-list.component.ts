
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceItemComponent } from './service-item.component.ts';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, ServiceItemComponent],
  template: `
    <section class="py-32 px-8 md:px-16 max-w-[1400px] mx-auto">
      <div class="text-center mb-24 reveal reveal-header">
        <h2 class="text-5xl font-black font-outfit text-lumina-olive tracking-tighter mb-4">Augmented Experience</h2>
        <p class="text-lumina-rust font-black uppercase tracking-[0.5em] text-[10px]">Services designed for your absolute comfort</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <app-service-item 
          *ngFor="let s of items; let i = index"
          [title]="s.title"
          [description]="s.desc"
          [icon]="s.icon"
          [reverse]="i % 2 !== 0"
          [staggerClass]="'stagger-' + (i % 6 + 1)"
        ></app-service-item>
      </div>
    </section>
  `
})
export class ServicesListComponent {
  @Input() items: any[] = [];
}
