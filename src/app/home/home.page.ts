import { Component } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';

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
  constructor(public fb: FormBuilder, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  { }

  async ngOnInit() 
	{ 
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
    this.client.router.navigateByUrl('/tabs/type-views');
  }
  
  showPoemByPoemTypeORSubjectOccassion(id,poem_subject_occassion,type)
  {
    this.queryString = 
    {
      poem_subject_occassion_id:id,
      poem_subject_occassion_nm:poem_subject_occassion,
      poem_or_subject_occassion:type
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['tabs/sub-list-page'], navigationExtras);
    /*
    this.client.router.navigate(['tabs/sub-list-page'], navigationExtras).then(() => 
    {
      window.location.reload();
    });
    */
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
    this.client.router.navigate(['tabs/search-result'], navigationExtras);
  }
  
}
