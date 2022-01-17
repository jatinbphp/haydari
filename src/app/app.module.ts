import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: 
  [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule, 
    IonicModule.forRoot(), 
    AppRoutingModule
  ],
  providers: 
  [
    HttpClient,
    Media,
    Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
