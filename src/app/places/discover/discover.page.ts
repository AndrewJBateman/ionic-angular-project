import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.page.html',
	styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
	loadedPlaces: Place[];

	constructor(private placesService: PlacesService, private menuCtrl: MenuController) { }

	ngOnInit() {
		this.loadedPlaces = this.placesService.places;
	}

	onOpenMenu() {
		this.menuCtrl.toggle();
	}

}
