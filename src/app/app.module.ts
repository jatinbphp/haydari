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
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: 
  [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule, 
    IonicModule.forRoot({
      swipeBackEnabled: true // A better spot to set swipe enabled also…
    }), 
    AppRoutingModule
  ],
  providers: 
  [
    HttpClient,
    Media,
    Keyboard,
    InAppBrowser,
    GooglePlus,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
