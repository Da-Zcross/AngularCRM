import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ResourceFicheComponent } from './resources/resource-fiche/resource-fiche.component';
import { AuthenticationGuard } from './guards/authentication.guard';

import { ConsumerListComponent } from './consumer/consumer-list.component';
import { ConsumerEditComponent } from './consumer/consumer-edit.component';






export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'resources/:id',
    component: ResourceFicheComponent,
    canActivate: [AuthenticationGuard]
  },
  {
    path: 'consumers',
    children: [
      { path: '', component: ConsumerListComponent },
      { path: 'new', component: ConsumerEditComponent },
      { path: ':id/edit', component: ConsumerEditComponent }
    ]
  },
  { path: '', redirectTo: '/consumers', pathMatch: 'full' },
  { path: '**', redirectTo: '/consumers' },


  {
    path: '**',
    redirectTo: 'login'
  },



];
