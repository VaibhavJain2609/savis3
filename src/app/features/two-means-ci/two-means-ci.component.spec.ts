import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoMeansCIComponent } from './two-means-ci.component';

describe('TwoMeansCIComponent', () => {
  let component: TwoMeansCIComponent;
  let fixture: ComponentFixture<TwoMeansCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoMeansCIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoMeansCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
