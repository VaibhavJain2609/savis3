import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OneProportionCIComponent } from './one-proportion-ci.component';
import { ElementRef } from '@angular/core';

HTMLCanvasElement.prototype.getContext = jest.fn();

describe('OneProportionCIComponent', () => {
  let component: OneProportionCIComponent;
  let fixture: ComponentFixture<OneProportionCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [OneProportionCIComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneProportionCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update chart data when loadData is called with valid success and failure values', () => {
    component.successInput = { nativeElement: { value: '5' } } as ElementRef<HTMLInputElement>;
    component.failureInput = { nativeElement: { value: '10' } } as ElementRef<HTMLInputElement>;

    component.loadData();

    expect(component.proportion).toBeCloseTo(0.3333, 4);
    expect(component.barChartData1[0].data[0]).toBeCloseTo(33.33, 2);
    expect(component.barChartData1[1].data[0]).toBeCloseTo(66.67, 2);
  });
});
