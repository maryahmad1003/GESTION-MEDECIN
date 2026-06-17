import { TestBed } from '@angular/core/testing';

import { MedecinService } from './medecin.service';

describe('MedecinService', () => {
  let service: MedecinService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedecinService]
    });
    service = TestBed.inject(MedecinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
