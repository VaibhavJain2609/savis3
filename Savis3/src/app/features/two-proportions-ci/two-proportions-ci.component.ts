import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, ChartXAxe } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss', './../scss/base.scss']
})
export class TwoProportionsCIComponent implements OnInit {
  // Existing properties
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

  // Additional properties for displaying data
  proportionDiff: number | null = null;
  meanSampleDiffs: number | null = null;
  stddevSampleDiffs: number | null = null;
  lowerBound: number | null = null;
  upperBound: number | null = null;
  totalSamples: number | null = null;
  minHeads: number = 0; // Minimum number of heads in interval
  maxHeads: number = 0; // Maximum number of heads in interval

  // Chart colors
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

  // Chart properties
  chartData: ChartDataSets[] = [];
  
  
  chartLabels: Label[] = ["Group A", "Group B"];
  
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes:[
        {
          scaleLabel:{
            display: true,
            // labelString: '# of heads in 5 tosses',
            // fontColor: 'black',
            // fontSize: 14
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
            // labelString: '# of samples',
            // fontColor: 'black',
            // fontSize: 14
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
            return title.toString(); // Explicitly convert to string
          }
          return ''; // Return an empty string if tooltipItem[0] is undefined
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
          return ''; // Return an empty string if tooltipItem or tooltipItem.datasetIndex is undefined
        }
      }
    }
  };

 // custom chart properties
customChartData: ChartDataSets[] = [];
customChartLabels: Label[] = ["1"];
customChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Set to false to adjust the size freely
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
    // Initialization logic here
    this.numASuccess = 10;
    this.numAFailure = 5;
    this.numBSuccess = 8;
    this.numBFailure = 4;

    console.log(this.numAFailure);
    this.updateChartData();
  }

  loadData(): void {

    this.updateChartData();
    // Assuming you have some logic to compute sample proportions based on input data
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
  
    // Simulate random data for the most recent draw
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
  
    // Set the flag to indicate that data is loaded
    this.isDataLoaded = true;
  }

  runSimulations(): void {
    // Simulate random data for the most recent draw
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
  
    // Update other properties as needed
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);
  
    // Update the chart if you have a chart library (e.g., Chart.js)
    /*this.updateChart();*/
  }

  buildConfidenceInterval(): void {
    // Calculate the difference of proportions
    this.proportionDiff = (this.sampleProportionA ?? 0) - (this.sampleProportionB ?? 0);

    // Perform simulations to get sample differences
    const sampleDifferences: number[] = [];
    for (let i = 0; i < this.numSimulations; i++) {
      // Simulate random data
      const sampleProportionASim = Math.random(); // Replace with your logic
      const sampleProportionBSim = Math.random(); // Replace with your logic
      const sampleProportionDiffSim = sampleProportionASim - sampleProportionBSim;

      // Calculate the sample difference and add it to the array
      sampleDifferences.push(sampleProportionDiffSim);
    }

    // Calculate mean and standard deviation of sample differences
    const sumSampleDifferences = sampleDifferences.reduce((acc, curr) => acc + curr, 0);
    this.meanSampleDiffs = sumSampleDifferences / this.numSimulations;
    const squaredDifferences = sampleDifferences.map(diff => Math.pow(diff - (this.meanSampleDiffs ?? 0), 2));
    const sumSquaredDifferences = squaredDifferences.reduce((acc, curr) => acc + curr, 0);
    this.stddevSampleDiffs = Math.sqrt(sumSquaredDifferences / this.numSimulations);

    // Calculate confidence interval bounds
    const zScore = this.calculateZScore();
    this.lowerBound = (this.meanSampleDiffs ?? 0) - zScore * (this.stddevSampleDiffs ?? 0);
    this.upperBound = (this.meanSampleDiffs ?? 0) + zScore * (this.stddevSampleDiffs ?? 0);

    // Set total number of samples
    this.totalSamples = this.numSimulations;
  }

  applyChanges(): void {
    const incrementValue = parseInt((document.getElementById('increment') as HTMLInputElement).value, 10);
    
    // Update the data used for the chart
    this.numAFailure += incrementValue; // Increment failure A by the increment value
    this.numASuccess += incrementValue; // Increment success A by the increment value
    this.numBFailure += incrementValue; // Increment failure B by the increment value
    this.numBSuccess += incrementValue; // Increment success B by the increment value
    
    // Update the chart data
    this.updateChartData();
  }

  calculateZScore(): number {
    // You can use a Z-table or a statistical library for a more accurate value
    // Here, we'll use a standard value for a 95% confidence interval (1.96)
    return 1.96;
  }

// Method to populate the custom chart data
populateCustomChart(): void {
  // Data for values in the interval (green label)
  const valuesInIntervalData = [1, 2]; // Example data, replace with your actual data
  this.customChartData = [
    { 
      data: valuesInIntervalData,
      label: 'Values In Interval', // Green label
      backgroundColor: 'rgba(0, 255, 0, 0.3)', // Green color
      borderColor: 'rgba(0, 255, 0, 0.7)', // Green color border
      borderWidth: 1
    }
  ];

  // Data for values not in the interval (red label)
  const valuesNotInIntervalData = [0, 0]; // Example data, replace with your actual data
  this.customChartData.push(
    {
      data: valuesNotInIntervalData,
      label: 'Values Not in Interval', // Red label
      backgroundColor: 'rgba(255, 0, 0, 0.3)', // Red color
      borderColor: 'rgba(255, 0, 0, 0.7)', // Red color border
      borderWidth: 1
    }
  );

    // Adjusting the labels to indicate columns
    this.customChartLabels = ['-1.0', '-0.8', '-0.6', '-0.4', '-0.2', '0', '0.2', '0.4', '0.6', '0.8', '1.0'];
  }

  updateChartData(): void {
    // Update chart data with success and failure percentages
    const totalA = this.numASuccess + this.numAFailure;
    const totalB = this.numBSuccess + this.numBFailure;
    const percentASuccess = (this.numASuccess / totalA) * 100;
    const percentAFailure = (this.numAFailure / totalA) * 100;
    const percentBSuccess = (this.numBSuccess / totalB) * 100;
    const percentBFailure = (this.numBFailure / totalB) * 100;

    this.chartData = [
      { data: [percentASuccess, percentBSuccess], label: '% Success', backgroundColor: 'rgba(0, 250, 0, 0.7)' }, // Green
      { data: [percentAFailure, percentBFailure], label: '% Failure', backgroundColor: 'rgba(255, 0, 0, 0.7)' } // Red
    ];
  
    // Set colors for individual bars
    this.chartData[0].backgroundColor = ['rgba(0, 250, 0, 0.7)', 'rgba(0, 250, 0, 0.7)']; // Green
    this.chartData[1].backgroundColor = ['rgba(255, 0, 0, 0.7)', 'rgba(255, 0, 0, 0.7)']; // Red
  
    // Populate the custom chart
    this.populateCustomChart();
  }
}