import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from './../places.service';
import { Place } from '../place.model';


@Component({
	selector: 'app-offers',
	templateUrl: './offers.page.html',
	styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
	offers: Place[];
	isLoading = false;
	private placesSub: Subscription;

	constructor(private placesService: PlacesService, private router: Router) { }

	ngOnInit() {
		this.placesSub = this.placesService.places.subscribe(places => {
			this.offers = places;
		});
	}

	ionViewWillEnter() {
		this.placesService.fetchPlaces().subscribe();
	}

	onEdit(offerId: string, slidingItem: IonItemSliding) {
		slidingItem.close();
		this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
		console.log('Editing item', offerId);
	}

	ngOnDestroy() {
		if (this.placesSub) {
			this.placesSub.unsubscribe();
		}
	}

}
