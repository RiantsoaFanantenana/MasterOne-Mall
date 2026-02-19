
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type UserRole = 'client' | 'shop' | 'mall';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isVisible" class="fixed inset-0 z-[200] flex items-center justify-center bg-lumina-dark/60 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div class="bg-white p-10 lg:p-16 rounded-[60px] shadow-3xl w-full max-w-xl animate-in zoom-in-95 duration-500 border border-lumina-olive/10 relative overflow-hidden">
        <!-- Close Button -->
        <button (click)="close.emit()" class="absolute top-10 right-10 p-2 text-lumina-olive/20 hover:text-lumina-rust transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div class="text-center mb-12">
          <div class="w-24 h-24 bg-lumina-rust rounded-[35px] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h2 class="text-4xl font-black text-lumina-olive font-outfit uppercase tracking-tighter mb-2">MasterOne Access</h2>
          <p class="text-[10px] font-black uppercase tracking-[0.4em] text-lumina-tan opacity-60">Identity Verification Required</p>
        </div>

        <div class="space-y-8">
          <div class="space-y-3">
            <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4 block">Master Identity (Username)</label>
            <div class="relative">
              <input type="text" [(ngModel)]="username" placeholder="visitor, boutique, or mall" 
                     class="w-full px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[30px] font-bold outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all text-lumina-olive text-lg shadow-inner" />
              <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-[11px] font-black uppercase tracking-[0.2em] text-lumina-olive/40 ml-4 block">Secure Passcode</label>
            <div class="relative">
              <input type="password" [(ngModel)]="password" placeholder="••••••••" (keydown.enter)="handleLogin()"
                     class="w-full px-10 py-6 bg-lumina-cream border border-lumina-olive/10 rounded-[30px] font-bold outline-none focus:border-lumina-rust focus:ring-4 focus:ring-lumina-rust/5 transition-all text-lumina-olive text-lg shadow-inner" />
              <div class="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
          </div>

          <div *ngIf="errorMsg()" class="bg-lumina-rust/10 border border-lumina-rust/20 p-5 rounded-2xl text-center">
            <p class="text-[10px] font-black uppercase tracking-widest text-lumina-rust">{{ errorMsg() }}</p>
          </div>

          <button (click)="handleLogin()" 
                  class="w-full py-7 bg-lumina-olive text-white rounded-[32px] font-black uppercase tracking-[0.4em] hover:bg-lumina-rust transition-all shadow-2xl shadow-lumina-olive/20 active:scale-[0.98] text-xs">
            Authorize Entrance
          </button>

          <p class="text-center text-[9px] font-bold text-lumina-olive/30 uppercase tracking-[0.2em] mt-8">
            Access strictly reserved for MasterOne Excellence partners.
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginModalComponent {
  @Input() isVisible: boolean = false;
  @Output() login = new EventEmitter<{ role: UserRole, username: string }>();
  @Output() close = new EventEmitter<void>();

  username = '';
  password = '';
  errorMsg = signal<string | null>(null);

  handleLogin() {
    this.errorMsg.set(null);
    const u = this.username.toLowerCase().trim();
    
    let role: UserRole | null = null;
    if (u === 'visitor') role = 'client';
    else if (u === 'boutique') role = 'shop';
    else if (u === 'mall') role = 'mall';

    if (role) {
      this.login.emit({ role, username: this.username });
      this.username = '';
      this.password = '';
    } else {
      this.errorMsg.set('Identity mismatch. Use: visitor, boutique, or mall');
    }
  }
}
