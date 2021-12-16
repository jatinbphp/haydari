import { Component } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { ClientService } from './providers/client.service';
import { NavigationExtras } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from './profile/profile.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent 
{
  public queryString: any=[];
  public resultPoemTypes:any=[];
  public appPages:any=[];
  public token: string;
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
  constructor(public client: ClientService, public menu: MenuController, public modalCtrl: ModalController, public fb: FormBuilder)
  {
    this.token=localStorage.getItem('token');
    /*POEM TYPE*/
    this.client.getPoemTypes().then(result => 
    {	
      this.resultPoemTypes=result; 
      if(this.resultPoemTypes.length > 0)
      {
        for(let p = 0 ; p < this.resultPoemTypes.length; p ++)
        {
          let objPoemType = {
            id:this.resultPoemTypes[p]['id'],
            title:this.resultPoemTypes[p]['PoemTypeName'],
            shouldFunction:1,
            url:''
          }
          this.appPages.push(objPoemType);
        }
      }
      let objOtherAction=[
        {
          id:0,
          title:'Offline',
          shouldFunction:0,
          url: '/tabs/home'
        },
        {
          id:0,
          title:'About',
          shouldFunction:0,
          url: '/tabs/home'
        },
        {
          id:0,
          title:'Profile',
          shouldFunction:1,
          url: ''
        },
        {
          id:0,
          title:'Settings',
          shouldFunction:0,
          url: '/tabs/home'
        },
        {
          id:0,
          title:'Logout',
          shouldFunction:1,
          url: ''
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

  ngOnInit() 
  {
    if(this.token!='' && this.token!='null' && this.token!=null && this.token!=undefined && this.token!='undefined')
    {
      this.menu.enable(true);
      this.client.router.navigate(['tabs/home']);
    }
    else 
    {
      this.menu.enable(false);
      this.client.router.navigate(['login']);
    }
  }

  closeMenu()
  {
    //this.menu.enable(true);
    this.menu.close();
  }

  showPoemByPoemTypeORSubjectOccassion(id,poem_subject_occassion,type)
  {
    this.queryString = 
    {
      poem_subject_occassion_id:id,
      poem_subject_occassion_nm:poem_subject_occassion,
      poem_or_subject_occassion:type
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    //this.client.router.navigate(['tabs/sub-list-page'], navigationExtras);
    
    this.client.router.navigate(['tabs/sub-list-page'], navigationExtras).then(() => 
    {
      window.location.reload();
    });
    
  }

  async showMyProfile()
  {
    const modal = await this.modalCtrl.create({
			component: ProfilePage,
		});

		return await modal.present();
  }

  Logout()
  {
    localStorage.clear();
    this.menu.enable(false);
    this.client.router.navigate(['login']);
  }
}
