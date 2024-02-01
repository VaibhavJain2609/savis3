import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneProportionCIComponent } from './one-proportion-ci.component';

describe('OneProportionCIComponent', () => {
  let component: OneProportionCIComponent;
  let fixture: ComponentFixture<OneProportionCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneProportionCIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneProportionCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
