
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PlaceLocation } from './../../location.model';
import { PlacesService } from '../../places.service';

@Component({
	selector: 'app-new-offer',
	templateUrl: './new-offer.page.html',
	styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
	form: FormGroup;

	constructor(private placesService: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

	ngOnInit() {
		this.form = new FormGroup({
			title: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required]
			}),
			description: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required, Validators.maxLength(180)]
			}),
			price: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required, Validators.min(1)]
			}),
			dateFrom: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required]
			}),
			dateTo: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required]
			}),
			location: new FormControl(null, { validators: [Validators.required]})
		});
	}

	onLocationPicked(location: PlaceLocation) {
		this.form.patchValue({location});
	}

	onCreateOffer() {
		if (!this.form.valid) {
			return;
		}
		this.loadingCtrl
			.create({
				message: 'Creating place...'
			})
			.then(loadingEl => {
				loadingEl.present();
				this.placesService
					.addPlace(
						this.form.value.title,
						this.form.value.description,
						+this.form.value.price,
						new Date(this.form.value.dateFrom),
						new Date(this.form.value.dateTo),
						this.form.value.location
					)
					.subscribe(() => {
						loadingEl.dismiss();
						this.form.reset();
						this.router.navigate(['/places/tabs/offers']);
					});
			});

	}
}
