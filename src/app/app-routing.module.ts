import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ResellerComponent } from './reseller/reseller.component';


const routes: Routes = [
  { path: 'compras', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule), canActivate: [AuthGuard], canLoad: [AuthGuard]},
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard], canLoad: [AuthGuard]},
  { path: 'revendedor', component: ResellerComponent, canActivate: [AuthGuard], canLoad: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
