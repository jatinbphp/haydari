import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypeViewsPageRoutingModule } from './type-views-routing.module';

import { TypeViewsPage } from './type-views.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TypeViewsPageRoutingModule
  ],
  declarations: [TypeViewsPage]
})
export class TypeViewsPageModule {}
