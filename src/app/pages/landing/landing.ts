import { Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  public authService = inject(AuthService);
  private authBaseUrl = environment.authBaseUrl;
  private apiBaseUrl = environment.apiBaseUrl;

  // // Public Endpoints -authBaseUrl
  // authpublicInfo = httpResource<any>(() => `${this.authBaseUrl}/api/public/info`);
  // authactuatorInfo = httpResource<any>(() => `${this.authBaseUrl}/actuator/info`);
  // authactuatorHealth = httpResource<any>(() => `${this.authBaseUrl}/actuator/health`);

  // // Public Endpoints -apiBaseUrl
  // apipublicInfo = httpResource<any>(() => `${this.apiBaseUrl}/api/public/info`);
  // apiactuatorInfo = httpResource<any>(() => `${this.apiBaseUrl}/actuator/info`);
  // apiactuatorHealth = httpResource<any>(() => `${this.apiBaseUrl}/actuator/health`);

  // Auth Server Endpoints (Matching exact property names used in template)
  authPublicInfo = httpResource(() => `${environment.authBaseUrl}/api/public/info`);
  authActuatorInfo = httpResource(() => `${environment.authBaseUrl}/actuator/info`);
  authHealth = httpResource(() => `${environment.authBaseUrl}/actuator/health`);
  authMetrics = httpResource(() => `${environment.authBaseUrl}/actuator/metrics`);

  // API Server Endpoints
  apiActuatorInfo = httpResource(() => `${environment.apiBaseUrl}/actuator/info`);
  apiHealth = httpResource(() => `${environment.apiBaseUrl}/actuator/health`);

  // Protected Resource on Auth Server
  authactuatorMetrics = httpResource<any>(() =>
    this.authService.isAuthenticated() ? `${this.authBaseUrl}/actuator/metrics` : undefined,
  );

  // Protected Resource on API Server
  apiactuatorMetrics = httpResource<any>(() =>
    this.authService.isAuthenticated() ? `${this.apiBaseUrl}/actuator/metrics` : undefined,
  );
}
