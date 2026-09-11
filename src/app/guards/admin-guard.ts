import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IndividualService } from '../services/individual';

export class AdminGuard {
  static canActivate: CanActivateFn = () => {
    const individualService = inject(IndividualService);
    const router = inject(Router);

    if (individualService.hasAdminScope()) {
      return true;
    }

    // Redirect non-admin users to Dashboard
    router.navigate(['/']);
    return false;
  };
}
