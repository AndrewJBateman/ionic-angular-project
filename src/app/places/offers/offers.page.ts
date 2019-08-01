import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';

import { PlacesService } from './../places.service';
import { Place } from '../place.model';

@Component({
	selector: 'app-offers',
	templateUrl: './offers.page.html',
	styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
	offers: Place[];

	constructor(private placesService: PlacesService, private router: Router) { }

	ngOnInit() {
		this.offers = this.placesService.places;
	}

	onEdit(offerId: string, slidingItem: IonItemSliding) {
		slidingItem.close();
		this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
		console.log('Editing item', offerId);
	}

}
