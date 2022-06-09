import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PoemDetailPageRoutingModule } from './poem-detail-routing.module';
import { PoemDetailPage } from './poem-detail.page';
//import { PlaymusicComponent } from "../components/playmusic/playmusic.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PoemDetailPageRoutingModule
  ],
  declarations: [PoemDetailPage]//,PlaymusicComponent::PUT IT HERE WHEN ENABLE PlaymusicComponent
})
export class PoemDetailPageModule {}
