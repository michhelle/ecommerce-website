import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSelectorNavComponent } from './storeselector-nav.component';

describe('StoreSelectorNavComponent', () => {
  let component: StoreSelectorNavComponent;
  let fixture: ComponentFixture<StoreSelectorNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSelectorNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreSelectorNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
