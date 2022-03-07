import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
providedIn: 'root'
})
export class OfflineService 
{
  private storage: SQLiteObject;
  public poemsList: any=[]; 
  constructor(private sqlite: SQLite, private platform: Platform)
  { 
    this.platform.ready().then(() => 
    {
      if(this.platform.is("android") || this.platform.is("ios"))
      {
        let dbOptions = 
        {
          name: 'haydari.poems',
          location: 'default'
        };
        this.sqlite.create(dbOptions).then((db: SQLiteObject) => 
        {
          this.storage = db;
          db.executeSql('CREATE TABLE Poems(Email varchar(255),Fullname varchar(255),LanguageID int(11),LanguageName varchar(255),MP3Link text CHARACTER,PoemName varchar(255),PoemTypeID int(11),PoemTypeName varchar(255),PoetID int(11),PoetName varchar(255),ReciterID int(11),ReciterName varchar(255),SubjectID int(11),SubjectName varchar(255),TranslatedText text CHARACTER,UserID int(11),YouTubeURL varchar(255),addedBy int(11),bookmarkStatus int(11),colorCode varchar(255),createdAt timestamp,id int(11),isVerified tinyint(1),poemsLine json)', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
          console.log(db);
        });
      }
    });
  }

  getPoems()
  {
    return new Promise((resolve, reject) => 
    {
      this.storage.executeSql('SELECT * FROM poems', []).then((data) => 
      {
        let activityValues = [];
        if (data.rows.length > 0) 
        {
          for(let i=0; i <data.rows.length; i++) 
          {
            let objPoems = {
              Email:data.rows.item(i).Email,
              Fullname:data.rows.item(i).Fullname,
              LanguageID:data.rows.item(i).LanguageID,
              LanguageName:data.rows.item(i).LanguageName,
              MP3Link:data.rows.item(i).MP3Link,
              PoemName:data.rows.item(i).PoemName,
              PoemTypeID:data.rows.item(i).PoemTypeID,
              PoemTypeName:data.rows.item(i).PoemTypeName,
              PoetID:data.rows.item(i).PoetID,
              PoetName:data.rows.item(i).PoetName,
              ReciterID:data.rows.item(i).ReciterID,
              ReciterName:data.rows.item(i).ReciterName,
              SubjectID:data.rows.item(i).SubjectID,
              SubjectName:data.rows.item(i).SubjectName,
              TranslatedText:data.rows.item(i).TranslatedText,
              UserID:data.rows.item(i).UserID,
              YouTubeURL:data.rows.item(i).YouTubeURL,
              addedBy:data.rows.item(i).addedBy,
              bookmarkStatus:data.rows.item(i).bookmarkStatus,
              colorCode:data.rows.item(i).colorCode,
              createdAt:data.rows.item(i).createdAt,
              id:data.rows.item(i).id,
              isVerified:data.rows.item(i).isVerified,
              poemsLine:data.rows.item(i).poemsLine,
            }
            activityValues.push(objPoems);
          }
        }
        //alert(activityValues); // contains data
        resolve(activityValues);
      },(error) => 
      {
        console.log(error);
        reject(error);
      });
    });
    /*
    return this.storage.executeSql('SELECT * FROM poems', []).then(res => 
    {
      if (res.rows.length > 0) 
      {
        for (var i = 0; i < res.rows.length; i++) 
        {
          let objPoem = {
            id: res.rows.item(i).id,
            artist_name: res.rows.item(i).artist_name,  
            song_name: res.rows.item(i).song_name
          }
          this.poemsList.push(objPoem);
        }
      }
    });
    */
  }

  addPoem(poemObject) 
  {
    return new Promise((resolve, reject) => 
    {
      let data = [poemObject.Email, poemObject.Fullname, poemObject.LanguageID, poemObject.LanguageName, poemObject.MP3Link, poemObject.PoemName, poemObject.PoemTypeID, poemObject.PoemTypeName, poemObject.PoetID, poemObject.PoetName, poemObject.ReciterID, poemObject.ReciterName, poemObject.SubjectID, poemObject.SubjectName, poemObject.TranslatedText, poemObject.UserID, poemObject.YouTubeURL, poemObject.addedBy, poemObject.bookmarkStatus, poemObject.colorCode, poemObject.createdAt, poemObject.id, poemObject.isVerified, poemObject.poemsLine];
      console.log(data);
      this.storage.executeSql('INSERT INTO poems (Email,Fullname,LanguageID,LanguageName,MP3Link,PoemName,PoemTypeID,PoemTypeName,PoetID,PoetName,ReciterID,ReciterName,SubjectID,SubjectName,TranslatedText,UserID,YouTubeURL,addedBy,bookmarkStatus,colorCode,createdAt,id,isVerified,poemsLine) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', data).then((res) => 
      {
        resolve(res);
        //this.getPoems();
      },(error) => 
      {
        console.log(error);
        reject(error);
      });
    });
    /*
    let data = [poemObject.Email, poemObject.Fullname, poemObject.LanguageID, poemObject.LanguageName, poemObject.MP3Link, poemObject.PoemName, poemObject.PoemTypeID, poemObject.PoemTypeName, poemObject.PoetID, poemObject.PoetName, poemObject.ReciterID, poemObject.ReciterName, poemObject.SubjectID, poemObject.SubjectName, poemObject.TranslatedText, poemObject.UserID, poemObject.YouTubeURL, poemObject.addedBy, poemObject.bookmarkStatus, poemObject.colorCode, poemObject.createdAt, poemObject.id, poemObject.isVerified];
    return this.storage.executeSql('INSERT INTO poems (Email,Fullname,LanguageID,LanguageName,MP3Link,PoemName,PoemTypeID,PoemTypeName,PoetID,PoetName,ReciterID,ReciterName,SubjectID,SubjectName,TranslatedText,UserID,YouTubeURL,addedBy,bookmarkStatus,colorCode,createdAt,id,isVerified) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', data)
    .then(res => 
    {
      this.getPoems();
    });
    */
  }
}
