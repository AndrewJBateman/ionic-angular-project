import { BehaviorSubject, from } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
	registered?: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService implements OnDestroy {
	// tslint:disable-next-line: variable-name
	private _user = new BehaviorSubject<User>(null);
	private activeLogoutTimer: any;

	get userIsAuthenticated() {
		return this._user.asObservable().pipe(
			map(user => {
				if (user) {
					return !!user.token;
				} else {
					return false;
				}
			})
		);
	}

	// function to return a userid observable
	get userId() {
		return this._user.asObservable().pipe(
			map(user => {
				if (user) {
					return user.id;
				} else {
					return null;
				}
			})
		);
	}

	get token() {
		return this._user.asObservable().pipe(
			map(user => {
				if (user) {
					return user.token;
				} else {
					return null;
				}
			})
		);
	}

	constructor(private http: HttpClient) { }

	autoLogin() {
		return from(Plugins.Storage.get({ key: 'authData'})).pipe(
			map(storedData => {
				if (!storedData || !storedData.value) {
					return null;
				}
				// create a constant that is a javascript object
				const parsedData = JSON.parse(storedData.value) as {
					token: string;
					tokenExpirationDate: string;
					userId: string;
					email: string;
				};
				// create expiry time as a string in ISO format that can be used by the data constructor
				const expirationTime = new Date(parsedData.tokenExpirationDate);
				if (expirationTime <= new Date()) {
					return null;
				}
				const user = new User(
					parsedData.userId,
					parsedData.email,
					parsedData.token,
					expirationTime
				);
				return user;
		}),
		tap(user => {
			if (user) {
				this._user.next(user);
				this.autoLogout(user.tokenDuration);
			}
		}),
		map(user => {
			return !!user; // returns a boolean (true if there is a user, otherwise false)
		})
		);
	}

	signup(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(
				`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
				environment.firebaseAPIKey
				}`,
				{ email, password, returnSecureToken: true }
			)
			.pipe(tap(this.setUserData.bind(this)));
	}

	login(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
				environment.firebaseAPIKey
				}`,
				{ email, password, returnSecureToken: true }
			)
			.pipe(tap(this.setUserData.bind(this)));
	}

	logout() {
		if (this.activeLogoutTimer) {
			clearTimeout(this.activeLogoutTimer);
		}
		this._user.next(null);
		Plugins.Storage.remove({ key: 'authData' });
	}

	ngOnDestroy() {
		if (this.activeLogoutTimer) {
			clearTimeout(this.activeLogoutTimer);
		}
	}

	private autoLogout(duration: number) {
		if (this.activeLogoutTimer) {
			clearTimeout(this.activeLogoutTimer);
		}
		this.activeLogoutTimer = setTimeout(() => {
			this.logout();
		}, duration);
	}

	private setUserData(userData: AuthResponseData) {

		// create const for time to expire in milliseconds
		const expirationTime = new Date(
			new Date().getTime() + +userData.expiresIn * 1000
		);
		const user = new User(
				userData.localId,
				userData.email,
				userData.idToken,
				expirationTime
			)
		;
		this._user.next(user);
		this.autoLogout(user.tokenDuration);
		this.storeAuthData(
			userData.localId,
			userData.idToken,
			expirationTime.toISOString(),
			userData.email
		);
	}

	private storeAuthData(
		userId: string,
		token: string,
		tokenExpirationDate: string,
		email: string
	) {
		const data = JSON.stringify({
			userId,
			token,
			tokenExpirationDate,
			email
		});
		Plugins.Storage.set({ key: 'authData', value: data });
	}
}
