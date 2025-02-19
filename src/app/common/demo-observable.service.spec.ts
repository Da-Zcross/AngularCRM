import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DemoObservableService } from './demo-observable.service';

describe('DemoObservableService', () => {
  let service: DemoObservableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoObservableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit 3 values and complete', fakeAsync(() => {
    const emittedValues: number[] = [];
    let completed = false;

    service.getObservable().subscribe({
      next: (value) => emittedValues.push(value),
      complete: () => completed = true
    });

    // Test après 1 seconde
    tick(1000);
    expect(emittedValues).toEqual([1]);

    // Test après 2 secondes
    tick(1000);
    expect(emittedValues).toEqual([1, 2]);

    // Test après 3 secondes
    tick(1000);
    expect(emittedValues).toEqual([1, 2, 3]);

    // Test de la complétion après 4 secondes
    tick(1000);
    expect(completed).toBeTrue();
    expect(emittedValues).toEqual([1, 2, 3]);
  }));
});
