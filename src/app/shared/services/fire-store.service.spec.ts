/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FireStoreService } from './fire-store.service';

describe('Service: FireStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireStoreService]
    });
  });

  it('should ...', inject([FireStoreService], (service: FireStoreService) => {
    expect(service).toBeTruthy();
  }));
});
