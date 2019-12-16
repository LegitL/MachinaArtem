import { TestBed } from '@angular/core/testing';

import { CommunityStylesService } from './community-styles.service';

describe('CommunityStyleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommunityStylesService = TestBed.get(CommunityStylesService);
    expect(service).toBeTruthy();
  });
});
