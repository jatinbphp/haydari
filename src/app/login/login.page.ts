import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit 
{
	public resultData:any={};
	public postData:any=[];
	public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';

	public loginForm = this.fb.group({
		username: ['', Validators.required],
		password: ['', Validators.required]
	});

	validation_messages = 
	{		
		'username': 
		[
			{ type: 'required', message: 'Email is required.' },
			{ type: 'pattern', message: 'Please enter a valid email.' }
		],
		'password': 
		[
			{ type: 'required', message: 'Password is required.' }
		]
	};

	constructor(public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController) 
	{ }

	ngOnInit() 
	{ }

	home() 
	{
		this.client.router.navigateByUrl('/home');
	}

  	async makeMeLoggedin(form)
	{
		//LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER

		let data=
		{
			username:form.username, 
			password:form.password,
		}
		await this.client.makeMeLoggedin(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			if(this.resultData.status==true)
			{
				localStorage.setItem('token',this.resultData.token);
				localStorage.setItem('id',this.resultData.id);
				localStorage.setItem('firstname',this.resultData.firstname);
				localStorage.setItem('lastname',this.resultData.lastname);
				localStorage.setItem('email',this.resultData.email);
				localStorage.setItem('username',this.resultData.username);
				this.client.router.navigate(['/tabs/home']);
			}
			console.log(this.resultData);
						
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
	}

  	hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    	this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}
}
