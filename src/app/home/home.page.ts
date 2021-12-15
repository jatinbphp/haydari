import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage 
{
  public resultPoemTypes:any=[];
  public resultSubjectOccasion:any=[];
  constructor(public client: ClientService, public loadingCtrl: LoadingController) 
  { }

  async ngOnInit() 
	{ 
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
  }

  library()
  {
    this.client.router.navigateByUrl('/tabs/type-views');
  }
  
  subList()
  {
    this.client.router.navigateByUrl('/tabs/sub-list-page');
  }

}
