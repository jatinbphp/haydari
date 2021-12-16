import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit 
{

  constructor(private router: Router, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  { }

  ngOnInit()
  { }

  typeViews() 
  {
  	this.router.navigateByUrl('/type-views');
  }

  async showMyProfile()
  {
    const modal = await this.modalCtrl.create({
			component: ProfilePage,
		});

		return await modal.present();
  }

}
