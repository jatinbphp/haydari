import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit 
{
	public resultData:any={};
	public resultDataSocialLoginOrSignup:any={};
	public currentPlatform:string = '';
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

	constructor(private platform: Platform, private googlePlus: GooglePlus, public keyboard:Keyboard, public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController) 
	{ 
		this.keyboard.hideFormAccessoryBar(false);
	}

	ngOnInit() 
	{ }

	ionViewWillEnter()
	{
		this.platform.ready().then(() => 
		{
		if(this.platform.is("android"))
		{
			this.currentPlatform="android";
		}
		if(this.platform.is("ios"))
		{
			this.currentPlatform="ios";
		}
		});
	}

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
			this.client.publishSomeDataWhenLogin({
				is_user_login: true
			});//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
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

	async GoogleLoginORSignup()
	{
		
		let params = 
		{
			webClientId: '471452795402-92fmshstflp04eheg4r4sps4kuhdfrua.apps.googleusercontent.com', //  webclientID 'string'
			offline: true
		};
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

		this.googlePlus.login(params).then(user => 
		{
			let splitName = user.displayName.split(" ");
			let firstName = splitName[0];
			let lastName = splitName[1];

			let data={
				username:user.email,
				firstname:firstName,
				lastname:lastName,
			}
			
			this.client.GoogleLoginORSignup(data).then(result => 
			{	
				loading.dismiss();//DISMISS LOADER			
				this.resultDataSocialLoginOrSignup=result;
				this.client.publishSomeDataWhenLogin({
					is_user_login: true
				});//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
				if(this.resultDataSocialLoginOrSignup.status==true)
				{
					localStorage.setItem('token',this.resultDataSocialLoginOrSignup.token);
					localStorage.setItem('id',this.resultDataSocialLoginOrSignup.id);
					localStorage.setItem('firstname',this.resultDataSocialLoginOrSignup.firstname);
					localStorage.setItem('lastname',this.resultDataSocialLoginOrSignup.lastname);
					localStorage.setItem('email',this.resultDataSocialLoginOrSignup.email);
					localStorage.setItem('username',this.resultDataSocialLoginOrSignup.username);
					this.client.router.navigate(['/tabs/home']);
				}			
			},
			error => 
			{
				loading.dismiss();//DISMISS LOADER
				console.log();
			});
			
			//alert(JSON.stringify(user));
			//console.log(user);       
		}, 
		err => 
		{
			loading.dismiss();//DISMISS LOADER	
			//alert(JSON.stringify(err));
			console.log(err);
		});
	}
}
