import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';

const routes: Routes = [
	{
		path: '',
		component: PlaceDetailPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [PlaceDetailPage, CreateBookingComponent],
	entryComponents: [CreateBookingComponent]
})
export class PlaceDetailPageModule {}
