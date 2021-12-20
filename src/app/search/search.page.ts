import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SubjectOccasionDetailPage } from '../subject-occasion-detail/subject-occasion-detail.page'
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})

export class SearchPage 
{
  public show_in_view: any = 'list';

  constructor(public client: ClientService, public modalCtrl: ModalController, public fb: FormBuilder) {}
  
  showGridView()
  {
    this.show_in_view='grid';
  }

  showListView()
  {
    this.show_in_view='list';
  }

  async showSubjectOccasionDetail()
  {
    const modal = await this.modalCtrl.create({
			component: SubjectOccasionDetailPage,
      cssClass: 'subject-occassion-detail',
      showBackdrop: false,
			componentProps: 
			{ 
        id: 1
			}
		});

		return await modal.present();
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
}
