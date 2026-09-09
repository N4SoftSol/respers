import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);

  username = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  onLogin() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .login({
        username: this.username(),
        password: this.password(),
      })
      .subscribe({
        error: (_err: unknown) => {
          this.isLoading.set(false);
          this.errorMessage.set('Invalid credentials. Please try again.');
        },
      });
  }
}
