import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit 
{
  public queryString: any=[];
  public showAllOrRecent:any=[];
  public resultData:any=[];
  public showingOfResult:any='';
  public numberOfRecords:number=0;
  public order_for_all:any='asc';
  public order_for_recent:any='desc';
  public order:any='';
  public keyword:any='';
  public is_searched:boolean=false;
  public show_in_view: any = 'list';
  constructor(public client: ClientService, private router: Router, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter() 
  {
    this.showAllOrRecent = localStorage.getItem('show_all_or_recent');
    this.showAllOrRecent = (this.showAllOrRecent) ? JSON.parse(this.showAllOrRecent) : [];
    this.showingOfResult = (this.showAllOrRecent['selected_option']=='all') ? "All Poems" : "Recently Added";
    this.order = (this.showAllOrRecent['selected_option']=='all') ? "asc" : "desc";
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
    let data = {
      filterType:this.showAllOrRecent['selected_option'].toUpperCase(),
      order:this.order,
      keyword:this.keyword
    }
    await this.client.getAllOrRecentRequested(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result['poemsData'];  
      this.numberOfRecords=result['totalPoems'];      
      
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  showGridView()
  {
    this.show_in_view='grid';
  }

  showListView()
  {
    this.show_in_view='list';
  }

  async changeOrder(order)
  {
    if(order=="desc")
    {
      this.order="asc";
    }
    if(order=="asc")
    {
      this.order="desc";
    }
    console.log(this.order);
    this.resultData=[];
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
    let data = {
      filterType:this.showAllOrRecent['selected_option'].toUpperCase(),
      order:this.order,
      keyword:this.keyword
    }
    await this.client.getAllOrRecentRequested(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result['poemsData'];  
      this.numberOfRecords=result['totalPoems'];      
      
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
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
      poem_id:id
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['tabs/home/library/poem-detail'], navigationExtras);
  }

  async searchPoem(form)
  {
    this.keyword = form.controls.keyword.value;
    this.is_searched = true;
    this.resultData=[];
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
    let data = {
      filterType:this.showAllOrRecent['selected_option'].toUpperCase(),
      order:this.order,
      keyword:this.keyword
    }
    await this.client.getAllOrRecentRequested(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result['poemsData'];  
      this.numberOfRecords=result['totalPoems'];      
      
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  resetSearch()
  {
    this.keyword = '';
    this.is_searched = false;
    this.ionViewWillEnter();
  }
}
