import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchFiltersPageRoutingModule } from './search-filters-routing.module';

import { SearchFiltersPage } from './search-filters.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchFiltersPageRoutingModule
  ],
  declarations: [SearchFiltersPage]
})
export class SearchFiltersPageModule {}
