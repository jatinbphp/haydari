import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SubjectOccasionDetailPage } from '../subject-occasion-detail/subject-occasion-detail.page'

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})

export class SearchPage 
{
  public show_in_view: any = 'list';

  constructor(public modalCtrl: ModalController) {}
  
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
}
