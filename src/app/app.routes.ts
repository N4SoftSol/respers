import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Individuals } from './pages/individuals/individuals';
import { AdminGuard } from './guards/admin-guard';
import { Faqs } from './pages/faqs/faqs';
import { DataManagement } from './pages/admin/dataManagement/data-management';
import { ActiveTokens } from './pages/admin/active-tokens/active-tokens';
import { PublicInfo } from './pages/public-info/public-info';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'public/info', component: PublicInfo },
  { path: 'individuals', component: Individuals },
  { path: 'faqs', component: Faqs },
  {
    path: 'admin/data-management',
    component: DataManagement,
    canActivate: [AdminGuard.canActivate],
  },
  { path: 'admin/tokens', component: ActiveTokens, canActivate: [AdminGuard.canActivate] },
  { path: '**', redirectTo: '' },
];
