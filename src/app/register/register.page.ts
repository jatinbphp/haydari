import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit 
{
	public resultData:any={};
	public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';

	public signUpForm = this.fb.group({
		firstname: ['', Validators.required],
		lastname: ['', Validators.required],
		username: ['', Validators.required],
		password: ['', Validators.required]		
	});

	validation_messages = 
	{	
		'firstname': 
		[
			{ type: 'required', message: 'First name is required.' },
		],
		'lastname': 
		[
			{ type: 'required', message: 'Last name is required.' },
		],	
		'username': 
		[
			{ type: 'required', message: 'Email is required.' },
			{ type: 'pattern', message: 'Please enter a valid email.' }
		],
		'password': 
		[
			{ type: 'required', message: 'Password is required.' }
		],
	};

	constructor(public keyboard:Keyboard, public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController) 
	{ 
		this.keyboard.hideFormAccessoryBar(false);
	}

  	ngOnInit() 
	{ }

	async makeMeSignUp(form)
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
			firstname:form.firstname,
			lastname:form.lastname,
			username:form.username, 
			password:form.password,
		}
		await this.client.makeMeSignUp(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			if(this.resultData.status==true)
			{
				this.client.router.navigate(['/login']);
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
