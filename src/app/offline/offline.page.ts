import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
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
  constructor(public client: ClientService, public offline: OfflineService, public loadingCtrl: LoadingController, public alertController: AlertController)
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

  async ConfirmRemovingFromOFFLINE(poem_id)
  {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please confirm:',
      message: 'Are you sure to remove poem?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => 
          {
            console.log('Confirm Cancel: blah');
          }
        }, 
        {
          text: 'Okay',
          handler: () => 
          {
            this.RemoveFromOFFLINE(poem_id);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async RemoveFromOFFLINE(poem_id)
  {
    await this.offline.deleteData(poem_id).then(result => 
    {
      this.client.showMessage("Poem is removed from offline!");
      this.ionViewWillEnter();      
    });
  }
}
