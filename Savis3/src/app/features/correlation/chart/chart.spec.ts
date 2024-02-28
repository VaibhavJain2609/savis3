import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { Chart } from 'chart.js';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create a chart if xValues or yValues are empty', () => {
    component.xValues = [];
    component.yValues = [1, 2, 3];
    component.drawCorrelationChart();
  });

  it('should create a chart if xValues and yValues are provided', () => {
    component.xValues = [1, 2, 3];
    component.yValues = [4, 5, 6];
    fixture.detectChanges();
    component.drawCorrelationChart();
  });

  it('should not call drawCorrelationChart when xValues or yValues are empty', () => {
    const drawCorrelationChartSpy = jest.spyOn(
      component,
      'drawCorrelationChart'
    );
    component.xValues = [];
    component.yValues = [];

    let changes: SimpleChanges = {};
    component.ngOnChanges(changes);

    expect(drawCorrelationChartSpy).not.toHaveBeenCalled();
  });

  it('should call drawCorrelationChart when xValues or yValues change', () => {
    const drawCorrelationChartSpy = jest.spyOn(
      component,
      'drawCorrelationChart'
    );
    component.xValues = [1, 2, 3];
    component.yValues = [4, 5, 6];

    let changes: SimpleChanges = {};
    component.ngOnChanges(changes);

    expect(drawCorrelationChartSpy).toHaveBeenCalled();
  });
});
