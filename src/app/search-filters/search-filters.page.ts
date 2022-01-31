import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.page.html',
  styleUrls: ['./search-filters.page.scss'],
})

export class SearchFiltersPage implements OnInit 
{

  constructor(public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  { }

  ngOnInit()
  { }

  dismissModal()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  }  
}
