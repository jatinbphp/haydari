import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ClientService } from './providers/client.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent 
{
  public resultPoemTypes:any=[];
  public appPages:any=[];
  /*
  public appPages = [
    { title: 'Manqabat', url: '/tabs/sub-list-page', icon: 'home', categories: []},//[0]
    { title: 'Marsiya', url: '/tabs/sub-list-page', icon: 'search', categories: []},//[1]
    { title: 'Nauha', url: '/tabs/sub-list-page', icon: 'bag', categories: []},//[2]
    { title: 'Offline', url: '/tabs/home', icon: 'bag', categories: []},//[3]
    { title: 'About', url: '/tabs/home', icon: 'bag', categories: []},//[4]
    { title: 'Profile', url: '/profile', icon: 'bag', categories: []},//[5]
    { title: 'Settings', url: '/tabs/home', icon: 'bag', categories: []},//[6]
  ];
  */
  constructor(public client: ClientService, public menu: MenuController)
  {
    /*POEM TYPE*/
    this.client.getPoemTypes().then(result => 
    {	
      this.resultPoemTypes=result; 
      if(this.resultPoemTypes.length > 0)
      {
        for(let p = 0 ; p < this.resultPoemTypes.length; p ++)
        {
          let objPoemType = {
            title:this.resultPoemTypes[p]['PoemTypeName'],
            shouldFunction:1,
            url:''
          }
          this.appPages.push(objPoemType);
        }
      }
      let objOtherAction=[
        {
          title:'Offline',
          shouldFunction:0,
          url: '/tabs/home'
        },
        {
          title:'About',
          shouldFunction:0,
          url: '/tabs/home'
        },
        {
          title:'Profile',
          shouldFunction:0,
          url: '/profile'
        },
        {
          title:'Settings',
          shouldFunction:0,
          url: '/tabs/home'
        }
      ];
      for(let o = 0 ; o < objOtherAction.length; o ++)
      {
        this.appPages.push(objOtherAction[o]);
      }
      console.log(this.appPages);
    },
    error => 
    {
      console.log();
    });
    /*POEM TYPE*/
  }

  closeMenu()
  {
    //this.menu.enable(true);
    this.menu.close();
  }
}
