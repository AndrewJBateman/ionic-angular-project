import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.page.html',
	styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
	loadedPlaces: Place[];
	listedLoadedPlaces: Place[];
	relevantPlaces: Place[];
	isLoading = false;
	private placesSub: Subscription;

	constructor(
		private placesService: PlacesService,
		private menuCtrl: MenuController,
		private authService: AuthService
	) { }

	ngOnInit() {
		this.placesSub = this.placesService.places.subscribe(places => {
			this.loadedPlaces = places;
			this.relevantPlaces = this.loadedPlaces;
			this.listedLoadedPlaces = this.relevantPlaces.slice(1);
		});
	}

	ionViewWillEnter() {
		this.isLoading = true;
		this.placesService.fetchPlaces().subscribe(() => {
			this.isLoading = false;
		});
	}

	onOpenMenu() {
		this.menuCtrl.toggle();
	}

	onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
		this.authService.userId.pipe(take(1)).subscribe(userId => {
			if (event.detail.value === 'all') {
				this.relevantPlaces = this.loadedPlaces;
				this.listedLoadedPlaces = this.relevantPlaces.slice(1);
			} else {
				this.relevantPlaces = this.loadedPlaces.filter(
					place => place.userId !== userId
				);
				this.listedLoadedPlaces = this.relevantPlaces.slice(1);
			}
		});
	}

	ngOnDestroy() {
		if (this.placesSub) {
			this.placesSub.unsubscribe();
		}
	}
}
