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
  public resultPoemBookMarked:any = [];
  public limitedResultBookMarked:any = [];

  public ResultUnique:any = [];
  public LimitedResultUnique:any = [];

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
      //console.log("OFFLINE POEMS",this.resultPoemOffline);
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

    await this.offline.getBookmarks().then(result => 
    {
      loading.dismiss();//DISMISS LOADER
      this.resultPoemBookMarked=result; 
      //console.log("OFFLINE POEMS",this.resultPoemBookMarked);
      this.limitedResultBookMarked=[];
      if(this.resultPoemBookMarked.length > 0)
      {
        for(let p = 0 ; p < this.resultPoemBookMarked.length; p ++)
        {
          let objPoemLimited = {
            arrayIndex:p,
            id:this.resultPoemBookMarked[p]['id'],
            PoemName:this.resultPoemBookMarked[p]['PoemName'],
            colorCode:this.resultPoemBookMarked[p]['colorCode'],
            LanguageName:this.resultPoemBookMarked[p]['LanguageName'],
            ReciterName:this.resultPoemBookMarked[p]['ReciterName'],
            PoetName:this.resultPoemBookMarked[p]['PoetName'],
          }
          this.limitedResultBookMarked.push(objPoemLimited);
        }
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });

    await this.CheckAndRemoveDuplicates();
  }

  async CheckAndRemoveDuplicates()
  {
    for (var i = 0, len = this.resultPoemOffline.length; i < len; i++) 
    { 
      for (var j = 0, len2 = this.resultPoemBookMarked.length; j < len2; j++) 
      { 
        if (this.resultPoemOffline[i].id === this.resultPoemBookMarked[j].id)
        {
          this.resultPoemBookMarked.splice(j, 1);
          len2=this.resultPoemBookMarked.length;
        } 
      }
    }
    Array.prototype.push.apply(this.resultPoemOffline,this.resultPoemBookMarked);
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
    
    
    /*
    var a = [{'name':'bob', 'age':22}, {'name':'alice', 'age':12}, {'name':'mike', 'age':13}];
    var b = [{'name':'bob', 'age':62}, {'name':'kevin', 'age':32}, {'name':'alice', 'age':32}];

    function remove_duplicates(a, b) {
        let c = [];
        for (var i = 0, len = a.length; i < len; i++) { 
            for (var j = 0, len2 = b.length; j < len2; j++) { 
                if (a[i].name === b[j].name) {
                    b.splice(j, 1);
                    len2=b.length;
                      
                }
                
            }
        }
        Array.prototype.push.apply(a,b);
        console.log(a);

    }
    remove_duplicates(a,b);
    */
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
