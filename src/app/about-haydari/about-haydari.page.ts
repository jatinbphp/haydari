import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-about-haydari',
  templateUrl: './about-haydari.page.html',
  styleUrls: ['./about-haydari.page.scss'],
})

export class AboutHaydariPage implements OnInit 
{

  constructor(public client: ClientService, public modalCtrl: ModalController)
  { }

  ngOnInit()
  { }

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
}
