import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { IndividualService } from '../../services/individual';

@Component({
  selector: 'app-auth-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="space-y-1">
      <div class="text-[10px] uppercase font-bold text-slate-500 px-3 my-2 tracking-wider">
        @if (!themeService.isSidebarCollapsed()) {
          DOMAIN APPS
        }
      </div>

      <!-- Individuals CRUD (Available to READ/CONTRIBUTOR/ADMIN) -->
      <a
        routerLink="/individuals"
        routerLinkActive="!bg-blue-600 !text-white font-semibold"
        class="flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer text-xs"
      >
        <span class="text-base">👥</span>
        @if (!themeService.isSidebarCollapsed()) {
          <span>Individuals CRUD</span>
        }
      </a>

      <!-- ADMIN AREA (Restricted exclusively to IT-API_ADMIN) -->
      @if (individualService.hasAdminScope()) {
        <div>
          <button
            (click)="toggleAdminMenu()"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer text-xs text-slate-300"
          >
            <div class="flex items-center gap-3.5">
              <span class="text-base">🛠️</span>
              @if (!themeService.isSidebarCollapsed()) {
                <span>Admin Area</span>
              }
            </div>
            @if (!themeService.isSidebarCollapsed()) {
              <span
                class="text-[10px] transition-transform duration-200"
                [class.rotate-180]="isAdminOpen()"
                >▾</span
              >
            }
          </button>

          @if (isAdminOpen() && !themeService.isSidebarCollapsed()) {
            <div class="pl-9 pr-2 py-1 space-y-1">
              <a
                routerLink="/admin/data-management"
                routerLinkActive="!text-blue-400 font-semibold"
                class="block px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Reset App
              </a>
              <a
                routerLink="/admin/tokens"
                routerLinkActive="!text-blue-400 font-semibold"
                class="block px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Check Valid Tokens
              </a>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AuthNav {
  public themeService = inject(ThemeService);
  public individualService = inject(IndividualService);
  isAdminOpen = signal(true);

  toggleAdminMenu() {
    this.isAdminOpen.update((v) => !v);
  }
}
