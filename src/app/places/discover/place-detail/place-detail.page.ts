import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { PlacesService } from './../../places.service';
import { Place } from '../../place.model';

@Component({
	selector: 'app-place-detail',
	templateUrl: './place-detail.page.html',
	styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
	place: Place;

	constructor(
		private navCtrl: NavController,
		private route: ActivatedRoute,
		private placesService: PlacesService
	) {}

	ngOnInit() {
		this.route.paramMap.subscribe(paramMap => {
			if (!paramMap.has('placeId')) {
				this.navCtrl.navigateBack('/places/tabs/offers');
				return;
			}
			this.place = this.placesService.getPlace(paramMap.get('placeId'));
		});
	}
	onBookPlace() {
		this.navCtrl.navigateBack('/places/tabs/discover');
	}
}
