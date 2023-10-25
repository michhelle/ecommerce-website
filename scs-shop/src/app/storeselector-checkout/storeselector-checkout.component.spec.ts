import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreselectorCheckoutComponent } from './storeselector-checkout.component';

describe('StoreselectorCheckoutComponent', () => {
  let component: StoreselectorCheckoutComponent;
  let fixture: ComponentFixture<StoreselectorCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreselectorCheckoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreselectorCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
