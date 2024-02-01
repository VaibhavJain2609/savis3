import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoProportionsCIComponent } from './two-proportions-ci.component';

describe('TwoProportionsCIComponent', () => {
  let component: TwoProportionsCIComponent;
  let fixture: ComponentFixture<TwoProportionsCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoProportionsCIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoProportionsCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
