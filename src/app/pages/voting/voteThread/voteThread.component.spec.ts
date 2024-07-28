/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VoteThreadComponent } from './voteThread.component';

describe('VoteThreadComponent', () => {
  let component: VoteThreadComponent;
  let fixture: ComponentFixture<VoteThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
