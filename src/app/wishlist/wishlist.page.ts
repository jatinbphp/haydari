import { Component } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
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
  public queryString: any=[];
  public order:any='asc';
  constructor(public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  {
  }

  async ionViewWillEnter()
  {
    this.id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
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
      user_id:this.id
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
  
  getPoemsDetail(id)
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
}
