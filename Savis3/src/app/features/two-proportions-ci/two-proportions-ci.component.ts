
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, ChartXAxe } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormsModule } from '@angular/forms'; // Add this import
import { ChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss', './../scss/base.scss']
})
export class TwoProportionsCIComponent implements OnInit {

  numASuccess: number = 0;
  numAFailure: number = 0;
  numBSuccess: number = 0;
  numBFailure: number = 0;
  numSimulations: number = 1;
  confidenceLevel: number = 95;
  sampleProportionA: number | null = null;
  sampleProportionB: number | null = null;
  sampleProportionDiff: number | null = null;
  sampleAFailure: number | null = null;
  sampleASuccess: number | null = null;
  sampleBFailure: number | null = null;
  sampleBSuccess: number | null = null;
  isDataLoaded: boolean = false;
  proportionDiff: number | null = null;
  meanSampleDiffs: number | null = null;
  stddevSampleDiffs: number | null = null;
  lowerBound: number | null = null;
  upperBound: number | null = null;
  totalSamples: number | null = null;
  minHeads: number = 0;
  maxHeads: number = 0;
  colors = {
    sample: 'rgba(255, 0, 0, 0.7)',
    binomial: 'rgba(0, 0, 255, 0.6',
    selected: 'rgba(0, 255, 0, 0.6)',
    line: 'rgba(0, 255, 0, 0.6)',
    box: 'rgba(0, 255, 0, 0.1)',
    green: 'rgba(0,255,0,0.3)',
    red: 'rgba(255,0,0,0.3)',
    invisible: 'rgba(0, 255, 0, 0.0)'
  }
  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = ["Group A", "Group B"];
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes:[
        {
          scaleLabel:{
            display: true,
          }
        } as ChartXAxe
      ],
      yAxes: [
        {
          ticks:{
            max: 100,
            beginAtZero: true,
            stepSize: 20,
          },
          scaleLabel: {
            display: true,
          }
        }
    ]
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      backgroundColor: 'rgba(0, 0, 0, 1.0)',
      callbacks: {
        title: function(tooltipItem, data) {
          if (tooltipItem[0]) {
            let title = tooltipItem[0].xLabel || '';
            title += ` heads`;
            return title.toString();
          }
          return '';
        },
        label: (tooltipItem, data) => {
          if (tooltipItem && tooltipItem.datasetIndex !== undefined) {
            if (tooltipItem.datasetIndex !== 2) {
              return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${tooltipItem.yLabel} %`;
            } else {
              return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${
                this.maxHeads - this.minHeads + 1
              } %`
            }
          }
          return '';
        }
      }
    }
  };
  customChartData: ChartDataSets[] = [];
  customChartLabels: Label[] = ["1"];
  customChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          fontColor: 'black',
          fontSize: 14
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          fontColor: 'black',
          fontSize: 14
        }
      }]
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.numASuccess = 10;
    this.numAFailure = 5;
    this.numBSuccess = 8;
    this.numBFailure = 4;
    this.updateChartData();
  }

  loadData(): void {
    this.updateChartData();
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
    this.isDataLoaded = true;
  }

  runSimulations(): void {
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
  }

  buildConfidenceInterval(): void {
    this.proportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    const sampleDifferences: number[] = [];
    for (let i = 0; i < this.numSimulations; i++) {
      const sampleProportionASim = Math.random();
      const sampleProportionBSim = Math.random();
      const sampleProportionDiffSim = sampleProportionASim - sampleProportionBSim;
      sampleDifferences.push(sampleProportionDiffSim);
    }
    const sumSampleDifferences = sampleDifferences.reduce((acc, curr) => acc + curr, 0);
    this.meanSampleDiffs = sumSampleDifferences / this.numSimulations;
    const squaredDifferences = sampleDifferences.map(diff => Math.pow(diff - (this.meanSampleDiffs ?? 0), 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    this.stddevSampleDiffs = Math.sqrt(sumSquaredDifferences / this.numSimulations);
    const zScore = this.calculateZScore();
    this.lowerBound = (this.meanSampleDiffs ?? 0) - zScore * (this.stddevSampleDiffs ?? 0);
    this.upperBound = (this.meanSampleDiffs ?? 0) + zScore * (this.stddevSampleDiffs ?? 0);
    this.totalSamples = this.numSimulations;
  }

  applyChanges(): void {
    const incrementValue = parseInt((document.getElementById('increment') as HTMLInputElement).value, 10);
    this.numAFailure += incrementValue;
    this.numASuccess += incrementValue;
    this.numBFailure += incrementValue;
    this.numBSuccess += incrementValue;
    this.updateChartData();
  }

  calculateZScore(): number {
    return 1.96;
  }

  populateCustomChart(): void {
    const valuesInIntervalData = [1, 2];
    this.customChartData = [
      { 
        data: valuesInIntervalData,
        label: 'Values In Interval',
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        borderColor: 'rgba(0, 255, 0, 0.7)',
        borderWidth: 1
      }
    ];
    const valuesNotInIntervalData = [0, 0];
    this.customChartData.push(
      {
        data: valuesNotInIntervalData,
        label: 'Values Not in Interval',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 1
      }
    );
    this.customChartLabels = ['-1.0', '-0.8', '-0.6', '-0.4', '-0.2', '0', '0.2', '0.4', '0.6', '0.8', '1.0'];
  }

  updateChartData(): void {
    const totalA = this.numASuccess + this.numAFailure;
    const totalB = this.numBSuccess + this.numBFailure;
    const percentASuccess = (this.numASuccess / totalA) * 100;
    const percentAFailure = (this.numAFailure / totalA) * 100;
    const percentBSuccess = (this.numBSuccess / totalB) * 100;
    const percentBFailure = (this.numBFailure / totalB) * 100;
    this.chartData = [
      { data: [percentASuccess, percentBSuccess], label: '% Success', backgroundColor: 'rgba(0, 250, 0, 0.7)' },
      { data: [percentAFailure, percentBFailure], label: '% Failure', backgroundColor: 'rgba(255, 0, 0, 0.7)' }
    ];
    this.chartData[0].backgroundColor = ['rgba(0, 250, 0, 0.7)', 'rgba(0, 250, 0, 0.7)'];
    this.chartData[1].backgroundColor = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.7)'];
    this.populateCustomChart();
  }
}






/*
the graph is reflced by the loaded data.
import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, ChartXAxe } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss', './../scss/base.scss']
})
export class TwoProportionsCIComponent implements OnInit {

  newNumAFailure: number = 0;
  newNumASuccess: number = 0;
  newNumBFailure: number = 0;
  newNumBSuccess: number = 0;

  numASuccess: number = 0;
  numAFailure: number = 0;
  numBSuccess: number = 0;
  numBFailure: number = 0;
  numSimulations: number = 1;
  confidenceLevel: number = 95;
  sampleProportionA: number | null = null;
  sampleProportionB: number | null = null;
  sampleProportionDiff: number | null = null;
  sampleAFailure: number | null = null;
  sampleASuccess: number | null = null;
  sampleBFailure: number | null = null;
  sampleBSuccess: number | null = null;
  isDataLoaded: boolean = false;
  proportionDiff: number | null = null;
  meanSampleDiffs: number | null = null;
  stddevSampleDiffs: number | null = null;
  lowerBound: number | null = null;
  upperBound: number | null = null;
  totalSamples: number | null = null;
  minHeads: number = 0;
  maxHeads: number = 0;
  colors = {
    sample: 'rgba(255, 0, 0, 0.7)',
    binomial: 'rgba(0, 0, 255, 0.6',
    selected: 'rgba(0, 255, 0, 0.6)',
    line: 'rgba(0, 255, 0, 0.6)',
    box: 'rgba(0, 255, 0, 0.1)',
    green: 'rgba(0,255,0,0.3)',
    red: 'rgba(255,0,0,0.3)',
    invisible: 'rgba(0, 255, 0, 0.0)'
  }
  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = ["Group A", "Group B"];
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes:[
        {
          scaleLabel:{
            display: true,
          }
        } as ChartXAxe
      ],
      yAxes: [
        {
          ticks:{
            max: 100,
            beginAtZero: true,
            stepSize: 20,
          },
          scaleLabel: {
            display: true,
          }
        }
    ]
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      backgroundColor: 'rgba(0, 0, 0, 1.0)',
      callbacks: {
        title: function(tooltipItem, data) {
          if (tooltipItem[0]) {
            let title = tooltipItem[0].xLabel || '';
            title += ` heads`;
            return title.toString();
          }
          return '';
        },
        label: (tooltipItem, data) => {
          if (tooltipItem && tooltipItem.datasetIndex !== undefined) {
            if (tooltipItem.datasetIndex !== 2) {
              return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${tooltipItem.yLabel} %`;
            } else {
              return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${
                this.maxHeads - this.minHeads + 1
              } %`
            }
          }
          return '';
        }
      }
    }
  };
  customChartData: ChartDataSets[] = [];
  customChartLabels: Label[] = ["1"];
  customChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          fontColor: 'black',
          fontSize: 14
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          fontColor: 'black',
          fontSize: 14
        }
      }]
    }
  };

  constructor() { }

  ngOnInit(): void {
    this.numASuccess = 10;
    this.numAFailure = 5;
    this.numBSuccess = 8;
    this.numBFailure = 4;
    this.updateChartData(this.numASuccess, this.numAFailure, this.numBSuccess, this.numBFailure);
  }

  loadData(): void {
    this.updateChartData(this.numASuccess, this.numAFailure, this.numBSuccess, this.numBFailure);
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
    this.isDataLoaded = true;
  }

  runSimulations(): void {
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
  }

  buildConfidenceInterval(): void {
    this.proportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    const sampleDifferences: number[] = [];
    for (let i = 0; i < this.numSimulations; i++) {
      const sampleProportionASim = Math.random();
      const sampleProportionBSim = Math.random();
      const sampleProportionDiffSim = sampleProportionASim - sampleProportionBSim;
      sampleDifferences.push(sampleProportionDiffSim);
    }
    const sumSampleDifferences = sampleDifferences.reduce((acc, curr) => acc + curr, 0);
    this.meanSampleDiffs = sumSampleDifferences / this.numSimulations;
    const squaredDifferences = sampleDifferences.map(diff => Math.pow(diff - (this.meanSampleDiffs ?? 0), 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    this.stddevSampleDiffs = Math.sqrt(sumSquaredDifferences / this.numSimulations);
    const zScore = this.calculateZScore();
    this.lowerBound = (this.meanSampleDiffs ?? 0) - zScore * (this.stddevSampleDiffs ?? 0);
    this.upperBound = (this.meanSampleDiffs ?? 0) + zScore * (this.stddevSampleDiffs ?? 0);
    this.totalSamples = this.numSimulations;
  }

  applyChanges(): void {
    const incrementValue = parseInt((document.getElementById('increment') as HTMLInputElement).value, 10);
    
    // Create new variables for the updated values
    const newNumAFailure = this.numAFailure + incrementValue;
    const newNumASuccess = this.numASuccess + incrementValue;
    const newNumBFailure = this.numBFailure + incrementValue;
    const newNumBSuccess = this.numBSuccess + incrementValue;
  
    // Call updateChartData with the updated values
    this.updateChartData(newNumASuccess, newNumAFailure, newNumBSuccess, newNumBFailure);
  }

  calculateZScore(): number {
    return 1.96;
  }

  populateCustomChart(): void {
    const valuesInIntervalData = [1, 2];
    this.customChartData = [
      { 
        data: valuesInIntervalData,
        label: 'Values In Interval',
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        borderColor: 'rgba(0, 255, 0, 0.7)',
        borderWidth: 1
      }
    ];
    const valuesNotInIntervalData = [0, 0];
    this.customChartData.push(
      {
        data: valuesNotInIntervalData,
        label: 'Values Not in Interval',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 1
      }
    );
    this.customChartLabels = ['-1.0', '-0.8', '-0.6', '-0.4', '-0.2', '0', '0.2', '0.4', '0.6', '0.8', '1.0'];
  }

updateChartData(numASuccess: number, numAFailure: number, numBSuccess: number, numBFailure: number): void {
  const totalA = numASuccess + numAFailure;
  const totalB = numBSuccess + numBFailure;
  const percentASuccess = (numASuccess / totalA) * 100;
  const percentAFailure = (numAFailure / totalA) * 100;
  const percentBSuccess = (numBSuccess / totalB) * 100;
  const percentBFailure = (numBFailure / totalB) * 100;

  this.chartData = [
    { data: [percentASuccess, percentBSuccess], label: '% Success', backgroundColor: 'rgba(0, 250, 0, 0.7)' },
    { data: [percentAFailure, percentBFailure], label: '% Failure', backgroundColor: 'rgba(255, 0, 0, 0.7)' }
  ];

  this.chartData[0].backgroundColor = ['rgba(0, 250, 0, 0.7)', 'rgba(0, 250, 0, 0.7)'];
  this.chartData[1].backgroundColor = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.7)'];

  this.populateCustomChart();
}
}

*/