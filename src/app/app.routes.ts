import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Individuals } from './pages/individuals/individuals';
import { authGuard } from './guards/auth-guard';
import { Faqs } from './pages/faqs/faqs';
import { DataManagement } from './pages/admin/dataManagement/data-management';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'individuals', component: Individuals, canActivate: [authGuard] },
  { path: 'faqs', component: Faqs },
  { path: 'admin/data-management', component: DataManagement },
  { path: '**', redirectTo: '' },
];
