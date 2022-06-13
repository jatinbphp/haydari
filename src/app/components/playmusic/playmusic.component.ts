import { Component, NgZone, OnChanges, Input } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { NavigationExtras } from '@angular/router';
import { ClientService } from '../../providers/client.service';
import { OfflineService } from '../../providers/offline.service';

@Component({
  selector: 'app-playmusic',
  templateUrl: './playmusic.component.html',
  styleUrls: ['./playmusic.component.scss'],
})

export class PlaymusicComponent implements OnChanges 
{
  @Input("MP3ToPlay") MP3ToPlay: any = '';
  public queryString: any=[];
  public mediaFileComponent: MediaObject;
  public mediaFileCurrentPositionComponent:any='';
  public mediaFileCurrentPositionStartedAtComponent:any='';
  public mediaFileCurrentPlayingPositionComponent:number=0;
  public mediaFileCurrentPlayingDurationComponent:number=0;
  public isAudioPlayedComponent: boolean = false;
  public is_audio_played:boolean = false;
  public MP3LinkComponent:any='';
  public MP3LinkComponentTemp:any='';
  public playAudioObservable:any='';
  
  constructor(private mediaComponenet: Media,public client: ClientService, public offline: OfflineService, public zone: NgZone)
  {
    this.client.getObservableWhenAudioPlayed().subscribe((data) => {
      this.isAudioPlayedComponent = data.isAudioPlayedComponent; 
      this.mediaFileComponent = data.mediaFileComponent;  
      console.log('Data received', data); 
      //INSERT OBJECT INTO TABLE      
      /*
      this.zone.run(async() => 
      {
        let arrayToInsert = [JSON.stringify(this.mediaFileComponent)];    
        let queryToInsert = 'INSERT INTO mediaobject (mediaobject) VALUES (?)';
        await this.offline.insertData(queryToInsert, arrayToInsert).then((res:any) => 
        {
          console.log("data inserted into mediaobject:");
        }).catch((err) => 
        {
          console.log("Error insert data mediaobject: ",err);
        });
      });
      */
      //INSERT OBJECT INTO TABLE      
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
  }

  async ngOnInit()
  {
    let MP3ToPlay = (this.MP3ToPlay) ? this.MP3ToPlay : "Nothing";
    console.log("ngOnInit",MP3ToPlay);
  }

  async ngOnChanges()
  {
    let MP3ToPlay = (this.MP3ToPlay) ? this.MP3ToPlay : "Nothing";
    this.MP3LinkComponent = MP3ToPlay;
    this.MP3LinkComponent=this.MP3LinkComponent.replace("'","");
    this.MP3LinkComponent=this.MP3LinkComponent.replace("'","");
    this.MP3LinkComponentTemp=localStorage.getItem('MP3LinkComponent');
    
    if(this.MP3LinkComponent!='' && this.MP3LinkComponent!=this.MP3LinkComponentTemp)
    {
      localStorage.setItem("MP3LinkComponent",this.MP3LinkComponent);
      console.log("New Media");
      this.mediaFileComponent = this.mediaComponenet.create(this.MP3LinkComponent);
      //INSERT OBJECT INTO TABLE
      this.zone.run(async() => 
      {
        let arrayToInsert = [JSON.stringify(this.mediaFileComponent)];    
        let queryToInsert = 'INSERT INTO mediaobject (mediaobject) VALUES (?)';
        await this.offline.insertData(queryToInsert, arrayToInsert).then((res:any) => 
        {
          console.log("data inserted into mediaobject:");
        }).catch((err) => 
        {
          console.log("Error insert data mediaobject: ",err);
        });
      });
      //INSERT OBJECT INTO TABLE
    }//NEW MEDIA IS BEING SELECTED TO PLAY
    if(this.MP3LinkComponent!='' && this.MP3LinkComponent==this.MP3LinkComponentTemp)
    {
      let idToExecute_1=[];
      let queryToExecute_1 = "SELECT mediaobject FROM mediaobject ORDER BY id DESC LIMIT 1";
      await this.offline.getData(queryToExecute_1,idToExecute_1).then((result:any) => 
      {
        if(result.rows.length!=0)
        {
          //console.log("OBJECT FOUND FROM DB-1",JSON.stringify(result.rows.item(0).mediaobject));
          if(this.mediaFileComponent!=null && this.mediaFileComponent!=undefined)
          {}
          else 
          { 
            const MediaObjectConst = JSON.parse(result.rows.item(0).mediaobject);
            MediaObjectConst._objectInstance._duration=Number(localStorage.getItem('mediaFileCurrentPlayingDurationComponent'));
            MediaObjectConst._objectInstance._position=Number(localStorage.getItem('mediaFileCurrentPlayingPositionComponent'));
            //const NewMediaObject = new MediaObject(MediaObjectConst._objectInstance);
            const NewMediaObject = MediaObjectConst as MediaObject;
            console.log("IT COMES HERE");
            //alert(result.rows.item(0).mediaobject);

            this.client.publishSomeDataWhenAudioPlayed({
              isAudioPlayedComponent: true,
              mediaFileComponent:NewMediaObject
            });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
          }
        }
      }).
      catch(err=>
      {
        console.log(err);
      });
      //return ;
    }
    console.log("OnChanges",this.MP3LinkComponent);
  }

  playAudio()
  { 
    this.mediaFileComponent.play();
    //this.mediaFileCurrentPositionStartedAtComponent = setInterval(this.MediaPositionWhilePlaying.bind(this), 1);
    this.client.publishSomeDataWhenAudioPlayed({
      isAudioPlayedComponent: true,
      mediaFileComponent:this.mediaFileComponent
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT    
  }

  MediaPositionWhilePlaying()
  {
    this.mediaFileCurrentPlayingDurationComponent=this.mediaFileComponent.getDuration();
    if(this.mediaFileCurrentPlayingDurationComponent!=null && this.mediaFileCurrentPlayingDurationComponent!=undefined)
    {
      localStorage.setItem('mediaFileCurrentPlayingDurationComponent',this.mediaFileCurrentPlayingDurationComponent.toString());
    }
    this.mediaFileComponent.getCurrentPosition().then((position) => 
    {
      this.mediaFileCurrentPlayingPositionComponent = position;
      if(this.mediaFileCurrentPlayingPositionComponent!=null && this.mediaFileCurrentPlayingPositionComponent!=undefined)
      {
        localStorage.setItem('mediaFileCurrentPlayingPositionComponent',this.mediaFileCurrentPlayingPositionComponent.toString());
      }
      //console.log("Playing Position",this.mediaFileCurrentPlayingPositionComponent);
    });
  }

  pauseAudio()
  {
    console.log("PAUSE"); 
    this.mediaFileComponent.pause();    
    this.mediaFileComponent.getCurrentPosition().then((position) => {
      this.mediaFileCurrentPositionComponent = position;
      console.log(this.mediaFileCurrentPositionComponent);
    });
    this.client.publishSomeDataWhenAudioPlayed({
      isAudioPlayedComponent: false,
      mediaFileComponent:this.mediaFileComponent
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
  }

  ngOnDestroy()
  {}

  moveToPage()
  {
    this.queryString = 
    {
      poem_id:215
    };

    localStorage.setItem('choosen_option',JSON.stringify(this.queryString));

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['tabs/home/sub-list-page/poem-detail'], navigationExtras);
  }
}
