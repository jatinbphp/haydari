import { Component } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { ClientService } from './providers/client.service';
import { NavigationExtras } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from './profile/profile.page';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';

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
  public is_user_login: boolean = false;
  public is_network_connected: boolean = true;
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
  constructor(public inAppBrowser: InAppBrowser, private platform: Platform, public client: ClientService, public menu: MenuController, public modalCtrl: ModalController, public fb: FormBuilder, private network: Network)
  {
    this.platform.ready().then(async () => 
    {
      let disconnectSubscription = this.network.onDisconnect().subscribe(async () => 
      {
        //console.log('network was disconnected', disconnectSubscription);
        this.client.showMessage('network was disconnected');
        this.is_network_connected = false;
        this.initializeAPP();
        this.client.router.navigate(['/tabs/offline']);
      });
      
      let connectSubscription = this.network.onConnect().subscribe(async () => 
      {
        console.log('network connected!',connectSubscription);
        this.client.showMessage('network connected!');
        this.is_network_connected = true;
        this.initializeAPP();
        this.client.router.navigate(['/tabs/home']);
      });
      this.initializeAPP();
      console.log("Check Network");
    });
    
    /*
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });//PREVENT BACK BUTTON    
    */

    this.client.getObservableWhenLogin().subscribe((data) => {
      this.is_user_login = data.is_user_login;      
      console.log('Data received', data);
    });//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
  }

  async initializeAPP()
  {
    this.token=localStorage.getItem('token');
    this.appPages=[];
    this.appPages.push({id:0,title:'Home',shouldFunction:0,to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,url: '/tabs/home'});
    /*POEM TYPE*/
    await this.client.getPoemTypes().then(result => 
    {	
      this.resultPoemTypes=result; 
      if(this.resultPoemTypes.length > 0)
      { 
        for(let p = 0 ; p < this.resultPoemTypes.length; p ++)
        {
          let checkSlashInString = this.resultPoemTypes[p]['PoemTypeName'].replace("/ ", "/");
          let objPoemType = {
            id:this.resultPoemTypes[p]['id'],
            title:checkSlashInString,
            shouldFunction:1,
            to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
            url:''
          }
          this.appPages.push(objPoemType);
        }
      }
      
    },
    error => 
    {
      console.log();
    });
    /*POEM TYPE*/
    let objOtherAction=[
      {
        id:0,
        title:'My Bookmarks',
        shouldFunction:0,
        to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
        url: '/tabs/wishlist'
      },
      {
        id:0,
        title:'Submit A Poem',
        shouldFunction:1,
        to_show_when_network_is_on:(this.is_network_connected == true || this.is_network_connected == false) ? 1 : 0,
        url: ''
      },
      {
        id:0,
        title:'About',
        shouldFunction:0,
        to_show_when_network_is_on:(this.is_network_connected == true || this.is_network_connected == false) ? 1 : 0,
        url: '/about-haydari'
      },
      {
        id:0,
        title:'Profile',
        shouldFunction:1,
        to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
        url: ''
      },
      {
        id:0,
        title:'Offline',
        shouldFunction:0,
        to_show_when_network_is_on:(this.is_network_connected == false) ? 1 : 0,
        url: '/tabs/offline'
      },/*
      {
        id:0,
        title:'Settings',
        shouldFunction:0,
        url: '/tabs/home'
      },*/
      {
        id:0,
        title:'Logout',
        shouldFunction:1,
        to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
        url: ''
      }
    ];
    for(let o = 0 ; o < objOtherAction.length; o ++)
    {
      this.appPages.push(objOtherAction[o]);
    }
    console.log(this.appPages);
  }

  ngOnInit() 
  {
    /*
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
    */
  }

  closeMenu()
  {
    //this.menu.enable(true);
    this.menu.close();
  }

  showPoemByPoemTypeORSubjectOccassion(id,poem_subject_occassion,type)
  {
    this.client.publishSomeDataWhenPoemTypeClickedFromMenu({
      poem_subject_occassion_id:id,
      poem_subject_occassion_nm:poem_subject_occassion,
      poem_or_subject_occassion:type
    });//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU
    
    this.queryString = 
    {
      poem_subject_occassion_id:id,
      poem_subject_occassion_nm:poem_subject_occassion,
      poem_or_subject_occassion:type
    };

    localStorage.setItem('choosen_option',JSON.stringify(this.queryString));

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    
    //BEFORE::this.client.router.navigate(['tabs/sub-list-page'], navigationExtras);    
    this.client.router.navigate(['tabs/home/sub-list-page'], navigationExtras);
  }

  async showMyProfile()
  {
    let id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
    if(id!='' && id!='null' && id!=null && id!=undefined && id!='undefined')
    {
      const modal = await this.modalCtrl.create({
        component: ProfilePage,
      });

      return await modal.present();
    }
    else 
    {
      this.client.router.navigate(['login']);  
    }
  }

  SubmitAPoem()
  {
    let targetUrl="https://app.thehaydariproject.com/submit-poem";
    const options : InAppBrowserOptions = 
    {
        location : 'no',//Or 'no' 
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'no',//Android only ,shows browser zoom controls 
        hardwareback : 'no',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only 
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only 
        toolbar : 'yes', //iOS only 
        enableViewportScale : 'no', //iOS only 
        allowInlineMediaPlayback : 'no',//iOS only 
        presentationstyle : 'pagesheet',//iOS only 
        fullscreen : 'yes',//Windows only    
    };
    let target = "_system";
    const browser = this.inAppBrowser.create(targetUrl,target,options);
  }

  Logout()
  {
    this.client.publishSomeDataWhenLogin({
      is_user_login: false
    });//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
    localStorage.clear();
    //this.menu.enable(false);
    this.client.router.navigate(['tabs/home']);
  }
}
