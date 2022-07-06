import { Component, NgZone } from '@angular/core';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { ClientService } from './providers/client.service';
import { Router, NavigationExtras } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from './profile/profile.page';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent 
{
  public queryString: any=[];
  public resultContributionLinks:any=[];
  public resultPoemTypes:any=[];
  public resultPoemTypesExpandable:any=[];
  public expanded:boolean=false;
  public appPages:any=[];  
  public token: string;
  public is_user_login: boolean = false;
  public is_network_connected: boolean = false;
  public available_network_type:any='';

  //SETUP PUSH
  public device_info: any=[];
  public device_id : any = '';
  public device_type : any = '';
  public device_token : any = '';
  //SETUP PUSH
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
  constructor(public inAppBrowser: InAppBrowser, private platform: Platform, public client: ClientService, public menu: MenuController, public modalCtrl: ModalController, public fb: FormBuilder, private network: Network, private firebaseX: FirebaseX, public zone: NgZone, private deeplinks: Deeplinks, private router: Router)
  {
    this.platform.ready().then(async () => 
    {
      this.device_id = this.client.generateRandomString("50");
      //SETUP PUSH
      this.device_info = localStorage.getItem('device_info');
      this.device_info = (this.device_info) ? JSON.parse(this.device_info) : null;
      await this.firebaseX.getToken().then(token => 
      { 
        this.device_token = token;
        console.log(`The token is ${token}`);
      }).catch(error => 
      {
        console.error('Error getting token', error);
      });
      this.device_type = (this.platform.is("android") == true) ? "android" : "ios";
      if(this.device_info!= null)
      {
        //console.log("Device Info", this.device_info);
        let objDevice = 
        {
          device_id:this.device_info['device_id'],
          device_type:(this.device_type) ? this.device_type : "",
          device_token:(this.device_token) ? this.device_token : "",
        }
        localStorage.setItem('device_info',JSON.stringify(objDevice));
      }
      else 
      {
        let objDevice = 
        {
          device_id:this.device_id,
          device_type:(this.device_type) ? this.device_type : "",
          device_token:(this.device_token) ? this.device_token : "egPakiGwT0Seo0ScYEeMt-:APA91bEEiUfBO2JVdNpgRA8HTUy8AIoBdQeQum82T-D-PQfk7_i2CjmrN3CmhhDIT0uhlQAFXaRf-6RVN9IAFM0L24peh4LcWFi2XcvaFz2Qm2Fes5SlQh_qKqWGHp3aejQEdgB8ZsaF",
        }
        localStorage.setItem('device_info',JSON.stringify(objDevice));
      }
      //SETUP PUSH
      this.network.onDisconnect().subscribe(async () => 
      {
        this.is_network_connected = false;
        localStorage.clear();
        this.client.showMessage('network was disconnected');
        await this.initializeAPP();
        this.client.router.navigate(['/tabs/offline']);
      });
      
      this.network.onConnect().subscribe(async () => 
      {
        this.client.showMessage('network connected!');
        this.is_network_connected = true;
        await this.initializeAPP();
        //this.client.router.navigate(['/tabs/home']);
      });
      await this.initializeAPP();
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

  async checkNetworkType()
  {
    this.available_network_type='';
    this.is_network_connected=false;
    this.available_network_type = (this.network.type!='none') ? this.network.type : null;
    this.is_network_connected = (this.available_network_type != null) ? true : false;
    if(this.is_network_connected == true)
    {
      this.client.publishSomeDataWhenOnLine({
        is_network_connected: true
      });//THIS OBSERVABLE IS USED TO KNOW IF NETWORK CONNECTED THEN RELOAD THE HOME SCREEN 
      this.client.router.navigate(['/tabs/home']);
    }
  }

  async initializeAPP()
  {
    await this.checkNetworkType();
    console.log("Network Type",this.available_network_type);
    console.log("Network Status",this.is_network_connected);
    localStorage.removeItem('is_audio_played');//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.token=localStorage.getItem('token');
    this.appPages=[];
    this.resultContributionLinks=[];
    this.appPages.push({id:0,title:'Home',shouldFunction:0,to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,url: '/tabs/home',is_contribution_link:0});
    //this.is_network_connected = true;//REMOVE THIS LINE WHEN BUILDING APP
    if(this.is_network_connected == true)
    {
      await this.client.getPoemTypes().then(result => 
      {	
        this.resultPoemTypes=result; 
        if(this.resultPoemTypes.length > 0)
        { 
          this.resultPoemTypesExpandable=[];
          for(let p = 0 ; p < this.resultPoemTypes.length; p ++)
          {
            let checkSlashInString = this.resultPoemTypes[p]['PoemTypeName'].replace("/ ", "/");
            let objPoemType = 
            {
              id:this.resultPoemTypes[p]['id'],
              title:checkSlashInString,
              shouldFunction:1,
              to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
              url:'',
              is_contribution_link:0
            }
            let objPoemTypeExpandable = 
            {
              id:this.resultPoemTypes[p]['id'],
              title:checkSlashInString,
              shouldFunction:1,
              to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
              url:'',
              expanded:false,
              is_contribution_link:0
            }
            this.resultPoemTypesExpandable.push(objPoemTypeExpandable);
            this.appPages.push(objPoemType);
          }
          console.log(this.resultPoemTypesExpandable);
        }
      },
      error => 
      {
        console.log();
      });/*POEM TYPE*/
    }
    
    let objOtherAction_1=[
      {
        id:0,
        title:'My Bookmarks',
        shouldFunction:0,
        to_show_when_network_is_on:(this.is_network_connected == true || this.is_network_connected == false) ? 1 : 0,
        url: '/tabs/wishlist',
        is_contribution_link:0
      },
      {
        id:0,
        title:'Submit A Poem',
        shouldFunction:1,
        to_show_when_network_is_on:(this.is_network_connected == true || this.is_network_connected == false) ? 1 : 0,
        url: '',
        is_contribution_link:0
      },
      {
        id:0,
        title:'About',
        shouldFunction:0,
        to_show_when_network_is_on:(this.is_network_connected == true || this.is_network_connected == false) ? 1 : 0,
        url: '/about-haydari',
        is_contribution_link:0
      },
      {
        id:0,
        title:'Profile',
        shouldFunction:1,
        to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
        url: '',
        is_contribution_link:0
      },
      {
        id:0,
        title:'Offline',
        shouldFunction:0,
        to_show_when_network_is_on:(this.is_network_connected == true || this.is_network_connected == false) ? 1 : 0,
        url: '/tabs/offline',
        is_contribution_link:0
      }
    ];
    for(let o = 0 ; o < objOtherAction_1.length; o ++)
    {
      this.appPages.push(objOtherAction_1[o]);
    }
    //CONTRIBUTION LINKS
    await this.client.getContributionLinks().then(result => 
    {	
      this.resultContributionLinks = result;
      if(this.resultContributionLinks.length > 0)
      {
        for(let l = 0; l < this.resultContributionLinks.length; l++)
        {
          let objContributionLinks = {
            id:this.resultContributionLinks[l]['id'],
            title:this.resultContributionLinks[l]['title'],
            shouldFunction:1,
            to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
            url:this.resultContributionLinks[l]['link'],
            is_contribution_link:1
          }
          this.appPages.push(objContributionLinks);
        }
      }
    },
    error => 
    {
      console.log();
    });
    //CONTRIBUTION LINKS
    let objOtherAction_2=[
      {
        id:0,
        title:'Logout',
        shouldFunction:1,
        to_show_when_network_is_on:(this.is_network_connected == true) ? 1 : 0,
        url: '',
        is_contribution_link:0
      }
    ];
    for(let o = 0 ; o < objOtherAction_2.length; o ++)
    {
      this.appPages.push(objOtherAction_2[o]);
    }
    console.log(this.appPages);
    //SETUP PUSH
    this.device_info = localStorage.getItem('device_info');
    this.device_info = (this.device_info) ? JSON.parse(this.device_info) : null;
    //if(this.device_info['device_id']!='' && this.device_info['device_type']!='' && this.device_info['device_token']!='')
    if(this.is_network_connected == true && this.device_info != null)
    {
      let dataToken = {
        device_id:this.device_info['device_id'],
        device_type:this.device_info['device_type'],
        device_token:this.device_info['device_token']
      }
      await this.client.setPushNotificationToken(dataToken).then(result => 
      {},
      error => 
      {
        console.log();
      });
    }
    this.firebaseX.onMessageReceived().subscribe(data => 
    {
      //console.log(`User opened a notification ${data}`);
      let objShowAllOrRecent = 
      {
        selected_option : 'recent'
      }
      localStorage.setItem('show_all_or_recent',JSON.stringify(objShowAllOrRecent));
      this.client.router.navigate(['tabs/home/library']);
    });
    //SETUP PUSH
    //DEEP LINK
    this.deeplinks.route({'/poem-detail/:poem_id':'ResetPasswordPage'}).subscribe(match =>       
    {        
      //console.log('Successfully matched route', match);                
      this.queryString = 
      {
        poem_id:match.$args.poem_id
      };

      let navigationExtras: NavigationExtras = 
      {
        queryParams: 
        {
          special: JSON.stringify(this.queryString)
        }
      };

      this.zone.run(() => 
      {
        this.client.router.navigate(['/poem-detail/:'+match.$args.poem_id], navigationExtras)
      });
    },nomatch => 
    {
      // nomatch.$link - the full link data
      console.log('NoMatch POEM DETAIL = ', nomatch);
    });//POEM DETAIL
    //DEEP LINK
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
    this.menu.close();
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

  OpenContributionURL(contributionURL)
  {
    let targetUrl=contributionURL;
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

  expandPoemTypes()
  {
    this.expanded = !this.expanded;
    return this.expanded;
  }

  Logout()
  {
    this.client.publishSomeDataWhenLogin({
      is_user_login: false
    });//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    //localStorage.clear();
    //this.menu.enable(false);
    this.client.router.navigate(['tabs/home']);
  }
}
