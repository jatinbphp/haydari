import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { OfflineService } from '../providers/offline.service';

@Component({
  selector: 'app-offline-poem-detail',
  templateUrl: './offline-poem-detail.page.html',
  styleUrls: ['./offline-poem-detail.page.scss'],
})

export class OfflinePoemDetailPage implements OnInit 
{
  public resultPoemsDetail:any=[];
  public resultPoemsDetailLines:any=[];
  constructor(public offline: OfflineService, public loadingCtrl: LoadingController)
  {}

  ngOnInit()
  {}

  async ionViewWillEnter()
  {
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
    this.resultPoemsDetail=(localStorage.getItem('read_offline_poem')) ? JSON.parse(localStorage.getItem('read_offline_poem')) : [];
    this.resultPoemsDetailLines=JSON.parse(this.resultPoemsDetail['poemsLine']);
    loadingPoemDetail.dismiss();//DISMISS LOADER
  }
}
