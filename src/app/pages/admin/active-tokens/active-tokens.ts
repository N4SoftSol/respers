import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { UserTokenSession } from '../../../models/token-session.model';

@Component({
  selector: 'app-active-tokens',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './active-tokens.html',
})
export class ActiveTokens implements OnInit {
  public authService = inject(AuthService);

  tokens = signal<UserTokenSession[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.loadTokens();
  }

  loadTokens() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.getValidTokens().subscribe({
      next: (res) => {
        this.tokens.set(res.users || []);
        this.totalCount.set(res.count || 0);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to fetch active tokens.');
        this.isLoading.set(false);
      },
    });
  }
}
