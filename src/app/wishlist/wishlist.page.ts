import { Component } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: 'wishlist.page.html',
  styleUrls: ['wishlist.page.scss']
})

export class WishlistPage 
{
  private mediaFile: MediaObject;
  private mediaFileCurrentPosition:any='';
  public isAudioPlayed: boolean = false;
  constructor(public client: ClientService, private media: Media, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  {
    this.mediaFile = this.media.create('https://haydari.ecnetsolutions.dev/uploads/mp3File/1639467512azan1.mp3');
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
  
  ionViewDidLeave()
  {
    this.mediaFile.release();
  }
  
}
