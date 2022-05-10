import { TestBed } from '@angular/core/testing';

import { SharedParameterService } from './shared-parameter.service';

describe('SharedParameterService', () => {
  let service: SharedParameterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedParameterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
