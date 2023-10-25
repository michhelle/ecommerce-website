import { TestBed } from '@angular/core/testing';

import { StoreSelectorService } from './store-selector.service';

describe('StoreSelectorService', () => {
  let service: StoreSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
