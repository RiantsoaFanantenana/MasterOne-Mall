
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Box } from '../../../types';

@Component({
  selector: '[app-box-row]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td class="px-12 py-8 text-lumina-olive font-outfit uppercase tracking-tighter text-2xl leading-none">{{ box.box_number }}</td>
    <td class="px-12 py-8 text-lumina-tan uppercase tracking-widest text-[10px] font-black">Level {{ box.floor }}</td>
    <td class="px-12 py-8 font-jakarta font-bold text-lumina-olive/70">{{ box.surface_area }} m²</td>
    <td class="px-12 py-8">
      <span [ngClass]="box.status === 'occupied' ? 'bg-lumina-rust text-white shadow-lumina-rust/20' : 'bg-lumina-mint text-white shadow-lumina-mint/20'" 
            class="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
        {{ box.status }}
      </span>
    </td>
    <td class="px-12 py-8 text-right">
      <button (click)="onDelete.emit(box.id)" class="text-lumina-rust/40 hover:text-lumina-rust font-black uppercase text-[10px] tracking-widest transition-colors">Retire Asset</button>
    </td>
  `
})
export class BoxRowComponent {
  @Input() box!: Box;
  @Output() onDelete = new EventEmitter<number>();
}
