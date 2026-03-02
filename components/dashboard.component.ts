import { Component, Input, Output, EventEmitter, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { 
  RevenuesExpendituresResponse, 
  CategoryAmount, 
  ContractEndingSoonResponse 
} from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="space-y-10">
      <!-- Header avec stats rapides -->
      <div class="flex justify-between items-end motion-slide-in stagger-1">
        <div>
          <p class="text-lumina-tan font-semibold">Lumina Center • Retail Experience Management</p>
          <p class="text-[10px] text-lumina-olive/40 mt-1">Last updated: {{ lastUpdated | date:'medium' }}</p>
        </div>
        <div class="flex gap-4">
          <button (click)="refreshData()" 
                  [disabled]="isRefreshing()"
                  class="px-6 py-3 bg-white border border-lumina-olive/10 text-lumina-olive rounded-xl font-bold shadow-sm hover:bg-lumina-cream transition-all disabled:opacity-50">
            <span *ngIf="isRefreshing()" class="inline-block w-4 h-4 border-2 border-lumina-olive border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ isRefreshing() ? 'Refreshing...' : 'Refresh' }}
          </button>
          <button (click)="goToReports()" 
                  class="px-6 py-3 bg-lumina-rust text-white rounded-xl font-bold shadow-xl shadow-lumina-rust/20 hover:bg-lumina-olive transition-all">
            New Report
          </button>
        </div>
      </div>

      <!-- Messages d'erreur -->
      <div *ngIf="errorMessage()" class="bg-lumina-rust/10 border border-lumina-rust/20 p-6 rounded-3xl text-center">
        <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMessage() }}</p>
        <button (click)="retryLoading()" class="mt-4 px-6 py-2 bg-lumina-rust text-white rounded-xl text-[9px] font-black uppercase">
          Retry
        </button>
      </div>

      <!-- Indicateur de chargement principal -->
      <div *ngIf="isLoading()" class="flex justify-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-lumina-olive/5 border-t-lumina-rust rounded-full animate-spin mx-auto mb-6"></div>
          <p class="text-[10px] font-black uppercase tracking-widest text-lumina-olive/40">Loading Dashboard Data...</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div *ngIf="!isLoading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of mallStats(); let i = index" 
             class="bg-white p-6 rounded-xl border border-lumina-olive/5 shadow-sm hover:shadow-md transition-all group motion-slide-in"
             [ngClass]="'stagger-' + (i + 1)">
          <div class="flex justify-between items-start mb-6">
            <div class="p-3 bg-lumina-sage/10 rounded-xl text-lumina-olive group-hover:bg-lumina-sage/20 transition-colors flex items-center justify-center" [innerHTML]="stat.icon | safeHtml"></div>
            <div class="flex items-center gap-1 text-xs font-black uppercase" [ngClass]="stat.trend >= 0 ? 'text-lumina-mint' : 'text-lumina-rust'">
              {{ stat.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%
            </div>
          </div>
          <div>
            <p class="text-lumina-tan text-[10px] font-black uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <h3 class="text-3xl font-black text-lumina-olive tracking-tight">{{ stat.value }}</h3>
            <p class="text-[9px] text-lumina-olive/40 mt-2">{{ stat.subtext }}</p>
          </div>
        </div>
      </div>

      <!-- Graphique et Recommandations -->
      <div *ngIf="!isLoading()" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Graphique de trafic -->
        <div class="lg:col-span-2 bg-white p-8 rounded-xl border border-lumina-olive/5 shadow-sm motion-slide-in stagger-3">
          <div class="flex justify-between items-center mb-10">
            <h3 class="font-black text-2xl text-lumina-olive">Financial Overview</h3>
            <div class="flex bg-lumina-olive/5 p-1 rounded-xl">
              <button 
                (click)="setChartPeriod('week')" 
                [ngClass]="{
                  'bg-lumina-olive text-white': chartPeriod() === 'week',
                  'text-lumina-olive/40': chartPeriod() !== 'week'
                }"
                class="px-5 py-2 text-xs font-bold rounded-lg transition-all">
                Week
              </button>

              <button 
                (click)="setChartPeriod('month')" 
                [ngClass]="{
                  'bg-lumina-olive text-white': chartPeriod() === 'month',
                  'text-lumina-olive/40': chartPeriod() !== 'month'
                }"
                class="px-5 py-2 text-xs font-bold rounded-lg transition-all">
                Month
              </button>

              <button 
                (click)="setChartPeriod('year')" 
                [ngClass]="{
                  'bg-lumina-olive text-white': chartPeriod() === 'year',
                  'text-lumina-olive/40': chartPeriod() !== 'year'
                }"
                class="px-5 py-2 text-xs font-bold rounded-lg transition-all">
                Year
              </button>
            </div>
          </div>
          
          <!-- Revenus vs Dépenses -->
          <div class="grid grid-cols-2 gap-6 mb-8">
            <div class="p-4 bg-lumina-mint/5 rounded-xl border border-lumina-mint/10">
              <p class="text-[9px] font-black uppercase text-lumina-mint mb-2">Total Revenue</p>
              <p class="text-3xl font-black text-lumina-olive">{{ formatMoney(revenuesData()?.totalRevenue) }}</p>
            </div>
            <div class="p-4 bg-lumina-rust/5 rounded-xl border border-lumina-rust/10">
              <p class="text-[9px] font-black uppercase text-lumina-rust mb-2">Total Expenditure</p>
              <p class="text-3xl font-black text-lumina-olive">{{ formatMoney(revenuesData()?.totalExpenditure) }}</p>
            </div>
          </div>

          <!-- Graphique à barres -->
          <div class="h-[200px] flex items-end gap-4 justify-between">
            <div *ngFor="let item of chartData()" 
                class="relative flex-1 group"
                [style.height.%]="(item.value / maxChartValue) * 100">
              <div class="absolute inset-0 bg-lumina-sage/30 rounded-t-lg group-hover:bg-lumina-sage/50 transition-all duration-300"></div>
              <div class="absolute bottom-0 inset-x-0 bg-lumina-olive rounded-t-lg transition-all duration-700" 
                  [style.height.%]="(item.value / maxChartValue) * 100">
                <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-lumina-olive opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ formatMoney(item.value) }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-6 text-[9px] text-lumina-tan font-black uppercase tracking-[0.2em]">
            <span *ngFor="let item of chartData()">{{ item.label }}</span>
          </div>
        </div>

        <!-- AI Recommendations & Alertes -->
        <div class="bg-white p-8 rounded-xl border border-lumina-olive/5 shadow-sm flex flex-col motion-slide-in stagger-4">
          <h3 class="font-black text-2xl text-lumina-olive mb-4">Intelligence Center</h3>
          
          <!-- Contrats expirant bientôt -->
          <div class="mb-6">
            <p class="text-[9px] font-black uppercase text-lumina-rust mb-3 flex items-center gap-2">
              <span class="w-2 h-2 bg-lumina-rust rounded-full animate-pulse"></span>
              Contracts Ending Soon
            </p>
            <div *ngIf="expiringContracts().length === 0" class="text-[10px] text-lumina-olive/40 py-4 text-center border border-dashed border-lumina-olive/10 rounded-xl">
              No contracts expiring soon
            </div>
            <div *ngFor="let contract of expiringContracts()" class="mb-2 p-3 bg-lumina-rust/5 rounded-xl border border-lumina-rust/10">
              <p class="text-xs font-bold text-lumina-olive">{{ contract.shop.shopName }}</p>
              <p class="text-[8px] text-lumina-tan uppercase">Box {{ contract.shop.box }} • Ends {{ contract.endDate | date:'shortDate' }}</p>
            </div>
          </div>

          <!-- Revenus par catégorie -->
          <div class="mb-6">
            <p class="text-[9px] font-black uppercase text-lumina-mint mb-3">Revenue by Category</p>
            <div *ngFor="let cat of revenuesByCategory()" class="flex justify-between items-center mb-2 text-[10px]">
              <span class="text-lumina-olive">{{ cat._id }}</span>
              <span class="font-black text-lumina-olive">{{ formatMoney(parseFloat(cat.totalAmount)) }}</span>
            </div>
          </div>

          <!-- Dépenses par catégorie -->
          <div class="mb-6">
            <p class="text-[9px] font-black uppercase text-lumina-tan mb-3">Expenditure by Category</p>
            <div *ngFor="let cat of expendituresByCategory()" class="flex justify-between items-center mb-2 text-[10px]">
              <span class="text-lumina-olive">{{ cat._id }}</span>
              <span class="font-black text-lumina-olive">{{ formatMoney(parseFloat(cat.totalAmount)) }}</span>
            </div>
          </div>

          <!-- AI Suggestions -->
          <div class="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar" style="max-height: 300px;">
            <div *ngIf="isLoadingSuggestions()" class="flex flex-col items-center py-10">
               <div class="w-8 h-8 border-4 border-lumina-olive/5 border-t-lumina-rust rounded-full animate-spin"></div>
            </div>
            <div *ngFor="let s of mallSuggestions()" class="p-4 bg-lumina-cream border border-lumina-olive/5 rounded-xl hover:border-lumina-mint/50 transition-all group cursor-pointer">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-0.5 bg-lumina-mint/20 text-lumina-olive text-[8px] font-black rounded uppercase">{{ s.type }}</span>
              </div>
              <h4 class="font-bold text-lumina-olive text-xs group-hover:text-lumina-rust transition-colors mb-1">{{ s.title }}</h4>
              <p class="text-[9px] text-lumina-olive/60 leading-relaxed">{{ s.description }}</p>
            </div>
          </div>
          
          <button (click)="refreshInsights()" 
                  [disabled]="isLoadingSuggestions()"
                  class="w-full mt-6 py-4 bg-lumina-tan/10 text-lumina-olive rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lumina-tan/20 transition-all disabled:opacity-50">
            {{ isLoadingSuggestions() ? 'Loading...' : 'Refresh Insights' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  @Input() trafficData: any[] = [];
  @Input() loading: boolean = false;
  @Output() onRefresh = new EventEmitter<void>();

  private apiService = inject(ApiService);
  private router = inject(Router);

  // États
  isLoading = signal(true);
  isRefreshing = signal(false);
  isLoadingSuggestions = signal(false);
  errorMessage = signal<string | null>(null);
  lastUpdated = new Date();
  chartPeriod = signal<'week' | 'month' | 'year'>('month');

  // Données API
  revenuesData = signal<RevenuesExpendituresResponse | null>(null);
  revenuesByCategory = signal<CategoryAmount[]>([]);
  expendituresByCategory = signal<CategoryAmount[]>([]);
  expiringContracts = signal<ContractEndingSoonResponse[]>([]);

  // Chart data computed
  chartData = computed(() => {
    const data = this.revenuesData();
    if (!data) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      label: month,
      value: Math.random() * (data.totalRevenue || 10000)
    }));
  });

  get maxChartValue(): number {
    const values = this.chartData().map(d => d.value);
    return Math.max(...values, 1);
  }

  // Suggestions IA
  suggestions = signal([
    {
      type: 'REVENUE',
      title: 'Increase in Electronics Category',
      description: 'Electronics shops showing 23% higher traffic this month. Consider cross-promotion events.'
    },
    {
      type: 'ALERT',
      title: '3 Contracts Ending Next Week',
      description: 'Reach out to Tech Store, Fashion Hub, and Café Central for renewal discussions.'
    },
    {
      type: 'INSIGHT',
      title: 'Weekend Traffic Pattern',
      description: 'Saturdays show 45% higher footfall. Optimize staffing and promotions.'
    },
    {
      type: 'OPPORTUNITY',
      title: 'New Shop Type Trend',
      description: 'Wellness and organic shops gaining popularity. Consider recruitment focus.'
    }
  ]);

  Math = Math;

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    Promise.all([
      this.loadRevenuesExpenditures(),
      this.loadRevenuesDetails(),
      this.loadExpendituresDetails(),
      this.loadExpiringContracts()
    ]).catch(error => {
      console.error('Error loading dashboard data:', error);
      this.errorMessage.set('Failed to load dashboard data');
    }).finally(() => {
      this.isLoading.set(false);
      this.lastUpdated = new Date();
    });
  }

  private loadRevenuesExpenditures(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getRevenuesExpenditures().subscribe({
        next: (data) => {
          this.revenuesData.set(data);
          resolve();
        },
        error: (error) => {
          console.error('Error loading revenues/expenditures:', error);
          resolve();
        }
      });
    });
  }

  private loadRevenuesDetails(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getRevenuesDetails().subscribe({
        next: (data) => {
          this.revenuesByCategory.set(data);
          resolve();
        },
        error: (error) => {
          console.error('Error loading revenues details:', error);
          resolve();
        }
      });
    });
  }

  private loadExpendituresDetails(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getExpendituresDetails().subscribe({
        next: (data) => {
          this.expendituresByCategory.set(data);
          resolve();
        },
        error: (error) => {
          console.error('Error loading expenditures details:', error);
          resolve();
        }
      });
    });
  }

  private loadExpiringContracts(): Promise<void> {
    return new Promise((resolve) => {
      this.apiService.getContractsEndingSoon(7).subscribe({
        next: (data) => {
          this.expiringContracts.set(data);
          resolve();
        },
        error: (error) => {
          console.error('Error loading expiring contracts:', error);
          resolve();
        }
      });
    });
  }

  mallStats = signal([
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      label: 'Total Shops',
      value: '48',
      trend: 12,
      subtext: '+3 this month'
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      label: 'Active Events',
      value: '24',
      trend: 8,
      subtext: 'Next: Fashion Week'
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      label: 'Total Visitors',
      value: '12.5k',
      trend: -3,
      subtext: 'Last 24 hours'
    },
    {
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5M17 5a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M5 5h2v12H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>',
      label: 'Revenue',
      value: this.formatMoney(this.revenuesData()?.totalRevenue || 245000),
      trend: 15,
      subtext: 'vs last month'
    }
  ]);

  refreshData() {
    this.isRefreshing.set(true);
    this.loadDashboardData();
    this.onRefresh.emit();
    setTimeout(() => this.isRefreshing.set(false), 1000);
  }

  retryLoading() {
    this.loadDashboardData();
  }

  refreshInsights() {
    this.isLoadingSuggestions.set(true);
    setTimeout(() => {
      this.isLoadingSuggestions.set(false);
    }, 1000);
  }

  setChartPeriod(period: 'week' | 'month' | 'year') {
    this.chartPeriod.set(period);
  }

  goToReports() {
    this.router.navigate(['/admin/reports']);
  }

  formatMoney(amount: number | undefined): string {
    if (amount === undefined) return '0 €';
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  parseFloat(value: string): number {
    return parseFloat(value) || 0;
  }
}