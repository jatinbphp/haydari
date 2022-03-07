import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
})

export class OfflinePage implements OnInit 
{
  public resultPoemOffline:any = [];
  public limitedResultPoemOffline:any = [];
  constructor(public client: ClientService, public offline: OfflineService, public loadingCtrl: LoadingController)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    //LOADER
    const loading = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    //LOADER

    await this.offline.getPoems().then(result => 
    {
      loading.dismiss();//DISMISS LOADER
      this.resultPoemOffline=result; 
      console.log("OFFLINE POEMS",this.resultPoemOffline);
      this.limitedResultPoemOffline=[];
      if(this.resultPoemOffline.length > 0)
      {
        for(let p = 0 ; p < this.resultPoemOffline.length; p ++)
        {
          let objPoemLimited = {
            arrayIndex:p,
            id:this.resultPoemOffline[p]['id'],
            PoemName:this.resultPoemOffline[p]['PoemName'],
            colorCode:this.resultPoemOffline[p]['colorCode'],
            LanguageName:this.resultPoemOffline[p]['LanguageName'],
            ReciterName:this.resultPoemOffline[p]['ReciterName'],
            PoetName:this.resultPoemOffline[p]['PoetName'],
          }
          this.limitedResultPoemOffline.push(objPoemLimited);
        }
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  getPoemsDetail(arrayIndex)
  {
    let offLinePoem = [];
    offLinePoem = this.resultPoemOffline[arrayIndex];
    localStorage.setItem('read_offline_poem',JSON.stringify(offLinePoem));
    this.client.router.navigate(['/tabs/offline/offline-poem-detail']);
  }
}
