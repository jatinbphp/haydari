import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; 
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ClientService 
{
	public site_url: string ="https://haydari.ecnetsolutions.dev/";
	public api_url: string = "https://haydari.ecnetsolutions.dev/api/";
	public token: string;
	public serverResponse: any=[];
	private fooSubjectWhenlOGIN = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
	private fooSubjectWhenPoemTypeClickedFromMenu = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU

	constructor(public http: HttpClient, private alertCtrl: AlertController, public router: Router) 
	{ }

	publishSomeDataWhenLogin(data: any) {
        this.fooSubjectWhenlOGIN.next(data);
    }//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN

    getObservableWhenLogin(): Subject<any> {
        return this.fooSubjectWhenlOGIN;
	}//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN

	publishSomeDataWhenPoemTypeClickedFromMenu(data: any) 
	{
		this.fooSubjectWhenPoemTypeClickedFromMenu.next(data);
	}//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU

	getObservableWhenPoemTypeClickedFromMenu(): Subject<any> 
	{
		return this.fooSubjectWhenPoemTypeClickedFromMenu;
	}//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU

  	getHeaderOptions(): any 
	{	
		this.token=localStorage.getItem('token');
		var headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Accept','application/json');
		return { headers }	    
	}

	makeMeLoggedin(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("username",data.username).set("password", data.password);
			this.http.post(this.api_url + "login",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					this.serverResponse=res;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	makeMeSignUp(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("FirstName",data.firstname).set("LastName", data.lastname).set("Email",data.username).set("Password", data.password);
			this.http.post(this.api_url + "register",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					resolve(res);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	updateMyPassword(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("email",data.username);
			this.http.post(this.api_url + "resetPassword",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					this.serverResponse=res;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getUserDetailById(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id);
			this.http.post(this.api_url + "getUserDetailById",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.serverResponse=res.data;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	updateProfile(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id).set("firstname",data.firstname).set("lastname",data.lastname).set("password",data.password);
			this.http.post(this.api_url + "updateProfile",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage("Profile updated!!");
					this.serverResponse=res.data;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoemTypes()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getPoemTypes",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoemsByPoemType(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("poemTypeID",data.poem_subject_occassion_id).set("orderType",data.order).set("keyword",(data.searched_text) ? data.searched_text : '');
			this.http.post(this.api_url + "getPoemsByPoemType",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoemsDetailById(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("poemID",data.poem_id).set("user_id",data.user_id);
			this.http.post(this.api_url + "getPoemsDetailById",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	poemLineWishlist(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("poem_id",data.poem_id).set("poem_line_id",data.poem_line_id).set("user_id",data.user_id);
			this.http.post(this.api_url + "poemLineWishlist",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getSubject()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getSubject",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoemsBySubject(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("subjectID",data.poem_subject_occassion_id).set("orderType",data.order).set("keyword",(data.searched_text) ? data.searched_text : '');
			this.http.post(this.api_url + "getPoemsBySubject",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getReciters()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getReciters",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getLanguages()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getLanguages",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getNewReleasePoems(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id);
			this.http.post(this.api_url + "getNewReleasePoems",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	searchPoems(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("keyword",data.keyword);
			this.http.post(this.api_url + "searchPoems",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getErrorMessage(err)
	{	
		if(err.error == null)
		{
			return err.message;
		}
		else if(err.error.message)
		{
			return err.error.message;
		} 
		else 
		{
			return err.error.status;
		}
	}
	
	async showMessage(message)
	{
		if(message == 'Token not valid') 
		{
			localStorage.clear();
		    this.router.navigate(['/login']);
		}
		else
		{
			const alert = await this.alertCtrl.create(
			{
				header: 'The Haydari Project',
				message: message,
				buttons: 
				[
					{
						text: 'Okay',
						handler: () => 
						{
							//console.log('Confirm Cancel: blah');
						}
					}
				]
			});
			await alert.present();		
		}
	}
}
