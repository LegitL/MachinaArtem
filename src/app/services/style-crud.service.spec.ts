import { TestBed } from '@angular/core/testing';

import { StyleCrudService } from './style-crud.service';

describe('StyleCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StyleCrudService = TestBed.get(StyleCrudService);
    expect(service).toBeTruthy();
  });
});
