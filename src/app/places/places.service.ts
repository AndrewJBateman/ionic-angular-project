import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {
	// tslint:disable-next-line: variable-name
	private _places: Place[] = [
		new Place(
			'p1',
			'Manhatten Mansions',
			'In the heart of New York City',
			'https://www.ecuavisa.com/cdn-cgi/image/width=1600,quality=75/sites/default/files/fotos/2016/03/15/casa_tyson.jpg',
			149.99
		),
		new Place(
			'p2',
			'L\'Amour Toujours',
			'A romantic place in Paris',
			// tslint:disable-next-line: max-line-length
			'http://www.parisianflat.com/images/apartments/7/living_casimir.jpg',
			99.99
		),
		new Place(
			'p3',
			'The Foggy Palace',
			'Not your average day trip',
			// tslint:disable-next-line: max-line-length
			'https://previews.123rf.com/images/erin71/erin711802/erin71180200003/95887113-hamilton-house-on-foggy-winter-day.jpg',
			99.99
		)
	];

	get places() {
		return [...this._places];
	}

	constructor() { }

	getPlace(id: string) {
		return {...this._places.find(p => p.id === id)};
	}

}
