import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneMeanComponent } from './one-mean.component';

describe('OneMeanComponent', () => {
  let component: OneMeanComponent;
  let fixture: ComponentFixture<OneMeanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneMeanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneMeanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
