import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SubjectOccasionDetailPage } from '../subject-occasion-detail/subject-occasion-detail.page'

@Component({
  selector: 'app-sub-list-page',
  templateUrl: './sub-list-page.page.html',
  styleUrls: ['./sub-list-page.page.scss'],
})

export class SubListPagePage implements OnInit 
{
  public show_in_view: any = 'list';
  constructor(public modalCtrl: ModalController)
  { }

  ngOnInit()
  { }
  
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
