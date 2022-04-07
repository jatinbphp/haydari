import { Component } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';
import { ProfilePage } from '../profile/profile.page';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-wishlist',
  templateUrl: 'wishlist.page.html',
  styleUrls: ['wishlist.page.scss']
})

export class WishlistPage 
{
  public id: any = '';
  public show_in_view: any = 'list';
  public resultDataBookMark: any=[];
  public limitedResultDataBookMark:any = [];
  public queryString: any=[];
  public order:any='desc';
  constructor(public client: ClientService, public offline: OfflineService, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  {
  }

  async ionViewWillEnter()
  {
    this.id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
    /*
    BELOW PORTION WILL FETCH DATA FROM WEB SERVER AS BECAUSE WE WERE STORING IT ON WEB SERVER BEFORE
    //LOADER
    const loadingPoemType = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingPoemType.present();
    //LOADER
    let objData = 
    {
      user_id:this.id,
      order:this.order,
    }
    await this.client.getBookmarkPoems(objData).then(result => 
    {	
      loadingPoemType.dismiss();//DISMISS LOADER
      this.resultDataBookMark=result;      
      console.log(this.resultDataBookMark);
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    }); 
    BELOW PORTION WILL FETCH DATA FROM WEB SERVER AS BECAUSE WE WERE STORING IT ON WEB SERVER BEFORE
    */
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

    await this.offline.getBookmarks().then(result => 
    {
      loading.dismiss();//DISMISS LOADER
      this.resultDataBookMark=result; 
      this.limitedResultDataBookMark=[];
      if(this.resultDataBookMark.length > 0)
      {
        for(let p = 0 ; p < this.resultDataBookMark.length; p ++)
        {
          let objPoemLimited = {
            arrayIndex:p,
            id:this.resultDataBookMark[p]['id'],
            PoemName:this.resultDataBookMark[p]['PoemName'],
            colorCode:this.resultDataBookMark[p]['colorCode'],
            LanguageName:this.resultDataBookMark[p]['LanguageName'],
            ReciterName:this.resultDataBookMark[p]['ReciterName'],
            PoetName:this.resultDataBookMark[p]['PoetName'],
          }
          this.limitedResultDataBookMark.push(objPoemLimited);
        }
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  async changeOrder(order)
  {
    //this.order = order;
    if(order=="desc")
    {
      this.order="asc";
    }
    if(order=="asc")
    {
      this.order="desc";
    }
    this.ionViewWillEnter();
    
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
  
  getPoemsDetailBefore(id)
  {
    this.queryString = 
    {
      poem_id:id,
      from_page:'wishlist'
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['tabs/wishlist/poem-detail'], navigationExtras);
  }

  getPoemsDetail(arrayIndex)
  {
    let offLinePoem = [];
    offLinePoem = this.resultDataBookMark[arrayIndex];
    localStorage.setItem('read_offline_poem',JSON.stringify(offLinePoem));
    this.client.router.navigate(['/tabs/offline/offline-poem-detail']);
  }
}
