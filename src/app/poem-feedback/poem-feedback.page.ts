import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-poem-feedback',
  templateUrl: './poem-feedback.page.html',
  styleUrls: ['./poem-feedback.page.scss'],
})

export class PoemFeedbackPage implements OnInit 
{
  public user_id:any='';
  public poem_id:any='';
  public queryStringData: any=[];
  public resultPoemsDetailObject:any=[];
  public resultPoemsDetail:any=[];
  public poemsLine:any=[];
  public ngFormSuggestion:any=[];
  constructor(public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private route: ActivatedRoute, private router: Router)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    this.user_id=localStorage.getItem('id');
    this.poem_id='';
    this.resultPoemsDetailObject=[];
    this.resultPoemsDetail=[];
    this.poemsLine=[];
    this.ngFormSuggestion=[];
    
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    
    this.poem_id=this.queryStringData['poem_id'];
    //LOADER
    const loadingPoemDetail = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingPoemDetail.present();
    //LOADER
    let objData = {
      poem_id:this.poem_id,
      user_id:this.user_id
    }
    await this.client.getPoemsDetailById(objData).then(result => 
    {	
      loadingPoemDetail.dismiss();//DISMISS LOADER
      this.resultPoemsDetailObject=result;
      this.resultPoemsDetail=this.resultPoemsDetailObject['poemsDetail'][0];
      this.poemsLine=this.resultPoemsDetailObject['poemsLine'];
      //console.log("MP3Link",this.MP3Link);
      //console.log("Object",this.resultPoemsDetailObject);
      //console.log("Detail",this.resultPoemsDetail);
      console.log("Lines",this.poemsLine);
    },
    error => 
    {
      loadingPoemDetail.dismiss();//DISMISS LOADER
      console.log();
    });

    if(this.poemsLine.length > 0)
    {
      for(let i = 0; i < this.poemsLine.length; i ++)
      {
        let ObjSuggestion = 
        {
          array_index: i,
          row_id : this.poemsLine[i]['id'],
          poem_id : this.poemsLine[i]['PoemID'],
          suggested_text: this.poemsLine[i]['TranslatedText'],
          is_suggested_text_updated: false,
        }
        this.ngFormSuggestion.push(ObjSuggestion);
      }
    }
  }

  SaveSuggestion(form: NgForm)
  {
    let array_index = form.controls.array_index.value;
    let row_id = form.controls.row_id.value;
    let poem_id = form.controls.poem_id.value;
    let suggested_text = form.controls.suggested_text.value;
    this.ngFormSuggestion[array_index]['is_suggested_text_updated']=true;
    console.log(array_index);
    console.log(row_id);
    console.log(poem_id);
    console.log(suggested_text);
  }
}
