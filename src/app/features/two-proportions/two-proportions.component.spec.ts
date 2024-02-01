import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoProportionsComponent } from './two-proportions.component';

describe('TwoProportionsComponent', () => {
  let component: TwoProportionsComponent;
  let fixture: ComponentFixture<TwoProportionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoProportionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoProportionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
