import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';

@Component({
  selector: 'app-type-views',
  templateUrl: './type-views.page.html',
  styleUrls: ['./type-views.page.scss'],
})

export class TypeViewsPage implements OnInit 
{

  constructor(private router: Router, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  { }

  ngOnInit()
  { }

  home() 
  {
  	this.router.navigateByUrl('/tabs/home');
  }

  async showMyProfile()
  {
    const modal = await this.modalCtrl.create({
			component: ProfilePage,
		});

		return await modal.present();
  }
}
