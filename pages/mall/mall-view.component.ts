import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DashboardComponent } from '../../components/dashboard.component';
import { FinanceViewComponent } from './finance-view.component';
import { ContractsViewComponent } from './contracts-view.component';
import { MaintenanceViewComponent } from './maintenance-view.component';
import { InfrastructureViewComponent } from './infrastructure-view.component';

@Component({
  selector: 'app-mall-view',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardComponent, 
    FinanceViewComponent, 
    ContractsViewComponent, 
    MaintenanceViewComponent,
    InfrastructureViewComponent
  ],
  template: `
    <div class="max-w-[1920px] mx-auto w-full p-6 md:p-12 lg:p-16">
      <div class="motion-slide-in">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-lumina-olive/5 pb-8">
          <div>
            <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-lumina-rust mb-2 uppercase">MasterOne Operations Hub</h2>
            <h1 class="text-4xl md:text-5xl font-black text-lumina-olive font-outfit uppercase tracking-tighter leading-none">{{ getModuleTitle() }}</h1>
          </div>
        </div>
        
        <div [ngSwitch]="activeModule" class="animate-in fade-in slide-in-from-bottom-5 duration-700">
          <app-dashboard 
            *ngSwitchCase="'mall'"
            [mallStats]="stats"
            [trafficData]="trafficData"
            [mallSuggestions]="suggestions"
            [loading]="loading"
            (onRefresh)="onRefresh.emit()"
          ></app-dashboard>
  
          <app-infrastructure-view *ngSwitchCase="'infrastructure'"></app-infrastructure-view>
          <app-finance-view *ngSwitchCase="'finance'"></app-finance-view>
          <app-contracts-view *ngSwitchCase="'contracts'"></app-contracts-view>
          <app-maintenance-view *ngSwitchCase="'maintenance'"></app-maintenance-view>
        </div>
      </div>
    </div>
  `
})
export class MallViewComponent implements OnInit {
  @Input() activeModule: string = 'mall';
  @Input() stats: any[] = [];
  @Input() trafficData: any[] = []; 
  @Input() suggestions: any[] = [];
  @Input() loading: boolean = false;
  @Output() onRefresh = new EventEmitter<void>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Si le composant est utilisé via le router, prendre le module depuis les données de route
    this.route.data.subscribe(data => {
      if (data['module']) {
        this.activeModule = data['module'];
      }
    });
  }

  getModuleTitle() {
    switch(this.activeModule) {
      case 'infrastructure': return 'Space Architecture';
      case 'finance': return 'Strategic Finance';
      case 'contracts': return 'Merchant Directory';
      case 'maintenance': return 'Operations Control';
      default: return 'Business Intelligence';
    }
  }
}