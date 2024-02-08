import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoMeansComponent } from './two-means.component';

describe('TwoMeansComponent', () => {
  let component: TwoMeansComponent;
  let fixture: ComponentFixture<TwoMeansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoMeansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoMeansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
