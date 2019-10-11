import { TestBed } from '@angular/core/testing';

import { DeepStyleService } from './deep-style.service';

describe('DeepStyleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeepStyleService = TestBed.get(DeepStyleService);
    expect(service).toBeTruthy();
  });
});
