import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneMeanCIComponent } from './one-mean-ci.component';

describe('OneMeanCIComponent', () => {
  let component: OneMeanCIComponent;
  let fixture: ComponentFixture<OneMeanCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneMeanCIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneMeanCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
