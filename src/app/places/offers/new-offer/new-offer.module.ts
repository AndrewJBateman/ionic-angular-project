import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewOfferPage } from './new-offer.page';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
	{
		path: '',
		component: NewOfferPage
	}
];
@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		SharedModule
	],
	declarations: [NewOfferPage]
})
export class NewOfferPageModule {}
