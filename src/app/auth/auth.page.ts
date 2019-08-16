import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

import { AuthService, AuthResponseData } from './auth.service';

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
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController
	) { }

	ngOnInit() {
	}

	authenticate(email: string, password: string) {
		this.isLoading = true;
		this.loadingCtrl
			.create({ keyboardClose: true, message: 'Logging in...' })
			.then(loadingEl => {
				loadingEl.present(); // mask over screen while loading
				let authObs: Observable<AuthResponseData>;
				if (this.isLogin) {
					authObs = this.authService.login(email, password);
				} else {
					authObs = this.authService.signup(email, password);
				}
				authObs.subscribe(
					resData => {
						this.isLoading = false;
						loadingEl.dismiss();
						this.router.navigateByUrl('/places/tabs/discover');
					},
					errRes => {
						loadingEl.dismiss();
						const code = errRes.error.error.message;
						let message = 'Could not sign you up, try again';
						if (code === 'EMAIL_EXISTS') {
							message = 'This email address already exists';
						} else if (code === 'EMAIL_NOT_FOUND') {
							message = 'email address could not be found';
						} else if (code === 'INVALID_PASSWORD') {
							message = 'This password is not correct';
						}
						this.showAlert(message);
					}
				);
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

		this.authenticate(email, password);
		form.reset();
	}

	private showAlert(message: string) {
		this.alertCtrl
			.create({
				header: 'Authentication failed',
				message,
				buttons: ['OK']
			})
			.then(alertEl => alertEl.present());
	}
}
