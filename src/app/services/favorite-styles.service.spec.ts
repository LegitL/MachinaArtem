import { TestBed } from '@angular/core/testing';

import { FavoriteStylesService } from './favorite-styles.service';

describe('FavoriteStylesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoriteStylesService = TestBed.get(FavoriteStylesService);
    expect(service).toBeTruthy();
  });
});
