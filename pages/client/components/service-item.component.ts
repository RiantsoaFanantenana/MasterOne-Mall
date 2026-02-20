
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe.ts';

@Component({
  selector: 'app-service-item',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="flex flex-col md:flex-row gap-10 items-center bg-lumina-cream p-10 rounded-2xl border border-lumina-olive/5 group hover:bg-white hover:shadow-2xl transition-all duration-1000 reveal motion-item"
         [ngClass]="[staggerClass, reverse ? 'md:flex-row-reverse text-right' : '']">
      
      <div class="w-full md:w-56 h-56 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center p-8 group-hover:rotate-6 transition-transform duration-700">
         <div [innerHTML]="icon | safeHtml" class="w-full h-full text-lumina-rust group-hover:scale-110 transition-transform duration-700"></div>
      </div>

      <div class="flex-1">
        <h3 class="text-2xl font-black font-outfit text-lumina-olive mb-4">{{ title }}</h3>
        <p class="text-xs text-lumina-olive/60 leading-relaxed font-medium mb-8">{{ description }}</p>
        <button class="text-[10px] font-black uppercase tracking-widest text-lumina-rust border-b-2 border-transparent hover:border-lumina-rust pb-1 transition-all">Learn more</button>
      </div>
    </div>

    <style>
      .motion-item {
        transition: transform 4.5s cubic-bezier(0.15, 1, 0.3, 1), opacity 3.5s ease !important;
      }
    </style>
  `
})
export class ServiceItemComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon!: string;
  @Input() reverse: boolean = false;
  @Input() staggerClass: string = '';
}
