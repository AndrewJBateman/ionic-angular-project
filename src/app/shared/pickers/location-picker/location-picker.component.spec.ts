import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPickerComponent } from './location-picker.component';

describe('LocationPickerComponent', () => {
	let component: LocationPickerComponent;
	let fixture: ComponentFixture<LocationPickerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ LocationPickerComponent ],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LocationPickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
