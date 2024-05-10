import { TestBed } from '@angular/core/testing';

import { ClienteService } from './Cliente.service';

describe('EmpleadoService', () => {
  let service: ClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
