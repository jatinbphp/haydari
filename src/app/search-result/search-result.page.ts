import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { SubjectOccasionDetailPage } from '../subject-occasion-detail/subject-occasion-detail.page';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})

export class SearchResultPage implements OnInit 
{
  public show_in_view: any = 'list';
  public resultSearchResult:any=[];
  public queryString: any=[];
  public queryStringData: any=[];
  public searched_text:any='';
  public is_search_icon_clicked:boolean=false;

  constructor(public client: ClientService, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private route: ActivatedRoute, private router: Router)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter() 
  {
    //IF SEARCHED THEN SHOW RESULT
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    this.searched_text=(this.queryStringData['searched_text']) ? this.queryStringData['searched_text'] : "Search Poem";
    if(this.searched_text!='' && this.searched_text!=null && this.searched_text!=undefined && this.searched_text!='null' && this.searched_text!='undefined')
    {
      this.resultSearchResult=[];
      //LOADER
      const loadingSearch = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingSearch.present();
      //LOADER
      let dataToPost = {
        keyword:this.searched_text
      }
      await this.client.searchPoems(dataToPost).then(searchResult => 
      {	
        loadingSearch.dismiss();//DISMISS LOADER
        this.resultSearchResult=searchResult;
        console.log("SEARCH RESULT",this.resultSearchResult);
      },
      error => 
      {
        loadingSearch.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    //IF SEARCHED THEN SHOW RESULT
  }

  async searchPoem(form)
  {
    let searched_text = form.controls.search_text.value;
    this.queryString = 
    {
      searched_text:searched_text
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['tabs/search-result'], navigationExtras).then(()=>{
      window.location.reload();
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
    this.client.router.navigate(['tabs/poem-detail'], navigationExtras);
  }

  showHideSearchBar()
  {
    this.is_search_icon_clicked = !this.is_search_icon_clicked;    
  }
}
