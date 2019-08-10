import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor, AppState } from '@capacitor/core';

import { Router } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	private authSub: Subscription;
	private previousAuthState = false;

	constructor(
		private platform: Platform,
		private authService: AuthService,
		private router: Router
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			if (Capacitor.isPluginAvailable('Splashscreen')) {
				Plugins.Splashscreen.hide();
			}
		});
	}

	ngOnInit() {
		this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
			if (!isAuth && this.previousAuthState !== isAuth) {
				this.router.navigateByUrl('/auth');
			}
			this.previousAuthState = isAuth;
		});
		Plugins.App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
	}

	onLogout() {
		this.authService.logout();
	}

	ngOnDestroy() {
		if (this.authSub) {
			this.authSub.unsubscribe();
		}
	}

	private checkAuthOnResume(state: AppState) {
		if (state.isActive) {
			this.authService
				.autoLogin()
				.pipe(take(1))
				.subscribe(success => {
					if (!success) {
						this.onLogout();
					}
				});
		}
	}

}
