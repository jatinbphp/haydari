import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.page.html',
  styleUrls: ['./search-filters.page.scss'],
})

export class SearchFiltersPage implements OnInit 
{
  public resultSubjectOccasion:any=[];
  public resultReciters:any=[];
  public resultPoets:any=[];
  public resultLanguages:any=[];
  public resultPoemTypes:any=[];

  public selectedPoemType:any=[];
  public selectedSubjectOccassion:any=[];
  public selectedLanguage:any=[];
  public selectedReciters:any=[];
  public selectedPoets:any=[];

  public poem_or_subject_occassion:any='';
  public poem_subject_occassion_id:any='';

  constructor(public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navParams: NavParams)
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
    /*POETS*/
    //LOADER
		const loadingPoets = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingPoets.present();
		//LOADER
    await this.client.getPoets().then(result => 
    {	
      loadingPoets.dismiss();//DISMISS LOADER
      this.resultPoets=result;      
      console.log(this.resultPoets);
    },
    error => 
    {
      loadingPoets.dismiss();//DISMISS LOADER
      console.log();
    });
    /*POETS*/
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

  ionViewWillEnter()
  {
    this.poem_or_subject_occassion=this.navParams.get('poem_or_subject_occassion');
    this.poem_subject_occassion_id=this.navParams.get('poem_subject_occassion_id');
  }

  SelectedPoemType(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedPoemType.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedPoemType=this.removeA(this.selectedPoemType,ev.detail.value);
    }
    console.log(this.selectedPoemType);
  }

  SelectedSubOccassion(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedSubjectOccassion.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedSubjectOccassion=this.removeA(this.selectedSubjectOccassion,ev.detail.value);
    }
    console.log(this.selectedSubjectOccassion);
  }

  SelectedLanguage(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedLanguage.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedLanguage=this.removeA(this.selectedLanguage,ev.detail.value);
    }
    console.log(this.selectedLanguage);
  }

  SelectedReciters(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedReciters.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedReciters=this.removeA(this.selectedReciters,ev.detail.value);
    }
    console.log(this.selectedReciters);
  }

  SelectedPoets(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedPoets.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedPoets=this.removeA(this.selectedPoets,ev.detail.value);
    }
    console.log(this.selectedPoets);
  }

  removeA(arr,ax) 
  {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) 
    {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) 
        {
            arr.splice(ax, 1);
        }
    }
    return arr;
  }

  dismissModal()
	{
		let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
      selectedPoemType:this.selectedPoemType.join(","),
      selectedSubjectOccassion:this.selectedSubjectOccassion.join(","),
      selectedLanguage:this.selectedLanguage.join(","),
      selectedReciters:this.selectedReciters.join(","),
      selectedPoets:this.selectedPoets.join(","),
    }

    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }

  searchPoem()
  {
    let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
      selectedPoemType:this.selectedPoemType.join(","),
      selectedSubjectOccassion:this.selectedSubjectOccassion.join(","),
      selectedLanguage:this.selectedLanguage.join(","),
      selectedReciters:this.selectedReciters.join(","),
      selectedPoets:this.selectedPoets.join(","),
    }

    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
    /*
    console.log(SearchType);
    console.log(this.selectedSubjectOccassion);
    console.log(this.selectedLanguage);
    console.log(this.selectedReciters);
    console.log(this.selectedPoets);
    */
  }
}
