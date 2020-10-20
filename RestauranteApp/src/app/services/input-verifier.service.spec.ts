import { TestBed } from '@angular/core/testing';

import { InputVerifierService } from './input-verifier.service';

describe('InputVerifierService', () => {
  let service: InputVerifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputVerifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
