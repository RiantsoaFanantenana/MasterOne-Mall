import { Component, Input, signal, computed, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Point { x: number; y: number; }
interface Door { 
  id: string; 
  position: number; 
  width: number; 
  isDouble: boolean; 
  isOutward: boolean; 
  isLocked?: boolean;
}
interface Wall { 
  id: string; 
  p1: Point; 
  p2: Point; 
  thickness: number; 
  doors: Door[]; 
}
interface SpotGroup { 
  id: string; 
  prefix: string; 
  startIndex: number; 
  countPerSide: number; 
  p1: Point; 
  angle: number; 
  spotWidth: number; 
  spotDepth: number;
  aisleWidth: number;
  padding: boolean;
}
interface Room { 
  id: string; 
  points: Point[]; 
  category: string; 
  name: string; 
  spotGroups?: SpotGroup[]; 
}
interface Floor { 
  id: string; 
  name: string; 
  walls: Wall[]; 
  rooms: Room[]; 
}

@Component({
  selector: 'app-three-d-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div 
      class="relative w-full h-[750px] bg-lumina-cream overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing border border-lumina-olive/10 rounded-[60px] shadow-2xl"
      #container
      (mousedown)="onMouseDown($event)"
      (mousemove)="onMouseMove($event)"
      (mouseup)="onMouseUp()"
      (mouseleave)="onMouseUp()"
      (wheel)="onWheel($event)"
      [style.perspective]="getPerspective()"
      [style.perspective-origin]="getPerspectiveOrigin()">
      
      <!-- ARCHITECTURAL BACKGROUND -->
      <div class="absolute inset-0 bg-lumina-cream">
        <div class="absolute inset-0 opacity-[0.03]"
             style="background-image: radial-gradient(#646E57 1px, transparent 1px); background-size: 30px 30px;">
        </div>
        <!-- Vignette -->
        <div class="absolute inset-0 shadow-[inset_0_0_200px_rgba(45,51,37,0.05)] pointer-events-none"></div>
      </div>

      <!-- FLOOR NAVIGATOR (LUXURY Pill Switcher) -->
      <div class="absolute top-10 left-10 z-50 flex flex-col gap-3">
        <div class="bg-white/80 backdrop-blur-2xl p-2 rounded-[32px] border border-lumina-olive/5 shadow-2xl flex flex-col gap-2">
          <button *ngFor="let floor of floors; let i = index"
                  (click)="activeFloorIndex.set(i); centerView()"
                  [ngClass]="activeFloorIndex() === i ? 'bg-lumina-olive text-white shadow-lg shadow-lumina-olive/20' : 'text-lumina-olive/40 hover:text-lumina-olive hover:bg-white'"
                  class="px-6 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center gap-4">
            <span class="w-1.5 h-1.5 rounded-full" [ngClass]="activeFloorIndex() === i ? 'bg-lumina-mint animate-pulse' : 'bg-current opacity-20'"></span>
            {{ floor.name }}
          </button>
        </div>
      </div>

      <!-- ZOOM & TOOLS PANEL -->
      <div class="absolute bottom-10 right-10 z-50 flex flex-col gap-4">
        <div class="bg-white/80 backdrop-blur-2xl p-2 rounded-[32px] border border-lumina-olive/5 shadow-2xl flex flex-col gap-1">
          <button (click)="zoomIn()" class="w-14 h-14 flex items-center justify-center text-xl font-bold text-lumina-olive hover:bg-white rounded-[24px] transition-all">+</button>
          <div class="h-[1px] bg-lumina-olive/5 mx-3"></div>
          <button (click)="zoomOut()" class="w-14 h-14 flex items-center justify-center text-xl font-bold text-lumina-olive hover:bg-white rounded-[24px] transition-all">−</button>
        </div>
        
        <!-- BOUTON CENTRER LA VUE -->
        <div class="bg-white/80 backdrop-blur-2xl p-2 rounded-[32px] border border-lumina-olive/5 shadow-2xl flex flex-col gap-1">
          <button (click)="centerView()" class="w-14 h-14 flex items-center justify-center text-xs font-bold text-lumina-olive hover:bg-white rounded-[24px] transition-all" title="Centrer la vue">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm9-5a5 5 0 100 10 5 5 0 000-10z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- INFO OVERLAY -->
      <div class="absolute top-10 right-10 bg-white/80 backdrop-blur-2xl px-8 py-6 rounded-[32px] border border-lumina-olive/5 shadow-2xl pointer-events-none">
        <div class="flex items-center gap-4 mb-2">
          <span class="text-xs font-black uppercase tracking-[0.4em] text-lumina-rust">Discovery Engine</span>
          <span class="w-2 h-2 rounded-full bg-lumina-mint animate-pulse"></span>
        </div>
        <p class="text-[10px] font-black uppercase tracking-widest text-lumina-olive/40">{{ currentFloorName() }} Protocol v4.0</p>
      </div>

      <!-- 3D WORLD CONTAINER -->
      <div class="w-full h-full relative"
           [style.transform-style]="'preserve-3d'"
           [style.transform]="getTransform()"
           [style.transition]="isPanning ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'">
        
        <!-- LUXURY FLOOR GRID -->
        <div 
          class="absolute bg-white/60 border border-lumina-olive/5 shadow-[0_0_100px_rgba(100,110,87,0.05)]"
          style="width: 8000px; height: 8000px; left: 50%; top: 50%;"
          [style.transform]="'translate(-50%, -50%) translateZ(-400px) rotateX(90deg)'"
          [style.background-image]="getGridBackground()"
          style="background-size: 100px 100px;">
        </div>

        <!-- ROOMS -->
        <ng-container *ngIf="currentFloor()?.rooms">
          <ng-container *ngFor="let room of currentFloor().rooms">
            <div [attr.key]="room.id" [style.transform-style]="'preserve-3d'">
              
              <!-- ROOM SURFACE -->
              <svg 
                class="absolute pointer-events-auto overflow-visible cursor-pointer"
                style="width: 8000px; height: 8000px; left: 0; top: 0;"
                [style.transform]="'translateZ(' + getRoomDepthZ(room) + 'px)'">
                <polygon 
                  [attr.points]="getRoomPointsString(room.points)"
                  [attr.fill]="getRoomColor(room)"
                  [attr.fill-opacity]="selectedShop && selectedShop.id_box === room.name ? 0.9 : (room.category === 'parking' ? 0.08 : 0.15)"
                  [attr.stroke]="selectedShop && selectedShop.id_box === room.name ? '#8C4A33' : getRoomColor(room)"
                  [attr.stroke-width]="selectedShop && selectedShop.id_box === room.name ? 3 : 1"
                  [attr.stroke-opacity]="selectedShop && selectedShop.id_box === room.name ? 1 : 0.4"
                  [attr.stroke-dasharray]="room.category === 'parking' ? '4 4' : 'none'"
                  class="transition-all duration-500"
                />
              </svg>

              <!-- PARKING SPOTS (DETAILED) -->
              <ng-container *ngIf="room.category === 'parking' && room.spotGroups">
                <ng-container *ngFor="let group of room.spotGroups">
                  <div 
                    class="absolute"
                    [style.left.px]="mToPx(group.p1.x)"
                    [style.top.px]="mToPx(group.p1.y)"
                    [style.transform]="'translate(-50%, -50%) rotateZ(' + group.angle + 'deg) translateZ(' + (getGroupDepthZ(group.p1.x, group.p1.y) + 5) + 'px)'"
                    style="transform-style: preserve-3d;">
                    
                    <!-- Spot Base -->
                    <div 
                      class="absolute bg-lumina-olive/5 border border-lumina-olive/10"
                      [style.width.px]="mToPx(group.countPerSide * group.spotWidth)"
                      [style.height.px]="mToPx(group.spotDepth * 2)"
                      style="left: 0; top: 0; transform: translate(-50%, -50%); backdrop-blur-sm;">
                    </div>
                    
                    <!-- Individual Slots -->
                    <div *ngFor="let i of getArray(group.countPerSide * 2); let spotIndex = index"
                         class="absolute border border-lumina-olive/10 flex items-center justify-center transition-all duration-500"
                         [style.width.px]="mToPx(group.spotWidth)"
                         [style.height.px]="mToPx(group.spotDepth)"
                         [style.left.px]="(spotIndex % group.countPerSide) * mToPx(group.spotWidth) - (mToPx(group.countPerSide * group.spotWidth) / 2)"
                         [style.top.px]="(spotIndex < group.countPerSide ? 0 : mToPx(group.spotDepth)) - (mToPx(group.spotDepth))"
                         [ngClass]="{'bg-lumina-rust shadow-[0_0_30px_rgba(140,74,51,0.4)] z-50': isSpotSelected(group, spotIndex)}"
                         [style.background]="isSpotSelected(group, spotIndex) ? '#8C4A33' : 'rgba(100,110,87,0.05)'">
                      
                      <span class="font-black opacity-20 uppercase tracking-tighter"
                            [ngClass]="isSpotSelected(group, spotIndex) ? 'text-white opacity-100' : 'text-lumina-olive'"
                            [style.font-size.px]="getFontSize(group.spotWidth)">
                        {{ getSpotNumber(group, spotIndex) }}
                      </span>
                    </div>
                  </div>
                </ng-container>
              </ng-container>

            </div>
          </ng-container>
        </ng-container>

        <!-- ARCHITECTURAL WALLS -->
        <ng-container *ngIf="currentFloor()?.walls">
          <ng-container *ngFor="let wall of currentFloor().walls">
            <ng-container *ngFor="let section of getWallSections(wall)">
              <div 
                class="absolute bg-gradient-to-r from-lumina-olive/80 via-lumina-olive/90 to-lumina-olive shadow-2xl"
                [style.width.px]="mToPx(section.length)"
                [style.height.px]="BRICK_HEIGHT"
                [style.left.px]="mToPx(section.startX)"
                [style.top.px]="mToPx(section.startY) - BRICK_HEIGHT / 2"
                [style.transform-origin]="'0% 50%'"
                [style.transform]="getWallTransform(wall, section)"
                style="transform-style: preserve-3d; border: 1px solid rgba(45,51,37,0.1);">
                
                <!-- TOP CAP -->
                <div class="absolute bg-lumina-olive shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
                     [style.width]="'100%'"
                     [style.height.px]="mToPx(wall.thickness)"
                     [style.top.px]="-mToPx(wall.thickness / 2)"
                     style="transform: rotateX(90deg); transform-origin: top;">
                </div>
              </div>
            </ng-container>

            <!-- DOORS -->
            <ng-container *ngFor="let door of (wall.doors ?? [])">
              <div 
                class="absolute pointer-events-none flex flex-col items-center justify-center"
                [style.left.px]="mToPx(getDoorPosition(wall, door).x)"
                [style.top.px]="mToPx(getDoorPosition(wall, door).y)"
                [style.transform]="getDoorTransform(wall, door)">
                
                <div class="w-8 h-8 text-lumina-rust bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl border border-lumina-rust/20 animate-pulse-gentle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path [attr.d]="door.isOutward ? 'M12 20l8-8H4z' : 'M12 4l-8 8h16z'" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </ng-container>
          </ng-container>
        </ng-container>

        <!-- ROOMS -->
        <ng-container *ngIf="currentFloor()?.rooms">
          <ng-container *ngFor="let room of currentFloor().rooms">
            <div [attr.key]="room.id" [style.transform-style]="'preserve-3d'">

              <!-- LUXURY LABELS (RESIZED FOR VISIBILITY) -->
              <div 
                class="absolute whitespace-nowrap px-6 py-3 rounded-[24px] backdrop-blur-xl border-2 transition-all duration-500 z-50 shadow-2xl"
                [style.left.px]="mToPx(getRoomCenter(room).x)"
                [style.top.px]="mToPx(getRoomCenter(room).y)"
                [style.transform]="'translate(-50%, -50%) translateZ(65px)'"
                [ngClass]="selectedShop && selectedShop.id_box === room.name ? 'bg-lumina-rust text-white scale-125 border-white shadow-lumina-rust/40' : 'bg-white text-lumina-olive scale-100 border-lumina-olive/10'">
                <div class="flex flex-col items-center gap-1.5">
                  <span class="text-[11px] font-black uppercase tracking-[0.3em] leading-none">{{ getShopName(room) }}</span>
                  <div class="w-full h-[1px] bg-current opacity-10 my-0.5"></div>
                  <span *ngIf="room.category === 'parking'" class="text-[9px] font-bold uppercase opacity-60 tracking-wider">
                    {{ getTotalParkingSpots(room) }} LUX Slots
                  </span>
                  <span *ngIf="room.category === 'shop'" class="text-[9px] font-black uppercase opacity-60 tracking-tighter">
                    Maison d'Excellence
                  </span>
                </div>
              </div>
            </div>
          </ng-container>
        </ng-container>
        
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    @keyframes pulse-gentle { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
    .animate-pulse-gentle { animation: pulse-gentle 3s ease-in-out infinite; }
  `]
})
export class ThreeDPlanComponent implements AfterViewInit, OnChanges {
  @Input() floors: Floor[] = [];
  @Input() shops: [] | null = [];
  @Input() selectedShop: {} | null = null;
  @Input() selectedSpotId: string | null = null;
  @Input() initialFloorIndex: number = 0;
  
  readonly MALL_RATIO = 35;
  readonly BRICK_HEIGHT = 16;
  
  // CORRECTION : Retour à la valeur originale de perspectiveOrigin
  activeFloorIndex = signal(0);
  zoom = signal(0.9);
  pan = signal({ x: 0, y: 0 });
  perspectiveOrigin = signal({ x: 0.498, y: 0.5 }); // ← ICI : 0.498 au lieu de 0.5
  isPanning = false;
  lastMouse = { x: 0, y: 0 };

  currentFloor = computed(() => {
    const idx = this.activeFloorIndex();
    return (this.floors && this.floors.length > 0 && idx >= 0 && idx < this.floors.length)
      ? this.floors[idx] 
      : { id: 'def', name: 'Loading...', walls: [], rooms: [] } as Floor;
  });

  getShopName(room: any): string {
    const foundShop = this.shops?.find((item: any) => item.id_box === room.name);
    return foundShop?.shop_name ?? room.name;
  }
  
  currentFloorName = computed(() => this.currentFloor()?.name ?? '');
  bounds = computed(() => this.calculateBounds());
  center = computed(() => this.calculateCenter());

  ngAfterViewInit() {
    this.activeFloorIndex.set(this.initialFloorIndex);
    setTimeout(() => this.centerView(), 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialFloorIndex'] && changes['initialFloorIndex'].currentValue !== undefined) {
      this.activeFloorIndex.set(changes['initialFloorIndex'].currentValue);
      setTimeout(() => this.centerView(), 100);
    }
  }

  isSpotSelected(group: SpotGroup, idx: number): boolean {
    if (!this.selectedSpotId) return false;
    return this.getSpotNumber(group, idx) === this.selectedSpotId;
  }

  zoomIn() { 
    this.zoom.update(z => Math.min(5, z * 1.2)); 
  }
  
  zoomOut() { 
    this.zoom.update(z => Math.max(0.1, z / 1.2)); 
  }
  
  getPerspective(): string { 
    return (2000 / this.zoom()) + 'px'; 
  }
  
  getPerspectiveOrigin(): string { 
    const o = this.perspectiveOrigin(); 
    return `${o.x * 100}% ${o.y * 100}%`; 
  }
  
  getGridBackground() { 
    return 'linear-gradient(to right, rgba(100,110,87,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,110,87,0.05) 1px, transparent 1px)'; 
  }

  calculateBounds() {
    const f = this.currentFloor();
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    (f.walls ?? []).forEach(w => {
      minX = Math.min(minX, w.p1.x, w.p2.x);
      maxX = Math.max(maxX, w.p1.x, w.p2.x);
      minY = Math.min(minY, w.p1.y, w.p2.y);
      maxY = Math.max(maxY, w.p1.y, w.p2.y);
    });

    (f.rooms ?? []).forEach(r => {
      r.points.forEach(p => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      });
      
      (r.spotGroups ?? []).forEach(g => {
        minX = Math.min(minX, g.p1.x);
        maxX = Math.max(maxX, g.p1.x);
        minY = Math.min(minY, g.p1.y);
        maxY = Math.max(maxY, g.p1.y);
      });
    });

    if (minX === Infinity || (f.rooms?.length === 0 && f.walls?.length === 0)) {
      return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    }

    return { minX, maxX, minY, maxY };
  }

  calculateCenter() {
    const b = this.bounds();
    return { 
      x: (b.minX + b.maxX) / 2, 
      y: (b.minY + b.maxY) / 2 
    };
  }

  calculateZDepth(x: number, y: number): number {
    const c = this.center();
    const dx = x - c.x;
    const dy = y - c.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return -distance * 0.1;
  }

  mToPx(m: number): number { 
    return m * this.MALL_RATIO; 
  }
  
  getTransform() {
    const bounds = this.bounds();
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    return `
      scale(${this.zoom()}) 
      rotateX(60deg) 
      rotateZ(0deg)
      translate3d(
        ${-this.mToPx(centerX) + this.pan().x}px, 
        ${-this.mToPx(centerY) + this.pan().y}px, 
        0px
      )
    `;
  }

  getRoomCenter(r: Room): Point {
    const pts = r.points ?? [];
    if (!pts.length) return { x: 0, y: 0 };
    return { 
      x: pts.reduce((s, p) => s + p.x, 0) / pts.length, 
      y: pts.reduce((s, p) => s + p.y, 0) / pts.length 
    };
  }

  getRoomDepthZ(r: Room): number { 
    const c = this.getRoomCenter(r); 
    return this.calculateZDepth(c.x, c.y); 
  }
  
  getGroupDepthZ(x: number, y: number): number { 
    return this.calculateZDepth(x, y); 
  }
  
  getWallDepthZ(w: Wall): number { 
    return this.calculateZDepth((w.p1.x + w.p2.x) / 2, (w.p1.y + w.p2.y) / 2); 
  }
  
  getDoorDepthZ(w: Wall, d: Door): number { 
    return this.calculateZDepth(
      w.p1.x + (w.p2.x - w.p1.x) * d.position, 
      w.p1.y + (w.p2.y - w.p1.y) * d.position
    ); 
  }
  
  getRoomPointsString(pts: Point[]): string { 
    return (pts ?? []).map(p => `${this.mToPx(p.x)},${this.mToPx(p.y)}`).join(' '); 
  }

  getRoomColor(r: Room): string {
    if (r.name === this.selectedShop?.id_box) return '#8C4A33';
    if (r.category === 'parking') return '#646E57';
    const MAP: { [k: string]: string } = { 
      'service': '#B4B792', 
      'shop': '#CCAC85', 
      'green': '#A4BAA8', 
      'food': '#8C4A33' 
    };
    return MAP[r.category] ?? '#646E57';
  }

  getFontSize(w: number): number { 
    return Math.max(6, Math.min(10, this.mToPx(w) * 0.25)); 
  }
  
  getSpotNumber(g: SpotGroup, idx: number): string {
    const row = Math.floor(idx / g.countPerSide);
    const col = idx % g.countPerSide;
    const num = g.startIndex + (row === 0 ? col : (g.countPerSide * 2 - 1 - col));
    return `${g.prefix}${num.toString().padStart(2, '0')}`;
  }

  getTotalParkingSpots(r: Room): number { 
    return (r.spotGroups ?? []).reduce((t, g) => t + (g.countPerSide * 2), 0); 
  }
  
  getArray(l: number): any[] { 
    return Array.from({ length: Math.max(0, l) }); 
  }

  getWallSections(w: Wall): any[] {
    const len = Math.sqrt(Math.pow(w.p2.x - w.p1.x, 2) + Math.pow(w.p2.y - w.p1.y, 2));
    const doors = [...(w.doors ?? [])].sort((a, b) => a.position - b.position);
    let curr = 0; 
    const secs: any[] = [];
    
    doors.forEach(d => {
      const start = d.position - (d.width / 2 / len);
      if (start > curr) {
        secs.push({ 
          startX: w.p1.x + (w.p2.x - w.p1.x) * curr, 
          startY: w.p1.y + (w.p2.y - w.p1.y) * curr, 
          length: (start - curr) * len 
        });
      }
      curr = d.position + (d.width / 2 / len);
    });
    
    if (curr < 1) {
      secs.push({ 
        startX: w.p1.x + (w.p2.x - w.p1.x) * curr, 
        startY: w.p1.y + (w.p2.y - w.p1.y) * curr, 
        length: (1 - curr) * len 
      });
    }
    
    return secs;
  }

  getWallTransform(w: Wall, s: any): string {
    const ang = Math.atan2(w.p2.y - w.p1.y, w.p2.x - w.p1.x) * 180 / Math.PI;
    const z = this.getWallDepthZ(w);
    return `rotateZ(${ang}deg) rotateX(-90deg) translateZ(${z}px)`;
  }

  getDoorPosition(w: Wall, d: Door): Point { 
    return { 
      x: w.p1.x + (w.p2.x - w.p1.x) * d.position, 
      y: w.p1.y + (w.p2.y - w.p1.y) * d.position 
    }; 
  }
  
  getDoorTransform(w: Wall, d: Door): string {
    const ang = Math.atan2(w.p2.y - w.p1.y, w.p2.x - w.p1.x) * 180 / Math.PI;
    const z = this.getDoorDepthZ(w, d);
    return `translate(-50%, -50%) rotateZ(${ang}deg) translateZ(${z + 5}px)`;
  }

  // MÉTHODE POUR CENTRER LA VUE - Simple
  centerView(): void {
    const bounds = this.bounds();
    const center = this.center();
    
    // Pan doit centrer le plan dans le conteneur
    // Pour que le centre du plan soit au centre de l'écran
    this.pan.set({ 
      x: this.mToPx(center.x),
      y: this.mToPx(center.y) - 80 // Léger ajustement vertical pour l'effet 3D
    });
    this.zoom.set(0.9);
    this.perspectiveOrigin.set({ x: 0.498, y: 0.5 }); // ← ICI : Retour à 0.498
  }

  onMouseDown(e: MouseEvent) { 
    this.isPanning = true; 
    this.lastMouse = { x: e.clientX, y: e.clientY }; 
  }
  
  onMouseMove(e: MouseEvent) {
    if (!this.isPanning) return;
    const dx = e.clientX - this.lastMouse.x;
    const dy = e.clientY - this.lastMouse.y;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newOriginX = 0.5 - (dx / rect.width) * 0.01;
    const newOriginY = 0.5 - (dy / rect.height) * 0.01;
    
    this.perspectiveOrigin.set({
      x: Math.max(0.3, Math.min(0.7, newOriginX)),
      y: Math.max(0.3, Math.min(0.7, newOriginY))
    });
    
    this.pan.update(p => ({ 
      x: p.x + dx / this.zoom(), 
      y: p.y + dy / this.zoom() 
    }));
    
    this.lastMouse = { x: e.clientX, y: e.clientY };
  }
  
  onMouseUp() { 
    this.isPanning = false; 
  }
  
  onWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.1, Math.min(5, this.zoom() * delta));
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    this.perspectiveOrigin.set({
      x: Math.max(0.3, Math.min(0.7, x)),
      y: Math.max(0.3, Math.min(0.7, y))
    });
    
    this.zoom.set(newZoom);
  }
}