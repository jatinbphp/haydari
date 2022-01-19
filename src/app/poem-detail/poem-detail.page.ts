import { Component } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ClientService } from '../providers/client.service';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-poem-detail',
  templateUrl: './poem-detail.page.html',
  styleUrls: ['./poem-detail.page.scss'],
})

export class PoemDetailPage 
{
  public user_id:any='';
  public poem_id:any='';
  public from_page:any='';
  public queryStringData: any=[];
  private mediaFile: MediaObject;
  private mediaFileCurrentPosition:any='';
  public isAudioPlayed: boolean = false;
  public resultPoemsDetailObject:any=[];
  public resultPoemsDetail:any=[];
  public poemsLine:any=[];
  public resultPoemsForBookmark:any=[];
  public resultPoem
  public MP3Link:string='';

  constructor(private inAppBrowser: InAppBrowser, public client: ClientService, private media: Media, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private route: ActivatedRoute, private router: Router)
  { 
    //this.mediaFile = this.media.create('https://haydari.ecnetsolutions.dev/uploads/mp3File/1639467512azan1.mp3');
  }

  ngOnInit()
  {}

  async ionViewWillEnter()
  {
    this.user_id=localStorage.getItem('id');
    this.poem_id='';
    this.from_page='';
    this.resultPoemsDetailObject=[];
    this.resultPoemsDetail=[];
    this.poemsLine=[];
    
    this.route.queryParams.subscribe(params => 
      {
        if(params && params.special)
        {
          this.queryStringData = JSON.parse(params.special);        
        }
      });
      
      this.poem_id=this.queryStringData['poem_id'];
      this.from_page=this.queryStringData['from_page'];
      //LOADER
      const loadingPoemDetail = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingPoemDetail.present();
      //LOADER
      let objData = {
        poem_id:this.poem_id,
        user_id:this.user_id
      }
      await this.client.getPoemsDetailById(objData).then(result => 
      {	
        loadingPoemDetail.dismiss();//DISMISS LOADER
        this.resultPoemsDetailObject=result;
        this.resultPoemsDetail=this.resultPoemsDetailObject['poemsDetail'][0];
        this.poemsLine=this.resultPoemsDetailObject['poemsLine'];

        if(this.resultPoemsDetailObject['poemsDetail'].length > 0)
        {
          this.MP3Link=(this.resultPoemsDetailObject['poemsDetail'][0]['MP3Link']) ? this.resultPoemsDetailObject['poemsDetail'][0]['MP3Link'] : "";
          this.mediaFile = this.media.create(this.MP3Link);
        }      
        //console.log("MP3Link",this.MP3Link);
        console.log("Object",this.resultPoemsDetailObject);
        console.log("Detail",this.resultPoemsDetail);
        console.log("Lines",this.poemsLine);
      },
      error => 
      {
        loadingPoemDetail.dismiss();//DISMISS LOADER
        console.log();
      });
  }

  playAudio()
  {
    if(this.mediaFileCurrentPosition > 0)
    {
      //console.log("SEEK");
      this.mediaFile.seekTo(this.mediaFileCurrentPosition);
      this.mediaFile.play();
      this.isAudioPlayed=true;
    }
    else 
    {
      //console.log("PLAY");
      this.mediaFile.play();
      this.isAudioPlayed=true;
    }
  }

  pauseAudio()
  {
    //console.log("PAUSE");
    this.mediaFile.pause();    
    this.isAudioPlayed=false;
    this.mediaFile.getCurrentPosition().then((position) => {
      this.mediaFileCurrentPosition = position;
      console.log(this.mediaFileCurrentPosition);
    });
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
  
  async makeBookMarkAtRow(poem_id,poem_line_id,user_id)
  {
    let id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
    if(id!='' && id!='null' && id!=null && id!=undefined && id!='undefined')
    {
      //LOADER
      const loadingPoemBookmark = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingPoemBookmark.present();
      //LOADER

      let objData = {
        poem_id:poem_id,
        poem_line_id:poem_line_id,
        user_id:user_id
      }
      await this.client.poemLineWishlist(objData).then(result => 
      {
        loadingPoemBookmark.dismiss();//DISMISS LOADER
        this.resultPoemsForBookmark=result;	
        if(this.resultPoemsForBookmark.status==true)
        {
          //this.client.showMessage(this.resultPoemsForBookmark.message);
          this.client.showMessage("Poem is bookmarked.<br />\nYou will see this poem on wishlist screen.");
        }
        this.ionViewWillEnter();
        console.log(result);
      },
      error => 
      {
        loadingPoemBookmark.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    else 
    {
      this.client.router.navigate(['login']);  
    }
  }

  openYouTubeURL(targetURL)
  {
    const options : InAppBrowserOptions = {
      location : 'yes',//Or 'no' 
      hidden : 'no', //Or  'yes'
      clearcache : 'yes',
      clearsessioncache : 'yes',
      zoom : 'yes',//Android only ,shows browser zoom controls 
      hardwareback : 'yes',
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
    this.inAppBrowser.create(targetURL,target,options);
  }

  ionViewDidLeave()
  {
    this.mediaFile.release();
  }
  
}
