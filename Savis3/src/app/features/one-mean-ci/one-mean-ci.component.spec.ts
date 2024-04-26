// one-mean-ci.component.spec.ts
import { OneMeanCIComponent } from './one-mean-ci.component';
import { TranslateService } from '@ngx-translate/core';
import { MathService } from 'src/app/Utils/math.service';
import { CoverageChartService } from './services/coverage-chart.service';

describe('OneMeanCIComponent', () => {
  let component: OneMeanCIComponent;
  let translateServiceMock: TranslateService;
  let coverageChartServiceMock: CoverageChartService;

  beforeEach(() => {
    coverageChartServiceMock = new CoverageChartService(null, null, null);
    component = new OneMeanCIComponent(translateServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('parseCSVtoSingleArray', () => {
    it('should parse CSV data correctly', () => {
      const rawData = '1.5\n2.0\n3.5\n4.0';
      const expected = [
        { id: 1, value: 1.5 },
        { id: 2, value: 2.0 },
        { id: 3, value: 3.5 },
        { id: 4, value: 4.0 },
      ];
      expect(component.parseCSVtoSingleArray(rawData)).toEqual(expected);
    });
  });

  describe('mean', () => {
    it('should calculate the mean correctly', () => {
      const data = [1, 2, 3, 4, 5];
      expect(component.mean(data)).toBe(3);
    });
  });

  describe('stddev', () => {
    it('should calculate the standard deviation correctly', () => {
      const data = [1, 2, 3, 4, 5];
      expect(component.stddev(data)).toBeCloseTo(1.5811, 4);
    });
  });

  describe('sampleStddev', () => {
    it('should calculate the sample standard deviation correctly', () => {
      const data = [1, 2, 3, 4, 5];
      expect(component.sampleStddev(data)).toBeCloseTo(1.7888, 4);
    });
  });

  describe('randomSubset', () => {
    it('should return a random subset of the given size', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const { chosen, unchosen } = component.randomSubset(data, 5);
      expect(chosen.length).toBe(5);
      expect(unchosen.length).toBe(5);
    });
  });

  // Add more test cases for other methods as needed
});
