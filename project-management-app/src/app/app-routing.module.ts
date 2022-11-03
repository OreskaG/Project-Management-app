import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/pages/not-found-page/not-found-page.component';
import { WelcomePageComponent } from './core/pages/welcome-page/welcome-page.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'boards', loadChildren: () => import('./board/board.module').then((m) => m.BoardModule) },
  { path: '', redirectTo: '/boards', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
