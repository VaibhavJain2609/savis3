import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Add this import
import { ChartsModule } from 'ng2-charts'; // Add this import

import { TwoProportionsCIComponent } from './two-proportions-ci.component';

describe('TwoProportionsCIComponent', () => {
  let component: TwoProportionsCIComponent;
  let fixture: ComponentFixture<TwoProportionsCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoProportionsCIComponent ],
      imports: [ FormsModule, ChartsModule ] // Add FormsModule and ChartsModule here
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