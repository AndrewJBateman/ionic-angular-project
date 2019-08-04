import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { take, tap, delay, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/auth/auth.service';
import { Booking } from './booking.model';

interface BookingData {
	bookedFrom: string;
	bookedTo: string;
	firstName: string;
	lastName: string;
	guestNumber: number;
	placeId: string;
	placeImage: string;
	placeTitle: string;
	userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
	// tslint:disable-next-line: variable-name
	private _bookings = new BehaviorSubject<Booking[]>([]);

	get bookings() {
		return this._bookings.asObservable();
	}

	constructor(private authService: AuthService, private http: HttpClient) {}

	addBooking(
		placeId: string,
		placeTitle: string,
		placeImage: string,
		firstName: string,
		lastName: string,
		guestNumber: number,
		dateFrom: Date,
		dateTo: Date
	) {
		let generatedId: string;
		const newBooking = new Booking(
			Math.random().toString(),
			placeId,
			this.authService.userId,
			placeTitle,
			placeImage,
			firstName,
			lastName,
			guestNumber,
			dateFrom,
			dateTo
		);
		return this.http.post<{name: string}>(
			'https://ionic-angular-project-a9d42.firebaseio.com/bookings.json',
			{ ...newBooking, id: null }
			)
			.pipe(
				switchMap(resData => {
					generatedId = resData.name;
					return this.bookings;
				}),
				take(1),
				tap(bookings => {
					newBooking.id = generatedId;
					this._bookings.next(bookings.concat(newBooking));
				})
			);
	}

	cancelBooking(bookingId: string) {
		return this.bookings.pipe(
			take(1),
			delay(1000),
			tap(bookings => {
				this._bookings.next(bookings.filter(b => b.id !== bookingId));
			})
		);
	}

	fetchBookings() {
		return this.http
			.get<{ [key: string]: BookingData }>(
				`https://ionic-angular-project-a9d42.firebaseio.com/bookings.json?orderBy="userId&equalTo="${
					this.authService.userId
				}"`
			)
			.pipe(
				map(bookingData => {
					const bookings = [];
					for (const key in bookingData) {
						if (bookingData.hasOwnProperty(key)) {
							bookings.push(
								new Booking(
									key,
									bookingData[key].placeId,
									bookingData[key].userId,
									bookingData[key].placeTitle,
									bookingData[key].placeImage,
									bookingData[key].firstName,
									bookingData[key].lastName,
									bookingData[key].guestNumber,
									new Date(bookingData[key].bookedFrom),
									new Date(bookingData[key].bookedTo)

								)
							);
						}
					}
					return bookings;
				}),
				tap(bookings => {
					this._bookings.next(bookings);
				})
		);
	}

}
