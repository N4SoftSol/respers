import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-public-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './public-nav.html',
})
export class PublicNav {
  public themeService = inject(ThemeService);
  isPagesOpen = signal(true); // Default open or closed

  togglePagesMenu() {
    this.isPagesOpen.update((v) => !v);
  }
}
