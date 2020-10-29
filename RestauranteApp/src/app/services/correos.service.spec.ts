import { TestBed } from '@angular/core/testing';

import { CorreosService } from './correos.service';

describe('CorreosService', () => {
  let service: CorreosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorreosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
