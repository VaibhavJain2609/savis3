import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js'; // Change this line

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss']
})
export class ScatterPlotComponent implements OnChanges {
  @Input() dataPoints: { x: number, y: number }[] = [];
  scatterChartData: ChartDataSets[] = [];
  @Input() scatterChartOptions: ChartOptions = {};
  @Input() scatterChartLegend: boolean = true;
  @Input() scatterChartType: ChartType = 'scatter'; // Change this line
  leastSquares: number = 0

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataPoints']) {
      this.updateChartData();
      this.leastSquares = this.calculateLeastSquares();
    }
  }

  private updateChartData(): void {
    const regressionPoints = this.calculateRegressionPoints();
    const confidenceInterval = this.calculateConfidenceInterval();
  
    this.scatterChartData = [
      {
        data: this.dataPoints,
        label: 'Scatter Plot'
      },
      // Regression line dataset
      {
        type: 'line',
        label: 'Regression Line',
        data: regressionPoints,
        fill: false,
        borderColor: 'rgba(255, 0, 0, 0.7)',
        cubicInterpolationMode: 'monotone'
      },
      // Upper bound of confidence interval
      {
        type: 'line',
        label: 'Upper Bound',
        data: confidenceInterval.upper,
        fill: '+1',
        borderColor: 'rgba(0, 255, 0, 0.5)',
        cubicInterpolationMode: 'monotone'
      },
      // Lower bound of confidence interval
      {
        type: 'line',
        label: 'Lower Bound',
        data: confidenceInterval.lower,
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.5)',
        cubicInterpolationMode: 'monotone'
      }
    ] as ChartDataSets[];
  }

  private calculateRegressionPoints(): { x: number, y: number }[] {
    const n = this.dataPoints.length;
  
    if (n < 2) {
      // Linear regression requires at least two points
      return [];
    }
  
    // Calculate the mean of x and y
    const meanX = this.dataPoints.reduce((sum, point) => sum + point.x, 0) / n;
    const meanY = this.dataPoints.reduce((sum, point) => sum + point.y, 0) / n;
  
    // Calculate the slope (m) and y-intercept (b)
    const numerator = this.dataPoints.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
    const denominator = this.dataPoints.reduce((sum, point) => sum + Math.pow(point.x - meanX, 2), 0);
  
    const m = numerator / denominator;
    const b = meanY - m * meanX;
  
    // Calculate regression points
    return this.dataPoints.map(point => ({ x: point.x, y: m * point.x + b }));
  }

  private calculateConfidenceInterval(): { upper: { x: number, y: number }[], lower: { x: number, y: number }[] } {
    const regressionPoints = this.calculateRegressionPoints();
  
    // Calculate standard error of the regression coefficients (slope and intercept)
    const n = this.dataPoints.length;
    const meanX = this.dataPoints.reduce((sum, point) => sum + point.x, 0) / n;
    const meanY = this.dataPoints.reduce((sum, point) => sum + point.y, 0) / n;
  
    const numerator = this.dataPoints.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
    const denominator = this.dataPoints.reduce((sum, point) => sum + Math.pow(point.x - meanX, 2), 0);
  
    const m = numerator / denominator;
    const b = meanY - m * meanX;
  
    const residuals = this.dataPoints.map(point => point.y - (m * point.x + b));
    const sumSquaredResiduals = residuals.reduce((sum, residual) => sum + Math.pow(residual, 2), 0);
  
    const stdErrorM = Math.sqrt(sumSquaredResiduals / ((n - 2) * denominator)); // Standard error of the slope
    const tValue = 2.447; // For a 95% confidence interval with (n-2) degrees of freedom
  
    const upper = regressionPoints.map(point => ({ x: point.x, y: point.y + tValue * stdErrorM }));
    const lower = regressionPoints.map(point => ({ x: point.x, y: point.y - tValue * stdErrorM }));
  
    return { upper, lower };
  }

  private calculateLeastSquares(): number {
    const regressionPoints = this.calculateRegressionPoints();
    
    // Calculate the sum of squared residuals
    let sumSquaredResiduals = 0;
    for (let i = 0; i < this.dataPoints.length; i++) {
      const actualY = this.dataPoints[i].y;
      const predictedY = regressionPoints[i].y;
      sumSquaredResiduals += Math.pow(actualY - predictedY, 2);
    }
  
    return sumSquaredResiduals;
  }  
  
}
