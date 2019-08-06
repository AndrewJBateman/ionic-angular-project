import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';
import { PlaceLocation } from '../../../places/location.model';

@Component({
	selector: 'app-location-picker',
	templateUrl: './location-picker.component.html',
	styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
	@Output() locationPick = new EventEmitter<PlaceLocation>();
	selectedLocationImage: string;
	isLoading = false;

	constructor(private modalCtrl: ModalController, private http: HttpClient) { }

	ngOnInit() {}

	onPickLocation() {
		this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
			modalEl.onDidDismiss().then(modalData => {
				if (!modalData.data) {
					return;
				}
				const pickedLocation: PlaceLocation = {
					lat: modalData.data.lat,
					lng: modalData.data.lng,
					address: null,
					staticMapImageUrl: null
				};
				this.isLoading = true;
				this.getAddress(modalData.data.lat, modalData.data.lng)
					.pipe(
						switchMap(address => {
							pickedLocation.address = address;
							return of(
								this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
							);
						})
					)
					.subscribe(staticMapImageUrl => {
						pickedLocation.staticMapImageUrl = staticMapImageUrl;
						this.selectedLocationImage = staticMapImageUrl;
						this.isLoading = false;
						this.locationPick.emit(pickedLocation);
					});
			});
			modalEl.present();
		});
	}

	// helper function to get address from google maps api using lat and lng input coords
	private getAddress(lat: number, lng: number) {
		return this.http
			.get<any>(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
					environment.googleMapsAPIKey
				}`
			)
			.pipe(
				map(geoData => {
					if (!geoData || !geoData.results || geoData.results.length === 0) {
						return null;
					}
					return geoData.results[0].formatted_address;
				})
			);
	}

	private getMapImage(lat: number, lng: number, zoom: number) {
		return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`;
	}

}
