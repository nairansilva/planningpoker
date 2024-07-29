/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TotalVotingComponent } from './totalVoting.component';

describe('TotalVotingComponent', () => {
  let component: TotalVotingComponent;
  let fixture: ComponentFixture<TotalVotingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalVotingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
