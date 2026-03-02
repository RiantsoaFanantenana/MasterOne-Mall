import { Component, Input, Output, EventEmitter, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

export type UserRole = 'client' | 'shop' | 'admin';

// Données de démonstration pré-définies
const DEMO_CREDENTIALS = [
  {
    username: 'mall',
    email: 'admin@mall.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    displayName: 'Mall Admin'
  },
  {
    username: 'boutique',
    email: 'shop@example.com',
    password: 'password123',
    role: 'shop' as UserRole,
    displayName: 'Shop Manager'
  },
  {
    username: 'visitor',
    email: 'client@example.com',
    password: 'password123',
    role: 'client' as UserRole,
    displayName: 'Client'
  }
];

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isVisible" class="fixed inset-0 z-[200] flex items-center justify-center bg-lumina-dark/60 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <!-- Modal avec scroll invisible -->
      <div class="bg-white p-10 lg:p-16 rounded-[60px] shadow-3xl w-full max-w-xl animate-in zoom-in-95 duration-500 border border-lumina-olive/10 relative overflow-hidden max-h-[90vh] flex flex-col">
        <!-- Close Button (fixe en haut) -->
        <button (click)="close.emit()" class="absolute top-10 right-10 p-2 text-lumina-olive/20 hover:text-lumina-rust transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <!-- Zone défilante avec scrollbar invisible -->
        <div class="overflow-y-auto scrollbar-hidden pr-4 flex-1">
          <div class="text-center mb-12">
            <div class="w-24 h-24 bg-lumina-rust rounded-[35px] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 class="text-4xl font-black text-lumina-olive font-outfit uppercase tracking-tighter mb-2">MasterOne Access</h2>
            <p class="text-[10px] font-black uppercase tracking-[0.4em] text-lumina-tan opacity-60">Identity Verification Required</p>
          </div>

          <!-- Quick Select Buttons (cachés en mode register) -->
          <div *ngIf="!isRegisterMode()" class="flex gap-3 mb-8">
            <button 
              *ngFor="let cred of demoCredentials"
              type="button"
              (click)="fillCredentials(cred)"
              class="flex-1 py-3 px-2 bg-lumina-cream rounded-2xl border border-lumina-olive/10 hover:border-lumina-rust transition-all text-center group"
            >
              <span class="text-[10px] font-black uppercase tracking-wider text-lumina-olive/40 group-hover:text-lumina-rust">{{ cred.displayName }}</span>
              <span class="text-[8px] font-bold text-lumina-olive/20 block">▼</span>
            </button>
          </div>

          <div class="space-y-8">
            <!-- Email Field (toujours visible) -->
            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4 block">Master Identity (Email)</label>
              <div class="relative">
                <input 
                  type="email" 
                  [(ngModel)]="email" 
                  placeholder="admin&#64;mall.com" 
                  [readonly]="isRegisterMode() && generatedUsername()"
                  class="w-full px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[30px] font-bold outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all text-lumina-olive text-lg shadow-inner"
                />
                <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
            </div>

            <!-- Name Field (visible seulement en mode register) -->
            <div *ngIf="isRegisterMode()" class="space-y-3 animate-in slide-in-from-top-2">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4 block">Full Name</label>
              <div class="relative">
                <input 
                  type="text" 
                  [(ngModel)]="fullName" 
                  placeholder="John Doe" 
                  class="w-full px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[30px] font-bold outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all text-lumina-olive text-lg shadow-inner"
                />
                <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
            </div>

            <!-- Generated Username (affiché en mode register, non éditable) -->
            <div *ngIf="isRegisterMode()" class="space-y-3 animate-in slide-in-from-top-2">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4 block">Username (auto-generated)</label>
              <div class="relative">
                <input 
                  type="text" 
                  [value]="generatedUsername()" 
                  readonly
                  class="w-full px-10 py-6 bg-lumina-cream/50 border border-lumina-olive/10 rounded-[30px] font-bold text-lumina-olive/60 text-lg shadow-inner cursor-not-allowed"
                />
                <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                </div>
              </div>
              <p class="text-[8px] text-lumina-olive/40 ml-4">Username is automatically generated from your email</p>
            </div>

            <!-- Password Field -->
            <div class="space-y-3">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4 block">Secure Passcode</label>
              <div class="relative">
                <input 
                  type="password" 
                  [(ngModel)]="password" 
                  placeholder="••••••••" 
                  (keydown.enter)="handleAuth()"
                  class="w-full px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[30px] font-bold outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all text-lumina-olive text-lg shadow-inner"
                />
                <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              </div>
            </div>

            <!-- Confirm Password Field (visible seulement en mode register) -->
            <div *ngIf="isRegisterMode()" class="space-y-3 animate-in slide-in-from-top-2">
              <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4 block">Confirm Passcode</label>
              <div class="relative">
                <input 
                  type="password" 
                  [(ngModel)]="confirmPassword" 
                  placeholder="••••••••" 
                  (keydown.enter)="handleAuth()"
                  class="w-full px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[30px] font-bold outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all text-lumina-olive text-lg shadow-inner"
                />
                <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              </div>
              <p *ngIf="password !== confirmPassword && confirmPassword.length > 0" 
                 class="text-[8px] text-lumina-rust ml-4 mt-1 font-black uppercase">
                ⚠ Passwords do not match
              </p>
            </div>

            <!-- Message mode register -->
            <div *ngIf="isRegisterMode()" class="bg-lumina-mint/10 border border-lumina-mint/20 p-4 rounded-2xl">
              <p class="text-[9px] font-black uppercase tracking-widest text-lumina-mint text-center">
                🔐 No account found — Creating new client account
              </p>
            </div>

            <div *ngIf="isLoading" class="flex justify-center py-4">
              <div class="w-10 h-10 border-4 border-lumina-rust border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div *ngIf="errorMsg()" class="bg-lumina-rust/10 border border-lumina-rust/20 p-5 rounded-2xl text-center">
              <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMsg() }}</p>
            </div>

            <!-- Info message -->
            <div class="bg-lumina-olive/5 border border-lumina-olive/10 p-4 rounded-2xl">
              <p class="text-[9px] font-black uppercase tracking-widest text-lumina-olive/40 text-center">
                ⚡ Demo: admin&#64;mall.com / admin123
              </p>
            </div>

            <button (click)="handleAuth()" 
                    [disabled]="isLoading || !isFormValid()"
                    class="w-full py-7 bg-lumina-olive text-white rounded-[32px] font-black uppercase tracking-[0.4em] hover:bg-lumina-rust transition-all shadow-2xl shadow-lumina-olive/20 active:scale-[0.98] text-xs disabled:opacity-50 disabled:cursor-not-allowed">
              {{ getButtonText() }}
            </button>

            <!-- Lien pour forcer le mode register -->
            <div *ngIf="!isRegisterMode()" class="text-center">
              <button (click)="forceRegisterMode()" 
                      class="text-[9px] font-black uppercase tracking-widest text-lumina-olive/30 hover:text-lumina-rust transition-colors">
                New client? Create account
              </button>
            </div>

            <!-- Lien pour revenir en mode login -->
            <div *ngIf="isRegisterMode()" class="text-center">
              <button (click)="cancelRegisterMode()" 
                      class="text-[9px] font-black uppercase tracking-widest text-lumina-olive/30 hover:text-lumina-rust transition-colors">
                ← Back to Login
              </button>
            </div>

            <p class="text-center text-[9px] font-bold text-lumina-olive/30 uppercase tracking-[0.2em] mt-8">
              Access strictly reserved for MasterOne Excellence partners.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scrollbar-hidden::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    
    .scrollbar-hidden::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .scrollbar-hidden::-webkit-scrollbar-thumb {
      background: transparent;
    }
    
    /* Pour Firefox */
    .scrollbar-hidden {
      scrollbar-width: none;
    }
    
    /* Pour IE et Edge */
    .scrollbar-hidden {
      -ms-overflow-style: none;
    }
  `]
})
export class LoginModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() login = new EventEmitter<{ role: UserRole, username: string, email: string }>();
  @Output() close = new EventEmitter<void>();

  email: string = '';
  fullName: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMsg = signal<string | null>(null);
  isRegisterMode = signal<boolean>(false);
  
  demoCredentials = DEMO_CREDENTIALS;

  // Générer le username depuis l'email (partie avant le @)
  generatedUsername = computed(() => {
    if (!this.email) return '';
    return this.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  });

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.setDefaultAdminCredentials();
  }

  private setDefaultAdminCredentials() {
    const adminCred = DEMO_CREDENTIALS.find(c => c.role === 'admin');
    if (adminCred) {
      this.email = adminCred.email;
      this.password = adminCred.password;
    }
  }

  fillCredentials(cred: typeof DEMO_CREDENTIALS[0]) {
    this.email = cred.email;
    this.password = cred.password;
    this.fullName = '';
    this.confirmPassword = '';
    this.errorMsg.set(null);
    this.isRegisterMode.set(false);
  }

  forceRegisterMode() {
    this.isRegisterMode.set(true);
    this.errorMsg.set(null);
    this.fullName = '';
    this.confirmPassword = '';
  }

  cancelRegisterMode() {
    this.isRegisterMode.set(false);
    this.errorMsg.set(null);
    this.fullName = '';
    this.confirmPassword = '';
  }

  isFormValid(): boolean {
    if (!this.email || !this.password) return false;
    
    if (this.isRegisterMode()) {
      return !!this.fullName && 
             this.password === this.confirmPassword && 
             this.password.length >= 6;
    }
    
    return true;
  }

  getButtonText(): string {
    if (this.isLoading) return 'PROCESSING...';
    return this.isRegisterMode() ? 'CREATE ACCOUNT' : 'AUTHORIZE ENTRANCE';
  }

  handleAuth() {
    this.errorMsg.set(null);
    
    if (!this.email || !this.password) {
      this.errorMsg.set('Email and password are required');
      return;
    }

    if (this.isRegisterMode()) {
      // Mode REGISTER
      if (!this.fullName) {
        this.errorMsg.set('Full name is required');
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.errorMsg.set('Passwords do not match');
        return;
      }
      if (this.password.length < 6) {
        this.errorMsg.set('Password must be at least 6 characters');
        return;
      }
      
      this.isLoading = true;
      
      // Appel register avec userName et name
      this.apiService.register({
        email: this.email,
        password: this.password,
        userName: this.generatedUsername(),
        name: this.fullName
      }).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.handlePostAuth();
        },
        error: (error: any) => {
          this.isLoading = false;
          console.log('Registration error details:', error);
          
          if (error.message?.includes('already exists') || error.status === 409) {
            this.isRegisterMode.set(false);
            this.errorMsg.set('Account already exists. Please login.');
          } else {
            this.errorMsg.set(error.message || 'Registration failed. Please try again.');
          }
        }
      });
      
    } else {
      // Mode LOGIN
      this.isLoading = true;
      
      this.apiService.login({
        email: this.email,
        password: this.password
      }).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.handlePostAuth();
        },
        error: (error: any) => {
          this.isLoading = false;
          console.log('Login error details:', error);
          
          if (error.status === 404 || error.status === 401) {
            console.log('User not found, switching to register mode');
            this.isRegisterMode.set(true);
            this.errorMsg.set('Account not found. Please create a new client account.');
          } else {
            this.errorMsg.set(error.message || 'Invalid credentials. Please try again.');
          }
        }
      });
    }
  }

  private handlePostAuth() {
    this.isLoading = false;
    
    const role = this.apiService.getUserRole();
    const matchedCred = DEMO_CREDENTIALS.find(c => c.email === this.email);
    const username = matchedCred?.username || role;
    
    this.login.emit({ 
      role: role, 
      username: username,
      email: this.email 
    });
    
    // Reset form
    this.resetForm();
  }

  private resetForm() {
    this.email = '';
    this.fullName = '';
    this.password = '';
    this.confirmPassword = '';
    this.isRegisterMode.set(false);
    this.errorMsg.set(null);
    this.setDefaultAdminCredentials();
  }
}