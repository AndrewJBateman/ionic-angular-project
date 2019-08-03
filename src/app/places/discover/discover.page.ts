import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.page.html',
	styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
	loadedPlaces: Place[];
	listedLoadedPlaces: Place[];
	private placesSub: Subscription;

	constructor(
		private placesService: PlacesService,
		private menuCtrl: MenuController
	) { }

	ngOnInit() {
		this.placesSub = this.placesService.places.subscribe(places => {
			this.loadedPlaces = places;
			this.listedLoadedPlaces = this.loadedPlaces.slice(1);
		});

	}

	onOpenMenu() {
		this.menuCtrl.toggle();
	}

	onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
		console.log(event);
	}

	ngOnDestroy() {
		if (this.placesSub) {
			this.placesSub.unsubscribe();
		}
	}
}
