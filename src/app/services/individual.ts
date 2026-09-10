import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth';
import { Individual, WhoAmI } from '../models/individual.model';
import { StoredProcResponse } from '../models/stored-proc.model';

@Injectable({
  providedIn: 'root',
})
export class IndividualService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiBaseUrl = environment.apiBaseUrl;

  private refreshTrigger = signal<number>(0);
  fetchScopesTrigger = signal<boolean>(false);

  // GET /data-app/whoami (Eager or On-demand)
  whoAmI = httpResource<WhoAmI>(() => {
    this.refreshTrigger();
    // Fetch if authenticated AND scope trigger is active OR automatically on init
    return this.authService.isAuthenticated() ? `${this.apiBaseUrl}/data-app/whoami` : undefined;
  });

  // GET /data-app/individuals
  individuals = httpResource<Individual[]>(() => {
    this.refreshTrigger();
    return this.authService.isAuthenticated()
      ? `${this.apiBaseUrl}/data-app/individuals`
      : undefined;
  });

  // Scope permissions
  hasWriteScope = computed(() => {
    const authorities = this.whoAmI.value()?.authorities;
    if (!authorities) return false;
    return authorities.includes('SCOPE_write') || authorities.includes('SCOPE_admin');
  });

  hasAdminScope = computed(() => {
    const authorities = this.whoAmI.value()?.authorities;
    if (!authorities) return false;
    return authorities.includes('SCOPE_admin');
  });

  checkScopes() {
    this.fetchScopesTrigger.set(true);
    this.reload();
  }

  reload() {
    this.refreshTrigger.update((v) => v + 1);
  }

  create(individual: Individual) {
    return this.http.post<Individual>(`${this.apiBaseUrl}/data-app/individuals`, individual);
  }

  update(id: number, individual: Individual) {
    return this.http.put<Individual>(`${this.apiBaseUrl}/data-app/individuals/${id}`, individual);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiBaseUrl}/data-app/individuals/${id}`);
  }

  executeStoredProcedure(endpoint: string) {
    return this.http.post<StoredProcResponse>(`${this.apiBaseUrl}${endpoint}`, {});
  }
}
