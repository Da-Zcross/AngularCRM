import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ResourceFicheComponent } from './resources/resource-fiche/resource-fiche.component';
import { authenticationGuard } from './guards/authentication.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticationGuard]
  },
  {
    path: 'resources/:id',
    component: ResourceFicheComponent,
    canActivate: [authenticationGuard]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
