import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

import { AuthService } from './auth.service';
@Component({
	selector: 'app-auth',
	templateUrl: './auth.page.html',
	styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
	isLoading = false;
	isLogin = true;

	constructor(
		private authService: AuthService,
		private router: Router,
		private loadingCtrl: LoadingController
	) { }

	ngOnInit() {
	}

	onLogin() {
		this.isLoading = true;
		this.authService.login();
		this.loadingCtrl
			.create({keyboardClose: true, message: 'Logging in...'})
			.then(loadingEl => {
				loadingEl.present(); // mask over screen while loading
				setTimeout(() => {
					this.isLoading = false;
					loadingEl.dismiss();
					this.router.navigateByUrl('/places/tabs/discover');
				}, 1500);
			});
	}

	// toggle boolean value to switch between login and signup button/title in template
	onSwitchAuthMode() {
		this.isLogin = !this.isLogin;
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}
		const email = form.value.email;
		const password = form.value.password;
		console.log(email, password);

		if (this.isLogin) {
			// send request to login server
		} else {
			// send request to signup server
		}
	}

}
