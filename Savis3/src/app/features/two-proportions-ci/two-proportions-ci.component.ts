import { ChartDataSets, ChartOptions, ChartPoint, ChartType, ChartXAxe } from 'chart.js';
import { BaseChartDirective,Label } from 'ng2-charts';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StackedDotChartService } from 'src/app/Utils/stacked-dot-chart.service';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService } from 'src/app/Utils/sampling.service';
import { SummaryService } from 'src/app/Utils/summaries.service';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss', './../scss/base.scss']
})
export class TwoProportionsCIComponent implements OnInit {

  successA: number = 0;
  failureA: number = 0;
  successB: number = 0;
  failureB: number = 0;
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



  public barChartType1: ChartType = 'bar';
  public barChartType2: ChartType = 'scatter';



 public barChartData1: ChartDataSets[] = [
  {
    label: 'Group A',
    backgroundColor: ['green', 'red'], // Colors for success and failure bars for Group A
    hoverBackgroundColor: ['green', 'red'],
    data: [this.successA, this.failureA], // Data points for success and failure for Group A
  },
  {
    label: 'Group B',
    backgroundColor: ['green', 'red'], // Colors for success and failure bars for Group B
    hoverBackgroundColor: ['green', 'red'],
    data: [this.successB, this.failureB], // Data points for success and failure for Group B
  },
];

public barChartLabels1: string[] = ['Group A', 'Group B']; // Labels for the data points



public barChartData2: ChartDataSets[] = [
  {
    label: 'Group A',
    backgroundColor: ['green', 'red'], // Colors for success and failure bars for Group A
    hoverBackgroundColor: ['green', 'red'],
    data: [this.sampleASuccess, this.sampleAFailure], // Data points for success and failure for Group A
  },
  {
    label: 'Group B',
    backgroundColor: ['green', 'red'], // Colors for success and failure bars for Group B
    hoverBackgroundColor: ['green', 'red'],
    data: [this.sampleBSuccess, this.sampleBFailure], // Data points for success and failure for Group B
  },
];

public barChartLabels2: string[] = ['Group A', 'Group B']; // Labels for the data points




  public barChartData3: ChartDataSets[] =[
    {
      label: 'Values in Interval',
      backgroundColor: 'green',
      //hoverBackgroundColor: 'green',
      data: [],
      borderColor: 'green'
    },
    {
      label: 'Values not in Interval',
      backgroundColor: 'red',
      //hoverBackgroundColor: 'red',
      data: [],
      borderColor: 'red'
    },
  ];
  public barChartLabels3: any = [];
  
  public barChartOptions1: any={
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${datasetLabel}: ${value}%`; // Add your custom text
        }
      }
    },
    scales:{
      xAxes:[
        {
          stacked: true,
          ticks:{
            beginsAtZero: true,
          },
          scaleLabel:{
            display: true,
            labelString: 'Data'
          }
        }
      ],
      yAxes:[
        {
          id: 'groupAAxis',
          stacked: true,
          ticks:{
            min:0,
            max:100,
            stepSize:20,
            beginsAtZero: true,
          },
          scaleLabel:{
            display: true,
          }
        },
      ],
    },
    maintainAspectRatio: false,
  };

  public barChartOptions2: any={
    responsive: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: any) => {
          const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${datasetLabel}: ${value}%`; // Add your custom text
        }
      }
    },
    scales:{
      xAxes:[
        {
          stacked: true,
          ticks:{
            beginAtZero: true,
          },
          scaleLabel:{
            display: true,
            labelString: 'Data'
          }
        }
      ],
      yAxes:[
        {
          id: 'groupAAxis',
          stacked: true,
          ticks:{
            beginAtZero: true,
            min:0,
            max:100,
            stepSize:20
          },
          scaleLabel:{
            display: true,
          }
        },
      ],
    },
    maintainAspectRatio: false,
  };

  public barChartOptions3: any={
    responsive: true,
    scales:{
      xAxes:[
        {
          type: 'linear', // Important for scatter chart
          position: 'bottom',
          ticks:{
            max:1,
            //min:-1,
            stepSize: 0.2, 
            beginsAtZero: true,
          },
          scaleLabel: {
            display:true,
          }
        },
      ],
      yAxes:[
        {
          ticks:{
            min:1,
            stepSize:1,
            beginsAtZero: true,
          },
          scaleLabel:{
            display:true,
          }
        }
      ]
    },
    maintainAspectRatio: false,
  };

  
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.numASuccess = 0;
    this.numAFailure = 0;
    this.numBSuccess = 0;
    this.numBFailure = 0;
    this.updateChartData();

    this.numSimulations = 2 //Number of dots on the chart3
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

    // Calculate the total for each group
    const sampleTotalA = this.sampleASuccess + this.sampleAFailure;
    const sampleTotalB = this.sampleBSuccess + this.sampleBFailure;

    // Calculate the percentages
    const samplePercentASuccess = sampleTotalA > 0 ? (this.sampleASuccess / sampleTotalA) * 100 : 0;
    const samplePercentAFailure = sampleTotalA > 0 ? (this.sampleAFailure / sampleTotalA) * 100 : 0;
    const samplePercentBSuccess = sampleTotalB > 0 ? (this.sampleBSuccess / sampleTotalB) * 100 : 0;
    const samplePercentBFailure = sampleTotalB > 0 ? (this.sampleBFailure / sampleTotalB) * 100 : 0;

    // Update Chart 2 Data
    this.barChartData2 = [
        { data: [samplePercentASuccess, samplePercentBSuccess], label: 'Sample % Success', backgroundColor: 'rgba(0, 250, 0, 0.7)' },
        { data: [samplePercentAFailure, samplePercentBFailure], label: 'Sample % Failure', backgroundColor: 'rgba(255, 0, 0, 0.7)' }
    ];

    this.buildConfidenceInterval();
}



  


  buildConfidenceInterval(): void {
    if (this.numSimulations <= 1) {
      console.error('Number of simulations is too low to calculate a meaningful confidence interval.');
      return;
    }
  
    this.proportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
    const sampleDifferences: number[] = [];
    for (let i = 0; i < this.numSimulations; i++) {
      const sampleProportionASim = Math.random(); // Adjust as per your data distribution
      const sampleProportionBSim = Math.random(); // Adjust as per your data distribution
      const sampleProportionDiffSim = sampleProportionASim - sampleProportionBSim;
      sampleDifferences.push(sampleProportionDiffSim);
    }
  
    const sumSampleDifferences = sampleDifferences.reduce((acc, curr) => acc + curr, 0);
    this.meanSampleDiffs = sumSampleDifferences / this.numSimulations;
  
    const squaredDifferences = sampleDifferences.map(diff => Math.pow(diff - this.meanSampleDiffs, 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    this.stddevSampleDiffs = Math.sqrt(sumSquaredDifferences / this.numSimulations);
  
    console.log('Sample Differences:', sampleDifferences);
    console.log('Mean of Sample Differences:', this.meanSampleDiffs);
    console.log('Standard Deviation of Sample Differences:', this.stddevSampleDiffs);
  
    if (this.stddevSampleDiffs === 0) {
      console.error('Standard deviation is zero, indicating no variability in sample differences.');
      return;
    }
  
    const zScore = this.calculateZScore();
    const standardError = this.stddevSampleDiffs / Math.sqrt(this.numSimulations);
  
    this.lowerBound = this.meanSampleDiffs - zScore * standardError;
    this.upperBound = this.meanSampleDiffs + zScore * standardError;
  
    console.log('Lower Bound:', this.lowerBound);
    console.log('Upper Bound:', this.upperBound);
  
    let valuesInInterval = [];
    let valuesNotInInterval = [];
  
    for (const diff of sampleDifferences) {
      if (diff >= this.lowerBound && diff <= this.upperBound) {
        valuesInInterval.push({ x: diff, y: 1 });
      } else {
        valuesNotInInterval.push({ x: diff, y: 1 });
      }
    }
  
    this.barChartData3 = [
      {
        label: 'Values in Interval',
        backgroundColor: 'green',
        borderColor: 'green',
        data: valuesInInterval
      },
      {
        label: 'Values not in Interval',
        backgroundColor: 'red',
        borderColor: 'red',
        data: valuesNotInInterval
      },
    ];
  
    this.cdr.detectChanges();
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
    return 1.96; // Z-score for 95% confidence level
  }



  updateChartData(): void {
    // For Chart 1
    const totalA = this.numASuccess + this.numAFailure;
    const totalB = this.numBSuccess + this.numBFailure;
  
    // Avoid division by zero
    const percentASuccess = totalA > 0 ? (this.numASuccess / totalA) * 100 : 0;
    const percentAFailure = totalA > 0 ? (this.numAFailure / totalA) * 100 : 0;
    const percentBSuccess = totalB > 0 ? (this.numBSuccess / totalB) * 100 : 0;
    const percentBFailure = totalB > 0 ? (this.numBFailure / totalB) * 100 : 0;
  
    this.barChartData1 = [
      { data: [percentASuccess, percentBSuccess], label: '% Success', backgroundColor: 'rgba(0, 250, 0, 0.7)' },
      { data: [percentAFailure, percentBFailure], label: '% Failure', backgroundColor: 'rgba(255, 0, 0, 0.7)' }
    ];
}

}