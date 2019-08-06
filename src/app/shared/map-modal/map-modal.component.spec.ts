import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapModalComponent } from './map-modal.component';

describe('MapModalComponent', () => {
	let component: MapModalComponent;
	let fixture: ComponentFixture<MapModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ MapModalComponent ],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MapModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
