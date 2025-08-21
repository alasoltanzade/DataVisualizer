import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./features/users/users.component').then((c) => c.UsersComponent),
    canActivate: [],
  },
  {
    path: 'posts/:id',
    loadComponent: () =>
      import('./features/posts/posts.component').then((c) => c.PostsComponent),
    canActivate: [],
  },
  {
    path: 'chart',
    loadComponent: () =>
      import('./features/chart/chart.component').then((c) => c.ChartComponent),
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
