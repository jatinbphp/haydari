import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'library',
    loadChildren: () => import('./library/library.module').then( m => m.LibraryPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'type-views',
    loadChildren: () => import('./type-views/type-views.module').then( m => m.TypeViewsPageModule)
  },
  {
    path: 'sub-list-page',
    loadChildren: () => import('./sub-list-page/sub-list-page.module').then( m => m.SubListPagePageModule)
  },
  {
    path: 'subject-occasion-detail',
    loadChildren: () => import('./subject-occasion-detail/subject-occasion-detail.module').then( m => m.SubjectOccasionDetailPageModule)
  },{
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'poem-detail',
    loadChildren: () => import('./poem-detail/poem-detail.module').then( m => m.PoemDetailPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'search-result',
    loadChildren: () => import('./search-result/search-result.module').then( m => m.SearchResultPageModule)
  },
  {
    path: 'play-media',
    loadChildren: () => import('./play-media/play-media.module').then( m => m.PlayMediaPageModule)
  }
  /*,
  {
    path: 'short-detail-modal',
    loadChildren: () => import('./short-detail-modal/short-detail-modal.module').then( m => m.ShortDetailModalPageModule)
  }*/

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
