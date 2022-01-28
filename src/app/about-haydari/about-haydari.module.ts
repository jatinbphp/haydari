import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutHaydariPageRoutingModule } from './about-haydari-routing.module';

import { AboutHaydariPage } from './about-haydari.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutHaydariPageRoutingModule
  ],
  declarations: [AboutHaydariPage]
})
export class AboutHaydariPageModule {}
