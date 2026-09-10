import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth';
import { IndividualService } from './services/individual';
import { PublicNav } from './nav/public-nav/public-nav';
import { AuthNav } from './nav/auth-nav/auth-nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, PublicNav, AuthNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-auth-dashboard');
  public themeService = inject(ThemeService);
  public authService = inject(AuthService);
  public individualService = inject(IndividualService);

  // Dropdown & Modal Signals
  isUserDropdownOpen = signal(false);
  isScopeModalOpen = signal(false);
  isLoginModalOpen = signal(false);

  // Login Form Signals
  loginUsername = signal('');
  loginPassword = signal('');
  loginError = signal('');

  toggleUserDropdown() {
    this.isUserDropdownOpen.update((v) => !v);
  }

  openLoginModal() {
    this.loginUsername.set('');
    this.loginPassword.set('');
    this.loginError.set('');
    this.isLoginModalOpen.set(true);
  }

  closeLoginModal() {
    this.isLoginModalOpen.set(false);
  }

  executeLogin() {
    this.loginError.set('');
    this.authService
      .login({
        username: this.loginUsername(),
        password: this.loginPassword(),
      })
      ?.subscribe({
        next: () => {
          this.closeLoginModal();
        },
        error: (err) => {
          console.error('Login error:', err);
          this.loginError.set('Invalid credentials. Please try again.');
        },
      });
  }

  openScopeModal() {
    this.individualService.checkScopes();
    this.isScopeModalOpen.set(true);
    this.isUserDropdownOpen.set(false);
  }

  closeScopeModal() {
    this.isScopeModalOpen.set(false);
  }
}
