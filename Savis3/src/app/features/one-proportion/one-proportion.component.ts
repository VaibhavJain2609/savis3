import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartXAxe } from 'chart.js';
import { ChartDataSets, ChartOptions  } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-one-proportion',
  templateUrl: './one-proportion.component.html',
  styleUrls: ['./one-proportion.component.scss']
})
export class OneProportionComponent{
  // User input properties
  probabilityOfHeads: number = 0.5; // Default probability of heads
  numberOfTosses: number = 5; // Default number of tosses
  sampleSize: number = 1; // Default number of samples to draw
  minHeads: number = 0; // Minimum number of heads in interval
  maxHeads: number = 0; // Maximum number of heads in interval
  interval: number = 0; // number of samples in interval
  proportion: string = '1/1 = 1.000'

  // Statistical properties
  totalSamples: number = 0; // Total number of samples drawn
  meanHeads: number = 0; // Mean number of heads observed
  standardDeviation: number = 0; // Standard deviation of number of heads

  // Chart colors
  colors = {
    sample: 'rgba(255, 0, 0, 0.7)',
    binomial: 'rgba(0, 0, 255, 0.6',
    selected: 'rgba(0, 255, 0, 0.6)',
    line: 'rgba(0, 255, 0, 0.6)',
    box: 'rgba(0, 255, 0, 0.1)',
    invisible: 'rgba(0, 255, 0, 0.0)'
  }

  // Chart properties
  chartData: ChartDataSets[]
  
  chartLabels: Label[];
  
  chartOptions: ChartOptions

  chartColors: Color[]

  constructor(
    private translate: TranslateService,
    ) {
    // Chart data
    this.chartData = [
      { 
        data: [], 
        label: this.translate.instant('op_bar_sample'),
        borderWidth: 1,
        backgroundColor: this.colors.sample,
        hidden: false,
        barPercentage: 1.0
      },
      {
        type: 'line',
        label: this.translate.instant('op_bar_binomial'),
        data: [],
        borderWidth: 1,
        borderColor: this.colors.binomial,
        backgroundColor: this.colors.binomial,
        pointRadius: 3,
        fill: false,
        hidden: false,
        barPercentage: 1.0
      },
      {
        type: 'line',
        label: this.translate.instant('op_bar_selected'),
        data: [],
        borderWidth: 0.1,
        backgroundColor: this.colors.selected,
        hidden: false,
        fill: 'end',
        barPercentage: 1.0
      }
    ]

    // Chart labels
    this.chartLabels = ['0', '1', '2', '3', '4', '5']

    // Chart options
    this.chartOptions = {
      responsive: true,
      scales: {
        xAxes:[
          {
            scaleLabel:{
              display: true,
              labelString: `${this.translate.instant('op_bar_heads')} ` + this.maxHeads + ` ${this.translate.instant('op_bar_heads2')}`,
              // fontColor: 'black',
              // fontSize: 14
            }
          } as ChartXAxe
        ],
        yAxes: [
          {
            ticks:{
              max: 1,
              beginAtZero: true,
              stepSize: 0.1,
            },
            scaleLabel: {
              display: true,
              labelString: this.translate.instant('op_bar_num_samples'),
              // fontColor: 'black',
              // fontSize: 14
            }
          }
      ]
      },
      maintainAspectRatio: true,
      tooltips: {
        mode: 'index',
        backgroundColor: 'rgba(0, 0, 0, 1.0)',
        callbacks: {
          title: function(tooltipItem, data) {
            if (tooltipItem[0]) {
              let title = tooltipItem[0].xLabel || '';
              title += ` heads`;
              return title.toString(); // Explicitly convert to string
            }
            return ''; // Return an empty string if tooltipItem[0] is undefined
          },
          label: (tooltipItem, data) => {
            if (tooltipItem && tooltipItem.datasetIndex !== undefined) {
              if (tooltipItem.datasetIndex !== 2) {
                return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${tooltipItem.yLabel}`;
              } else {
                return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${
                  this.maxHeads - this.minHeads + 1
                }`
              }
            }
            return ''; // Return an empty string if tooltipItem or tooltipItem.datasetIndex is undefined
          }
        }
      }
    }

    // Chart colors
    this.chartColors = [
      {
        backgroundColor: 'rgba(0,255,0,0.3)',
        borderColor: 'green'
      },
      {
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red'
      }
    ]

    

  }

  // ngOnInit() {

  // }

  // Reset the form and chart data
  reset() {
    this.probabilityOfHeads = 0.5
    this.numberOfTosses = 5
    this.sampleSize = 1
    this.minHeads = 0
    this.maxHeads = 0
    this.totalSamples = 0
    this.meanHeads = 0
    this.standardDeviation = 0
    this.chartData = [
      { 
        data: [],
        label: this.translate.instant('op_bar_sample'),
        borderWidth: 1,
        backgroundColor: this.colors.sample,
        hidden: false
      },
      {
        type: 'line',
        data: [],
        label: this.translate.instant('op_bar_binomial'),
        borderWidth: 1,
        borderColor: this.colors.binomial,
        backgroundColor: this.colors.binomial,
        pointRadius: 3,
        fill: false,
        hidden: false,
      },
      {
        type: 'line',
        data: [],
        label: this.translate.instant('op_bar_selected'),
        borderWidth: 0.1,
        backgroundColor: this.colors.selected,
        hidden: false,
        barPercentage: 1.0
      }
    ]
    this.chartLabels = ['0', '1', '2', '3', '4', '5']
  }

  // Draw samples and update chart
  drawSamples() {
    // Here you would calculate the sample based on the binomial distribution
    // with this.probabilityOfHeads and this.numberOfTosses.
    // For the purpose of this example, we will just simulate some data.

    // Simulate drawing samples and calculating statistics
    let simulatedHeads = this.simulateDrawingSamples(this.probabilityOfHeads, this.numberOfTosses, this.sampleSize)
    this.meanHeads = simulatedHeads.reduce((a, b) => a + b, 0) / simulatedHeads.length
    this.standardDeviation = this.calculateStandardDeviation(simulatedHeads, this.meanHeads)
    this.totalSamples += this.sampleSize

    // Update chart data
    this.updateChartData(simulatedHeads)
  }

  // Simulate drawing samples
  simulateDrawingSamples(probability: number, tosses: number, size: number): number[] {
    let samples = [];
    for (let i = 0; i < size; i++) {
      let heads = 0;
      for (let j = 0; j < tosses; j++) {
        if (Math.random() < probability) {
          heads++;
        }
      }
      samples.push(heads);
    }
    return samples;
  }

  // Calculate the standard deviation of the sample
  calculateStandardDeviation(samples: number[], mean: number): number {
    const sumOfSquares = samples.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    return Math.sqrt(sumOfSquares / samples.length);
  }

  // Update the chart with new data
  updateChartData(sampleData: number[]) {
    console.log(this.numberOfTosses)

    // You would calculate the actual probabilities here
    // For the purpose of this example, we'll just count the occurrences
    let occurrenceCounts = new Array(this.numberOfTosses + 1).fill(0);
    sampleData.forEach(heads => {
      occurrenceCounts[heads]++
    })

    // Convert counts to probabilities
    let probabilities = occurrenceCounts.map(count => count / this.sampleSize);
    this.chartData = [
      { 
        data: probabilities,
        label: this.translate.instant('op_bar_sample'),
        borderWidth: 1,
        backgroundColor: this.colors.sample,
        hidden: false
      },
      {
        type: 'line',
        data: [],
        label: this.translate.instant('op_bar_binomial'),
        borderWidth: 1,
        borderColor: this.colors.binomial,
        backgroundColor: this.colors.binomial,
        pointRadius: 3,
        fill: false,
        hidden: false,
      },
      {
        type: 'line',
        data: [],
        label: this.translate.instant('op_bar_selected'),
        borderWidth: 0.1,
        backgroundColor: this.colors.selected,
        hidden: false,
        barPercentage: 1.0
      }
    ]

    // Update the label on the x-axis with the number of Tosses
    // this.chartLabels = this.generateLabels();

  }

  generateLabels(): void {
    this.chartLabels = Array.from({ length: this.numberOfTosses + 1 }, (_, i) => i.toString());
  }

  updateSelected(): void {
    console.log(this.chartData[2])

    console.log(this.minHeads, this.maxHeads)

    // Update x axis data for selected area to be highlighted the range is from minHeads to maxHeads
    this.chartData[2].data = [
      { x: this.minHeads, y: 0 },
      { x: this.minHeads, y: 1 },
      { x: this.maxHeads, y: 1 },
      { x: this.maxHeads, y: 0 }
    ]

  }

}
