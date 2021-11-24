import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent 
{
  public appPages = [
    { title: 'Manqabat', url: '/home', icon: 'home', categories: []},//[0]
    { title: 'Marsiya', url: '/shop', icon: 'search', categories: []},//[1]
    { title: 'Nauha', url: '/cart', icon: 'bag', categories: []},//[2]
    { title: 'Offline', url: '/cart', icon: 'bag', categories: []},//[3]
    { title: 'About', url: '/cart', icon: 'bag', categories: []},//[4]
    { title: 'Profile', url: '/cart', icon: 'bag', categories: []},//[5]
    { title: 'Settings', url: '/cart', icon: 'bag', categories: []},//[6]
  ];
  constructor(public menu: MenuController)
  {}

  closeMenu()
  {
    //this.menu.enable(true);
    this.menu.close();
  }
}
