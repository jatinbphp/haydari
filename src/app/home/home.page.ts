import { Component } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage 
{
  public queryString: any=[];
  public resultPoemTypes:any=[];
  public resultSubjectOccasion:any=[];
  public resultReciters:any=[];
  public resultLanguages:any=[];
  public searched_text:string='';
  constructor(public keyboard:Keyboard, public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  { 
    this.keyboard.hideFormAccessoryBar(false);
  }

  async ngOnInit() 
	{ 
    this.searched_text = '';
    this.menu.enable(true);
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
    await this.client.getPoemTypes().then(result => 
    {	
      loadingPoemType.dismiss();//DISMISS LOADER
      this.resultPoemTypes=result;
      if(this.resultPoemTypes.length > 0)
      {
        for(let p = 0; p < this.resultPoemTypes.length; p ++)
        {
          let PoemTypeName = this.resultPoemTypes[p].PoemTypeName.replace("/ ", "/<br>");
          this.resultPoemTypes[p]['PoemTypeName']=PoemTypeName;
          console.log(PoemTypeName);
        }
      }      
      console.log(this.resultPoemTypes);
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    });
    /*POEM TYPE*/
    /*SUBJECT/OCCASION*/
    //LOADER
		const loadingSubjectOccasion = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingSubjectOccasion.present();
		//LOADER
    await this.client.getSubject().then(result => 
    {	
      loadingSubjectOccasion.dismiss();//DISMISS LOADER
      this.resultSubjectOccasion=result;      
      console.log(this.resultSubjectOccasion);
    },
    error => 
    {
      loadingSubjectOccasion.dismiss();//DISMISS LOADER
      console.log();
    });
    /*SUBJECT/OCCASION*/
    /*RECIETERS*/
    //LOADER
		const loadingReceiters = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingReceiters.present();
		//LOADER
    await this.client.getReciters().then(result => 
    {	
      loadingReceiters.dismiss();//DISMISS LOADER
      this.resultReciters=result;      
      console.log(this.resultReciters);
    },
    error => 
    {
      loadingReceiters.dismiss();//DISMISS LOADER
      console.log();
    });
    /*RECIETERS*/
    /*LANGUAGES*/
    //LOADER
		const loadingLanguages = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingLanguages.present();
		//LOADER
    await this.client.getLanguages().then(result => 
    {	
      loadingLanguages.dismiss();//DISMISS LOADER
      this.resultLanguages=result;      
      console.log(this.resultLanguages);
    },
    error => 
    {
      loadingLanguages.dismiss();//DISMISS LOADER
      console.log();
    });
    /*LANGUAGES*/
  }

  library()
  {
    //BEFORE::this.client.router.navigateByUrl('/tabs/search');
    this.client.router.navigateByUrl('/tabs/home/search');
  }
  
  showPoemByPoemTypeORSubjectOccassion(id,poem_subject_occassion,type)
  {
    this.queryString = 
    {
      poem_subject_occassion_id:id,
      poem_subject_occassion_nm:poem_subject_occassion,
      poem_or_subject_occassion:type
    };

    localStorage.setItem('choosen_option',JSON.stringify(this.queryString));

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    //BEFORE::this.client.router.navigate(['tabs/sub-list-page'], navigationExtras);
    this.client.router.navigate(['tabs/home/sub-list-page'], navigationExtras);
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

  async searchPoem(form)
  {
    this.searched_text = form.controls.search_text.value;    
    this.queryString = 
    {
      searched_text:this.searched_text
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.searched_text = '';
    //BEFORE::this.client.router.navigate(['tabs/search-result'], navigationExtras);
    this.client.router.navigate(['tabs/home/search-result'], navigationExtras);
  }
  
}
