import { ModalController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-map-modal',
	templateUrl: './map-modal.component.html',
	styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

	// ViewChild is a property decorator that configures a view query.
	@ViewChild('map', { static: false }) mapElementRef: ElementRef;

	constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

	ngOnInit() {
	}

	// lifecycle hook that is called after Angular has fully initialized a component's view.
	// Used for any additional initialization tasks
	ngAfterViewInit() {
		this.getGoogleMaps().then(googleMaps => {
			const mapEl = this.mapElementRef.nativeElement;
			const map = new googleMaps.Map(mapEl, {
				center: { lat: 37.7964333, lng: -1.5121459 },
				zoom: 16
			});

			googleMaps.event.addListenerOnce(map, 'idle', () => {
				this.renderer.addClass(mapEl, 'visible');
			});

		}).catch(err => {
			console.log(err);
		});
	}

	onCancel() {
		this.modalCtrl.dismiss();
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
			script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsAPIKey;
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
