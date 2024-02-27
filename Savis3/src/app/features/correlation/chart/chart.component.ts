import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit {
  constructor() {}

  @ViewChild('correlationChart') chartCanvas!: ElementRef;

  chart: Chart | null = null;

  @Input() xValues: number[] = [];
  @Input() yValues: number[] = [];

  @Input() valuesCheck: boolean = false;

  drawCorrelationChart() {
    if (this.xValues.length == 0 || this.yValues.length == 0) {
      return;
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    const data = {
      datasets: [
        {
          label: 'Scatter Plot',
          data: this.xValues.map((value, index) => ({
            x: value,
            y: this.yValues[index],
          })),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 3,
          pointRadius: 1,
          pointHoverRadius: 8,
        },
      ],
    };

    const options = {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
        },
        y: {
          type: 'linear',
          position: 'left',
        },
      },
      maintainAspectRatio: true,
      responsive: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      // devicePixelRatio: 2, // Adjust the devicePixelRatio for better clarity
    } as any;

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: data,
      options: options,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.xValues.length == 0 || this.yValues.length == 0) {
      return;
    }
    this.drawCorrelationChart();
  }

  ngAfterViewInit(): void {}
}
