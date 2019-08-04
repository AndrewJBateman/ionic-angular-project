import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';


@Component({
	selector: 'app-edit-offer',
	templateUrl: './edit-offer.page.html',
	styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
	place: Place;
	placeId: string;
	form: FormGroup;
	isLoading = false;
	private placeSub: Subscription;

	constructor(
		private route: ActivatedRoute,
		private placesService: PlacesService,
		private navCtrl: NavController,
		private router: Router,
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController
	) { }

	ngOnInit() {
		this.route.paramMap.subscribe(paramMap => {
			if (!paramMap.has('placeId')) {
				this.navCtrl.navigateBack('/places/tabs/offers');
				return;
			}
			this.placeId = paramMap.get('placeId');
			this.isLoading = true;
			this.placeSub = this.placesService
				.getPlace(paramMap.get('placeId'))
				.subscribe(place => {
					this.place = place;
					this.form = new FormGroup({
						title: new FormControl(this.place.title, {
							updateOn: 'blur',
							validators: [Validators.required]
						}),
						description: new FormControl(this.place.description, {
							updateOn: 'blur',
							validators: [Validators.required, Validators.maxLength(180)]
						})
					});
					this.isLoading = false;
				}, error => {
					this.alertCtrl.create({
						header: 'An error occured',
						message: 'Place could not be fetched. Try again later.',
						buttons: [{text: 'ok', handler: () => {
							this.router.navigate(['/places/tabs/offers']);
						}}]
					}).then(alertEl => {
						alertEl.present();
					});
				});
		});
	}

	onUpdateOffer() {
		if (!this.form.valid) {
			return;
		}
		this.loadingCtrl.create({
			message: 'Updating place...'
		})
		.then(loadingEl => {
			loadingEl.present();
			this.placesService.updatePlace(
				this.place.id,
				this.form.value.title,
				this.form.value.description
			).subscribe(() => {
				loadingEl.dismiss();
				this.form.reset();
				this.router.navigate(['/places/tabs/offers']);
			});
		});

	}

	ngOnDestroy() {
		if (this.placeSub) {
			this.placeSub.unsubscribe();
		}
	}

}
