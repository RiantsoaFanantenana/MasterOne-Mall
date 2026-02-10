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
                style="transform-style: preserve-3d; border: 1px solid rgba(45,51,3