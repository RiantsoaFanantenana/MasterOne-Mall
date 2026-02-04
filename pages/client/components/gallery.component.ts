
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-32 reveal">
      <div class="px-8 md:px-16 mb-20 flex justify-between items-end max-w-[1400px] mx-auto reveal reveal-left">
        <div>
          <h2 class="text-5xl font-black font-outfit text-lumina-olive tracking-tighter">Lumina Moments</h2>
          <p class="text-lumina-tan font-black uppercase tracking-[0.4em] text-[10px] mt-4">Follow us &#64;LuminaMall_Official</p>
        </div>
        <button class="hidden md:block px-10 py-4 bg-lumina-olive text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-lumina-rust transition-all">Explore Instagram</button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 px-8 h-[900px] reveal">
        <div class="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-2xl relative group reveal">
          <img src="https://images.unsplash.com/photo-1542060770-9943f1675370?auto=format&fit=crop&q=80&w=1200" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        </div>
        <div class="rounded-2xl overflow-hidden shadow-2xl relative group reveal stagger-1">
          <img src="https://images.unsplash.com/photo-1481437156560-3201fb1ea57e?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        </div>
        <div class="rounded-2xl overflow-hidden shadow-2xl relative group reveal stagger-2">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        </div>
        <div class="col-span-2 rounded-2xl overflow-hidden shadow-2xl relative group reveal stagger-3">
          <img src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1200" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        </div>
      </div>
    </section>
  `
})
export class GalleryComponent {}
