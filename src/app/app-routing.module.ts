import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './core/guards/auth-guard';

const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'sign-in', loadChildren: () => import('./module/login/login.module').then(m => m.LoginModule)},
  {path: 'main', loadChildren: () => import('./module/page/page.module').then(m => m.PageModule), canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
