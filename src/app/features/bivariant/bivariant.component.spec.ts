import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BivariantComponent } from './bivariant.component';

describe('BivariantComponent', () => {
  let component: BivariantComponent;
  let fixture: ComponentFixture<BivariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BivariantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BivariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
