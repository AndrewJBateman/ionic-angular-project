import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { AuthService } from './../auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {
	// tslint:disable-next-line: variable-name
	private _places = new BehaviorSubject<Place[]>([
		new Place(
			'p1',
			'Manhatten Mansions',
			'In the heart of New York City',
			'https://www.ecuavisa.com/cdn-cgi/image/width=1600,quality=75/sites/default/files/fotos/2016/03/15/casa_tyson.jpg',
			149.99,
			new Date('2019-01-01'),
			new Date('2019-12-31'),
			'abc'
		),
		new Place(
			'p2',
			'L\'Amour Toujours',
			'A romantic place in Paris',
			// tslint:disable-next-line: max-line-length
			'http://www.parisianflat.com/images/apartments/7/living_casimir.jpg',
			99.99,
			new Date('2019-01-01'),
			new Date('2019-12-31'),
			'abc'
		),
		new Place(
			'p3',
			'The Foggy Palace',
			'Not your average day trip',
			// tslint:disable-next-line: max-line-length
			'https://previews.123rf.com/images/erin71/erin711802/erin71180200003/95887113-hamilton-house-on-foggy-winter-day.jpg',
			99.99,
			new Date('2019-01-01'),
			new Date('2019-12-31'),
			'abc'
		)
	]);

	get places() {
		return this._places.asObservable();
	}

	constructor(private authService: AuthService) { }

	getPlace(id: string) {
		return this.places.pipe(
			take(1), map(places => {
				return {...places.find(p => p.id === id)};
			})
		);
	}

	addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
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
			// look through array object and just take 1 item then cancel subscription
			// concat takes old array, adds new item then returns new array to be emitted using next()
		return this._places.pipe(
			take(1),
			delay(1000),
			tap(places => {
				this._places.next(places.concat(newPlace));
			})
		);
	}

	// emits a new list of offers that includes the added place
	updatePlace(placeId: string, title: string, description: string) {
		return this.places.pipe(
			take(1),
			tap(places => {
				const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
				const updatedPlaces = [...places];
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
				this._places.next(updatedPlaces);
			})
		);
	}

}
