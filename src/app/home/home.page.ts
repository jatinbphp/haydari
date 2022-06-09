import { Component } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { MediaObject } from '@awesome-cordova-plugins/media/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage 
{
  public queryString: any=[];
  public resultAllAndResent:any=[];
  public resultPoemTypes:any=[];
  public resultSubjectOccasion:any=[];
  public resultReciters:any=[];
  public resultLanguages:any=[];
  public searched_text:string='';
  public showAllSubjects:boolean=false;
  public is_network_connected:boolean=false;
  public MP3Link:string='';

  public isAudioPlayedComponent: boolean = false;
  public mediaFileComponent: MediaObject;
  constructor(public keyboard:Keyboard, public fb: FormBuilder, public offline: OfflineService, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
  { 
    this.keyboard.hideFormAccessoryBar(false);
    this.client.getObservableWhenOnLine().subscribe((data) => {
      this.is_network_connected = data.is_network_connected; 
      this.ngOnInit();     
      console.log('Data received', data);
    });//THIS OBSERVABLE IS USED TO KNOW IF NETWORK CONNECTED THEN RELOAD THE HOME SCREEN
  }

  async ngOnInit() 
	{ 
    this.searched_text = '';
    this.menu.enable(true);
    /*ALL/RECENT*/
    //LOADER
		const loadingAllRecent = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingAllRecent.present();
		//LOADER
    await this.client.getAllAndRecent().then(result => 
    {	
      loadingAllRecent.dismiss();//DISMISS LOADER
      this.resultAllAndResent=result;
      console.log(this.resultAllAndResent);
    },
    error => 
    {
      loadingAllRecent.dismiss();//DISMISS LOADER
      console.log();
    });
    /*ALL/RECENT*/
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
    /*
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
    */
    /*RECIETERS*/
    /*LANGUAGES*/
    /*
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
    */
    /*LANGUAGES*/
  }

  async ionViewWillEnter()
  {
    this.MP3Link = localStorage.getItem('MP3LinkComponent');
    await this.offline.getData('SELECT FromTableNM FROM Poems LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("JUST TO INITILIZE TABLE");
    },async (error) => 
    {
      console.log("ERROR-JUST TO INITILIZE TABLE",error);
    });//JUST TO INITILIZE TABLE ONLY
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
  
  showHide()
  {
    this.showAllSubjects = !this.showAllSubjects;
    console.log(this.showAllSubjects);
  }

  showAllOrRecent(asked)
  {
    let objShowAllOrRecent = 
    {
      selected_option : asked
    }
    localStorage.setItem('show_all_or_recent',JSON.stringify(objShowAllOrRecent));
    this.client.router.navigate(['tabs/home/library']);
  }

  async ionViewDidEnter()
  {
    //ALTER TABLE
    await this.offline.getData('SELECT FromTableNM FROM Poems LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("Field exists - 1");
      
      //UPDATE ALL COLUMN VALUE WITH DEFAULT
      let idToExecute_1=['Poems'];
      let queryToExecute_1 = "UPDATE Poems SET FromTableNM = ?";
      await this.offline.updateData(queryToExecute_1,idToExecute_1).then((res) => 
      {
        console.log("Field updated - 1"); 
        //console.log(res);
      }).catch((err) => 
      { 
        console.log(err);
      });
      
    },async (error) => 
    {
      console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `Poems` ADD `FromTableNM` VARCHAR(255) NOT NULL DEFAULT `Poems`').then(resultAlter => 
      {
        console.log("Field altered - 1");
      },error => 
      {
        //COLUMN CREATING ERROR
        console.log("column created 1 error",error);
      });
      
      //UPDATE ALL COLUMN VALUE WITH DEFAULT
      let idToExecute_1=['Poems'];
      let queryToExecute_1 = "UPDATE Poems SET FromTableNM = ?";
      await this.offline.updateData(queryToExecute_1,idToExecute_1).then((res) => 
      { 
        console.log("Field altered updated - 1");
      }).catch((err) => 
      { 
        console.log(err);
      });

    });//TO CHECK COLUMN FromTableNM EXISTS IN Poems table if not then add
    
    //ALTER TABLE FOR MP3 STARTS
    await this.offline.getData('SELECT MP3Link FROM Poems LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("Field exists - 1");
    },async (error) => 
    {
      console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `Poems` ADD `MP3Link` text CHARACTER').then(resultAlter => 
      {
        console.log("Field altered - 1");
      },error => 
      {
        //COLUMN CREATING ERROR
        console.log("column created 1 error",error);
      });
    });//TO CHECK COLUMN MP3Link EXISTS IN Poems table if not then add
    //ALTER TABLE FOR MP3 ENDS

    await this.offline.getData('SELECT FromTableNM FROM bookmarks LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("Field exists - 2");
      
      //UPDATE ALL COLUMN VALUE WITH DEFAULT
      let idToExecute_1=['bookmarks'];
      let queryToExecute_1 = "UPDATE bookmarks SET FromTableNM = ?";
      await this.offline.updateData(queryToExecute_1,idToExecute_1).then((res) => 
      { 
        console.log("Field updated - 2");
        //console.log(res);
      }).catch((err) => 
      { 
        console.log(err);
      });
    },async (error) => 
    {
      console.log("ERROR-2",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `bookmarks` ADD `FromTableNM` VARCHAR(255) NOT NULL DEFAULT `bookmarks`').then(resultAlter => 
      {
        console.log("Field altered - 2");
      },error => 
      {
        //COLUMN CREATING ERROR
        //console.log("column created 2 error",error);
      });

      //UPDATE ALL COLUMN VALUE WITH DEFAULT
      let idToExecute_1=['bookmarks'];
      let queryToExecute_1 = "UPDATE bookmarks SET FromTableNM = ?";
      await this.offline.updateData(queryToExecute_1,idToExecute_1).then((res) => 
      { 
        console.log("Field altered updated - 2");
      }).catch((err) => 
      { 
        console.log(err);
      });
    });//TO CHECK COLUMN FromTableNM EXISTS IN bookmarks table if not then add    
    
    //ALTER TABLE FOR MP3 STARTS
    await this.offline.getData('SELECT MP3Link FROM bookmarks LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("Field exists - 1");
    },async (error) => 
    {
      console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `bookmarks` ADD `MP3Link` VARCHAR(255) NULL').then(resultAlter => 
      {
        console.log("Field altered - 1");
      },error => 
      {
        //COLUMN CREATING ERROR
        console.log("column created 1 error",error);
      });
    });//TO CHECK COLUMN MP3Link EXISTS IN bookmarks table if not then add
    //ALTER TABLE FOR MP3 ENDS
    //ALTER TABLE
    
    await this.offline.getData('SELECT id FROM mediaobject LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("just to initilize table mediaobject");
    },async (error) => 
    {
      console.log("ERROR-just to initilize table mediaobject",error);
      let queryToExecute_1="CREATE TABLE `mediaobject` (id INTEGER PRIMARY KEY AUTOINCREMENT,mediaobject blob)";
      await this.offline.createTable(queryToExecute_1).then(result => 
      {
        console.log("mediaobject table created");
      }).
      catch(err=>
      {
        console.log("error creating table",err);
      });
    });//JUST TO INITILIZE TABLE OR CREATING
    
  }
}
