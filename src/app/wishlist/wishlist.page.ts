import { Component } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';

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
  constructor(private media: Media, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
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
    const modal = await this.modalCtrl.create({
			component: ProfilePage,
		});

		return await modal.present();
  }
  
  ionViewDidLeave()
  {
    this.mediaFile.release();
  }
  
}
