import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
	availableFrom: string;
	availableTo: string;
	description: string;
	imageUrl: string;
	price: number;
	title: string;
	userId: string;
}

// new Place(
// 	'p1',
// 	'Manhatten Mansions',
// 	'In the heart of New York City',
// 	'https://www.ecuavisa.com/cdn-cgi/image/width=1600,quality=75/sites/default/files/fotos/2016/03/15/casa_tyson.jpg',
// 	149.99,
// 	new Date('2019-01-01'),
// 	new Date('2019-12-31'),
// 	'abc'
// ),
// new Place(
// 	'p2',
// 	'L\'Amour Toujours',
// 	'A romantic place in Paris',
// 	// tslint:disable-next-line: max-line-length
// 	'http://www.parisianflat.com/images/apartments/7/living_casimir.jpg',
// 	99.99,
// 	new Date('2019-01-01'),
// 	new Date('2019-12-31'),
// 	'abc'
// ),
// new Place(
// 	'p3',
// 	'The Foggy Palace',
// 	'Not your average day trip',
// 	// tslint:disable-next-line: max-line-length
// 	'https://previews.123rf.com/images/erin71/erin711802/erin71180200003/95887113-hamilton-house-on-foggy-winter-day.jpg',
// 	99.99,
// 	new Date('2019-01-01'),
// 	new Date('2019-12-31'),
// 	'abc'
// )

@Injectable({
	providedIn: 'root'
})
export class PlacesService {
	// tslint:disable-next-line: variable-name
	private _places = new BehaviorSubject<Place[]>([]);

	get places() {
		return this._places.asObservable();
	}

	constructor(private authService: AuthService, private http: HttpClient) { }

	fetchPlaces() {
		return this.http
			.get<{ [key: string]: PlaceData }>(
				'https://ionic-angular-project-a9d42.firebaseio.com/offered-places.json'
			)
			.pipe(
				map(resData => {
					const places = [];
					for (const key in resData) {
						if (resData.hasOwnProperty(key)) {
							places.push(
								new Place(
									key,
									resData[key].title,
									resData[key].description,
									resData[key].imageUrl,
									resData[key].price,
									new Date(resData[key].availableFrom),
									new Date(resData[key].availableTo),
									resData[key].userId
								)
							);
						}
					}
					return places;
				}),
				tap(places => {
					this._places.next(places);
				})
			);
	}

	getPlace(id: string) {
		return this.http
			.get<PlaceData>(
				`https://ionic-angular-project-a9d42.firebaseio.com/offered-places/${id}.json`
			)
			.pipe(
			map(placeData => {
				return new Place(
					id,
					placeData.title,
					placeData.description,
					placeData.imageUrl,
					placeData.price,
					new Date(placeData.availableFrom),
					new Date(placeData.availableTo),
					placeData.userId
				);
			})
		);
	}

	addPlace(
		title: string,
		description: string,
		price: number,
		dateFrom: Date,
		dateTo: Date
	) {
		let generatedId: string;
		const newPlace = new Place
			(
				Math.random().toString(),
				title,
				description,
				'https://www.ecuavisa.com/cdn-cgi/image/width=1600,quality=75/sites/default/files/fotos/2016/03/15/casa_tyson.jpg',
				price,
				dateFrom,
				dateTo,
				this.authService.userId
			);

		// post newPlace data to Firebase but replace id with null
		return this.http
			.post<{name: string}>(
				'https://ionic-angular-project-a9d42.firebaseio.com/offered-places.json',
				{
				...newPlace,
				id: null
				}
			)
			.pipe(
				switchMap(resData => {
					generatedId = resData.name;
					return this.places;
				}),
				take(1),
				tap(places => {
					newPlace.id = generatedId;
					this._places.next(places.concat(newPlace));
				})
			);
			// look through array object and just take 1 item then cancel subscription
			// concat takes old array, adds new item then returns new array to be emitted using next()
		// return this._places.pipe(
		// 	take(1),
		// 	delay(1000),
		// 	tap(places => {
		// 		this._places.next(places.concat(newPlace));
		// 	})
		// );
	}

	// emits a new list of offers that includes the added place
	// logic ensures there is always a list of offers to work with.
	updatePlace(placeId: string, title: string, description: string) {
		let updatedPlaces: Place[]; // initialise updated places variable
		return this.places.pipe(
			take(1), // take latest snapshot of list
			switchMap(places => {
				if (!places || places.length <= 0) {
					return this.fetchPlaces(); // returns updated array of places
				} else {
					return of(places); // of takes array and wraps it into a new observable that will emit a value right away
				}
			}),
			switchMap(places => {
				const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
				updatedPlaces = [...places];
				const oldPlace = updatedPlaces[updatedPlaceIndex];
				updatedPlaces[updatedPlaceIndex] = new Place(
					oldPlace.id,
					title,
					description,
					oldPlace.imageUrl,
					oldPlace.price,
					oldPlace.availableFrom,
					oldPlace.availableTo,
					oldPlace.userId
				);
				return this.http.put(
					`https://ionic-angular-project-a9d42.firebaseio.com/offered-places/${placeId}.json`,
					{ ...updatedPlaces[updatedPlaceIndex], id: null } // Data to be replaced, override id
				);
			}),
			tap(() => {
				this._places.next(updatedPlaces); // emit new list of updated places
			}),
		);
	}
}
