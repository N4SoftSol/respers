import { TestBed } from '@angular/core/testing';
import { Individual } from './individual';

describe('Individual', () => {
  let service: Individual;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Individual);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
