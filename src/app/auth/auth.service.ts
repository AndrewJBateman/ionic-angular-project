import {BehaviorSubject, from} from 'rxjs';
import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Plugins} from '@capacitor/core';
import {map, tap} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {User} from './user.model';

export interface AuthResponseData {
	kind: string;
	idToken: string;
	email: string;
	refreshToken: string;
	localId: string;
	expiresIn: string;
	registered?: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService implements OnDestroy {
	private _user = new BehaviorSubject<User>(null);
	private activeLogoutTimer: any;

	// method to return true if user has auth token, false if not
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

	// function to return userid as an observable
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

	constructor(private http: HttpClient) {}

	// method to get data stored by Capacitor plugin then convert it back to a js object
	autoLogin() {
		return from(Plugins.Storage.get({key: 'authData'})).pipe(
			map(storedData => {
				if (!storedData || !storedData.value) {
					return null;
				}
				// create a constant that is a javascript object
				const parsedData = JSON.parse(storedData.value) as {
					token: string
					tokenExpirationDate: string
					userId: string
					email: string
				};
				// recreate expiry time as a string in ISO format that can be used by the data constructor
				const expirationTime = new Date(parsedData.tokenExpirationDate);
				if (expirationTime <= new Date()) {
					return null;
				}
				const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
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

	// signup POST request method with a js object with user login info to a firebase backend 	http endpoint with an API key.
	// This will return js object AuthResponseData (kind, idToken, email, refreshToken, localId,	expiresIn).
	// return observable to auth page. Bind the data returned from firebase to setUserData.
	signup(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(
				`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
					environment.firebaseAPIKey
				}`,
				{email, password, returnSecureToken: true})
			.pipe(tap(this.setUserData.bind(this)));
	}

	// will return AuthResponseData (kind, idToken, email, refreshToken, localId,	expiresIn, registered boolean)
	// return observable to auth page. Bind the data returned from firebase to setUserData.
	login(email: string, password: string) {
		return this.http
			.post<AuthResponseData>(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
					environment.firebaseAPIKey
				}`,
				{email, password, returnSecureToken: true})
			.pipe(tap(this.setUserData.bind(this)));
	}

	// method to logout user by clearing timer, passing null to the _user behavioursubject and clearing the native storage.
	logout() {
		if (this.activeLogoutTimer) {
			clearTimeout(this.activeLogoutTimer);
		}
		this._user.next(null);
		Plugins.Storage.remove({key: 'authData'});
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
		const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
		const user = new User(userData.localId, userData.email, userData.idToken, expirationTime);
		this._user.next(user);
		this.autoLogout(user.tokenDuration);
		this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
	}

	// method to store auth data using Capacitor storage plugin
	// convert to string using stringify as we cannot store a js object
	private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
		const data = JSON.stringify({
			userId,
			token,
			tokenExpirationDate,
			email
		});
		Plugins.Storage.set({key: 'authData', value: data});
	}
}
