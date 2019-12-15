import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'discover',
    loadChildren: () => import('./pages/discover/discover.module').then(m => m.DiscoverPageModule)
  },
  {
    path: 'discover/styles',
    loadChildren: () => import('./pages/styles/styles.module').then(m => m.StylesPageModule)
  },
  {
    path: 'style-details/:slug',
    loadChildren: () => import('./pages/style-details/style-details.module').then(m => m.StyleDetailsPageModule)
  },
  {
    path: 'discover/artists',
    loadChildren: () => import('./pages/artists/artists.module').then(m => m.ArtistsPageModule)
  },
  {
    path: 'artist-details/:slug',
    loadChildren: () => import('./pages/artist-details/artist-details.module').then(m => m.ArtistDetailsPageModule)
  },
  {
    path: 'painting',
    loadChildren: () => import('./pages/painting/painting.module').then(m => m.PaintingPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'password-recovery',
    loadChildren: () => import('./pages/password-recovery/password-recovery.module').then( m => m.PasswordRecoveryPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
