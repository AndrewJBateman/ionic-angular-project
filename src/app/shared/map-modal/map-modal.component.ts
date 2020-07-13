import { ModalController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2, OnDestroy, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-map-modal',
	templateUrl: './map-modal.component.html',
	styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

	// ViewChild is a property decorator that configures a view query.
	@ViewChild('map') mapElementRef: ElementRef;
	@Input() center = { lat: 37.7964333, lng: -1.5121459 };
	@Input() selectable = true;
	@Input() closeButtonText = 'Cancel';
	@Input() title = 'Pick Location';
	clickListener: any;
	googleMaps: any;

	constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

	ngOnInit() {
	}

	// lifecycle hook that is called after Angular has fully initialized a component's view.
	// Used for any additional initialization tasks
	ngAfterViewInit() {
		this.getGoogleMaps()
			.then(googleMaps => {
				this.googleMaps = googleMaps;
				const mapEl = this.mapElementRef.nativeElement;
				const map = new googleMaps.Map(mapEl, {
					center: this.center,
					zoom: 16
				});

				this.googleMaps.event.addListenerOnce(map, 'idle', () => {
					this.renderer.addClass(mapEl, 'visible');
				});

				if (this.selectable) {
					this.clickListener = map.addListener('click', event => {
						const selectedCoords = {
							lat: event.latLng.lat(),
							lng: event.latLng.lng()
						};
						this.modalCtrl.dismiss(selectedCoords);
					});
				} else {
					 const marker = new googleMaps.Marker({
						 position: this.center,
						 map,
						 title: 'Picked Location'
					 });
					 marker.setMap(map);
				 }
			})
		.catch(err => {
			console.log(err);
		});
	}

	onCancel() {
		this.modalCtrl.dismiss();
	}

	ngOnDestroy() {
		if (this.clickListener) {
			this.googleMaps.event.removeListener(this.clickListener);
		}
	}

	private getGoogleMaps(): Promise<any> {
		const win = window as any;
		const googleModule = win.google;

		// check if google maps loaded already, if so go to google maps module
		if (googleModule && googleModule.maps) {
			return Promise.resolve(googleModule.maps);
		}

		// show google maps window as a DOM child script
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src =
				'https://maps.googleapis.com/maps/api/js?key=' +
				environment.googleMapsAPIKey;
			script.async = true;
			script.defer = true;
			document.body.appendChild(script);

			// script listener is an anonymous arrow function
			script.onload = () => {
				const loadedGoogleModule = win.google;
				if (loadedGoogleModule && loadedGoogleModule.maps) {
					resolve(loadedGoogleModule.maps);
				} else {
					reject ('Google Maps SDK not available');
				}
			};
		});
	}
}
