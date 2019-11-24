import { TestBed } from '@angular/core/testing';

import { WikiArtService } from './wiki-art.service';

describe('WikiArtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WikiArtService = TestBed.get(WikiArtService);
    expect(service).toBeTruthy();
  });
});
