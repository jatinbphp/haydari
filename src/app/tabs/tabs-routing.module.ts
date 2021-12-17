import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'wishlist',
        loadChildren: () => import('../wishlist/wishlist.module').then(m => m.WishlistPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
      },
      {
        path: 'type-views',
        loadChildren: () => import('../type-views/type-views.module').then( m => m.TypeViewsPageModule)
      },
      {
        path: 'sub-list-page',
        loadChildren: () => import('../sub-list-page/sub-list-page.module').then(m => m.SubListPagePageModule)
      },
      {
        path: 'poem-detail',
        loadChildren: () => import('../poem-detail/poem-detail.module').then(m => m.PoemDetailPageModule)
      },
      {
        path: '',
        //redirectTo: '/tabs/home',
        redirectTo: '/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    //redirectTo: '/tabs/home',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
