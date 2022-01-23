import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { SubjectOccasionDetailPage } from '../subject-occasion-detail/subject-occasion-detail.page'
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

@Component({
  selector: 'app-sub-list-page',
  templateUrl: './sub-list-page.page.html',
  styleUrls: ['./sub-list-page.page.scss'],
})

export class SubListPagePage implements OnInit 
{
  public queryString: any=[];
  public queryStringData: any=[];
  public show_in_view: any = 'list';
  public poem_subject_occassion_id:any = '';
  public poem_subject_occassion_nm:any = '';
  public poem_or_subject_occassion:any = '';
  public resultPoemsByTypeORSubject:any=[];
  public order:any='desc';
  public is_search_icon_clicked:boolean=false;
  public is_searched:boolean=false;
  public searched_text:any='';
  
  constructor(public keyboard:Keyboard, public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private route: ActivatedRoute, private router: Router)
  { 
    this.keyboard.hideFormAccessoryBar(false);
    this.client.getObservableWhenPoemTypeClickedFromMenu().subscribe(async (data) => 
    {
      console.log(data);
      this.poem_subject_occassion_id=data.poem_subject_occassion_id;
      this.poem_subject_occassion_nm=data.poem_subject_occassion_nm.replace("/ ", "/");
      this.poem_or_subject_occassion=data.poem_or_subject_occassion;
      this.resultPoemsByTypeORSubject = [];
      /*POEM TYPE*/
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
      if(this.poem_or_subject_occassion=="by_poem_type")
      {
        let objData = 
        {
          poem_subject_occassion_id:this.poem_subject_occassion_id
        }
        await this.client.getPoemsByPoemType(objData).then(result => 
        {	
          loadingPoemType.dismiss();//DISMISS LOADER
          this.resultPoemsByTypeORSubject=result;      
          console.log(this.resultPoemsByTypeORSubject);
        },
        error => 
        {
          loadingPoemType.dismiss();//DISMISS LOADER
          console.log();
        });
      }
      if(this.poem_or_subject_occassion=="by_subject_occassion")
      {
        let objData = 
        {
          poem_subject_occassion_id:this.poem_subject_occassion_id
        }
        await this.client.getPoemsBySubject(objData).then(result => 
        {	
          loadingPoemType.dismiss();//DISMISS LOADER
          this.resultPoemsByTypeORSubject=result;      
          console.log(this.resultPoemsByTypeORSubject);
        },
        error => 
        {
          loadingPoemType.dismiss();//DISMISS LOADER
          console.log();
        });
      }
      /*POEM TYPE*/
    });//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU
  }

  ngOnInit()
  { }
  
  async ionViewWillEnter()
  {
    this.searched_text='';
    this.is_searched=false;
    this.poem_subject_occassion_id='';
    this.poem_subject_occassion_nm='';
    this.poem_or_subject_occassion='';
    this.resultPoemsByTypeORSubject = [];
    
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    
    this.poem_subject_occassion_id=this.queryStringData['poem_subject_occassion_id'];
    this.poem_subject_occassion_nm=this.queryStringData['poem_subject_occassion_nm'].replace("/ ", "/");
    this.poem_or_subject_occassion=this.queryStringData['poem_or_subject_occassion'];

    /*POEM TYPE*/
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
    if(this.poem_or_subject_occassion=="by_poem_type")
    {
      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order
      }
      await this.client.getPoemsByPoemType(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    if(this.poem_or_subject_occassion=="by_subject_occassion")
    {
      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order
      }
      await this.client.getPoemsBySubject(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    /*POEM TYPE*/
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
    //BEFORE::this.client.router.navigate(['tabs/poem-detail'], navigationExtras);
    this.client.router.navigate(['tabs/home/sub-list-page/poem-detail'], navigationExtras);
  }

  async changeOrder(order,poem_or_subject_occassion)
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
    console.log(this.order);
    if(poem_or_subject_occassion=="by_poem_type")
    {
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
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:this.searched_text
      }
      await this.client.getPoemsByPoemType(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    if(poem_or_subject_occassion=="by_subject_occassion")
    {
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
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:this.searched_text
      }
      await this.client.getPoemsBySubject(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
  }
  
  showHideSearchBar()
  {
    this.is_search_icon_clicked = !this.is_search_icon_clicked;    
  }

  async searchPoem(form)
  {
    let searched_text = form.controls.search_text.value; 
    this.searched_text = (searched_text) ? searched_text : '';   
    this.is_searched = true;
    this.resultPoemsByTypeORSubject=[];
    /*POEM TYPE*/
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
    if(this.poem_or_subject_occassion=="by_poem_type")
    {
      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:searched_text
      }
      await this.client.getPoemsByPoemType(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    if(this.poem_or_subject_occassion=="by_subject_occassion")
    {
      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:searched_text
      }
      await this.client.getPoemsBySubject(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    /*POEM TYPE*/
  }

  resetSearch()
  {
    this.searched_text='';
    this.is_searched=false;
    this.ionViewWillEnter();
  }

  ionViewDidLeave()
  {
    this.searched_text='';
    this.is_searched=false;
  }
}
