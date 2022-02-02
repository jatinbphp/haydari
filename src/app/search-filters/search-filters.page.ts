import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { FormBuilder } from '@angular/forms';

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

  public searched_filters:any=[];

  public poem_or_subject_occassion:any='';
  public poem_subject_occassion_id:any='';

  public loginForm = this.fb.group({
		subject_occassion: [''],
		poem_type: [''],
    languages: [''],
    reciters: [''],
    poets: [''],
    translated: [''],
	});

  constructor(public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navParams: NavParams)
  { }

  async ngOnInit()
  { 
    //INITILIZE SEARCH FIELDS
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters'));
    if(this.searched_filters)
    {
      let translated = (this.searched_filters['translated']) ? this.searched_filters['translated'] : "";
      this.loginForm.controls['translated'].setValue(translated);
    }
    console.log("SEARCHED FILTERS",this.searched_filters);
    //INITILIZE SEARCH FIELDS

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
      //loadingPoemType.dismiss();//DISMISS LOADER
      this.resultPoemTypes=result;
      console.log(this.resultPoemTypes);
      if(this.searched_filters)
      {
        let selectedPoemType = (this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "";
        this.loginForm.controls['poem_type'].setValue(selectedPoemType);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    });
    /*POEM TYPE*/
    /*SUBJECT/OCCASION*/
    //LOADER
		/*
    const loadingSubjectOccasion = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingSubjectOccasion.present();
		*/
    //LOADER
    await this.client.getSubject().then(result => 
    {	
      //loadingSubjectOccasion.dismiss();//DISMISS LOADER
      this.resultSubjectOccasion=result;      
      console.log(this.resultSubjectOccasion);
      if(this.searched_filters)
      {
        let selectedSubjectOccassion = (this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "";
        this.loginForm.controls['subject_occassion'].setValue(selectedSubjectOccassion);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      //loadingSubjectOccasion.dismiss();//DISMISS LOADER
      console.log();
    });
    /*SUBJECT/OCCASION*/
    /*RECIETERS*/
    //LOADER
		/*
    const loadingReceiters = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingReceiters.present();
		*/
    //LOADER
    await this.client.getReciters().then(result => 
    {	
      //loadingReceiters.dismiss();//DISMISS LOADER
      this.resultReciters=result;
      console.log(this.resultReciters);
      if(this.searched_filters)
      {
        let selectedReciters = (this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "";
        this.loginForm.controls['reciters'].setValue(selectedReciters);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      //loadingReceiters.dismiss();//DISMISS LOADER
      console.log();
    });
    /*RECIETERS*/
    /*POETS*/
    //LOADER
		/*
    const loadingPoets = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingPoets.present();
		*/
    //LOADER
    await this.client.getPoets().then(result => 
    {	
      //loadingPoets.dismiss();//DISMISS LOADER
      this.resultPoets=result;      
      console.log(this.resultPoets);
      if(this.searched_filters)
      {
        let selectedPoets = (this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "";
        this.loginForm.controls['poets'].setValue(selectedPoets);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      //loadingPoets.dismiss();//DISMISS LOADER
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    });
    /*POETS*/
    /*LANGUAGES*/
    //LOADER
		/*
    const loadingLanguages = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingLanguages.present();
		*/
    //LOADER
    await this.client.getLanguages().then(result => 
    {	
      //loadingLanguages.dismiss();//DISMISS LOADER
      loadingPoemType.dismiss();//DISMISS LOADER
      this.resultLanguages=result;      
      console.log(this.resultLanguages);
      if(this.searched_filters)
      {
        let selectedLanguage = (this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "";
        this.loginForm.controls['languages'].setValue(selectedLanguage);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      //loadingLanguages.dismiss();//DISMISS LOADER
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
    console.log(ev);
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

  dismissFilterModal()
  {
    let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters'));
    let selectedSubjectOccassion='';
    let selectedPoemType = '';
    let selectedLanguage = '';
    let selectedReciters = '';
    let selectedPoets = '';
    let translated = '';
    if(this.searched_filters)
    {
      selectedSubjectOccassion = (this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "";
      selectedPoemType = (this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "";
      selectedLanguage = (this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "";
      selectedReciters = (this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "";
      selectedPoets = (this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "";
      translated = (this.searched_filters['translated']) ? this.searched_filters['translated'] : "";
    }
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
      selectedPoemType:selectedPoemType,
      selectedSubjectOccassion:selectedSubjectOccassion,
      selectedLanguage:selectedLanguage,
      selectedReciters:selectedReciters,
      selectedPoets:selectedPoets,
      translated:translated
    }

    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }

  applyFilters(form)
  {
    let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
      selectedPoemType:(form.poem_type) ? form.poem_type.join(",") : "",
      selectedSubjectOccassion:(form.subject_occassion) ? form.subject_occassion.join(",") : "",
      selectedLanguage:(form.languages) ? form.languages.join(",") : "",
      selectedReciters:(form.reciters) ? form.reciters.join(",") : "",
      selectedPoets:(form.poets) ? form.poets.join(",") : "",
      translated:(form.translated) ? form.translated : ""
    }
    localStorage.setItem('searched_filters',JSON.stringify(dataToSearch));
    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }

  clearAppliedFilters()
  {
    this.loginForm.reset();
    localStorage.removeItem('searched_filters');
    let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
      selectedPoemType:"",
      selectedSubjectOccassion:"",
      selectedLanguage:"",
      selectedReciters:"",
      selectedPoets:"",
      translated:""
    }

    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }
}
