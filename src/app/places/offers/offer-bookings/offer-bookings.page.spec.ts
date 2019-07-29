import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferBookingsPage } from './offer-bookings.page';

describe('OfferBookingsPage', () => {
  let component: OfferBookingsPage;
  let fixture: ComponentFixture<OfferBookingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferBookingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferBookingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
