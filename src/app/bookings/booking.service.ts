import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
	// tslint:disable-next-line: variable-name
	private _bookings: Booking[] = [
		{
			id: 'xyz',
			placeId: 'p1',
			placeTitle: 'Manhatten Mansions',
			guestNumber: 2,
			userId: 'abc'
		}
	];

	get bookings() {
		return [...this._bookings];
	}
}
