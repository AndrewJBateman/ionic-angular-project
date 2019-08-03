import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { AuthService } from '../../../auth/auth.service';
import { BookingService } from '../../../bookings/booking.service';
import { Booking } from './../../../bookings/booking.model';

@Component({
	selector: 'app-place-detail',
	templateUrl: './place-detail.page.html',
	styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
	place: Place;
	isBookable = false;
	private placeSub: Subscription;

	constructor(
		private navCtrl: NavController,
		private route: ActivatedRoute,
		private placesService: PlacesService,
		private modalCtrl: ModalController,
		private actionSheetCtrl: ActionSheetController,
		private bookingService: BookingService,
		private loadingCtrl: LoadingController,
		private authService: AuthService
	) {}

	ngOnInit() {

		// paramMap manages it's own subscription
		this.route.paramMap.subscribe(paramMap => {
			if (!paramMap.has('placeId')) {
				this.navCtrl.navigateBack('/places/tabs/offers');
				return;
			}
			this.placeSub = this.placesService
				.getPlace(paramMap.get('placeId'))
				.subscribe(place => {
					this.place = place;
					this.isBookable = place.userId !== this.authService.userId;
				});
		});
	}
	onBookPlace() {
		// this.navCtrl.navigateBack('/places/tabs/discover');
		this.actionSheetCtrl.create({
			header: 'Choose an action',
			buttons: [
				{
					text: 'Select Date',
					handler: () => {
						this.openBookingModal('select');
					}
				},
				{
					text: 'Random Date',
					handler: () => {
						this.openBookingModal('random');
					}
				},
				{
					text: 'Cancel',
					role: 'cancel'
				}
			]
		}).then(actionSheetEl => {
			actionSheetEl.present();
		});
	}

	openBookingModal(mode: 'select' | 'random') {
		console.log(mode);
		this.modalCtrl
		.create({
			component: CreateBookingComponent,
			componentProps: { selectedPlace: this.place, selectedMode: mode }})
		.then(modalEl => {
			modalEl.present();
			return modalEl.onDidDismiss();
		})
		.then(resultData => {
			if (resultData.role === 'confirm') {
				this.loadingCtrl
					.create({message: 'Booking place...'})
					.then(loadingEl => {
						loadingEl.present();
						const data = resultData.data.bookingData;
						this.bookingService.addBooking(
							this.place.id,
							this.place.title,
							this.place.imageUrl,
							data.firstName,
							data.lastName,
							data.guestNumber,
							data.startDate,
							data.endDate
						)
						.subscribe(() => {
							loadingEl.dismiss();
						});
					});
			}
		});
	}

	ngOnDestroy() {
		if (this.placeSub) {
			this.placeSub.unsubscribe();
		}
	}
}
