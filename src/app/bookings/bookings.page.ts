import { IonItemSliding } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';

import { BookingService } from './booking.service';
import { Booking } from './booking.model';

@Component({
	selector: 'app-bookings',
	templateUrl: './bookings.page.html',
	styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
	loadedBookings: Booking[];

	constructor(private bookingService: BookingService) { }

	ngOnInit() {
		this.loadedBookings = this.bookingService.bookings;
	}

	onCancelBooking(offerId: string, slidingEl: IonItemSliding) {
		slidingEl.close();
		// cancel booking with id offerId
	}

}
