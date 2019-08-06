import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
	selector: 'app-location-picker',
	templateUrl: './location-picker.component.html',
	styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

	constructor(private modalCtrl: ModalController) { }

	ngOnInit() {}

	onPickLocation() {
		this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
			modalEl.present();
		});
	}

}
