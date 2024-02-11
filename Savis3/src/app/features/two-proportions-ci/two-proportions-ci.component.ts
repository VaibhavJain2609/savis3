/*

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss', './../scss/base.scss']
})
export class TwoProportionsCIComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
*/





/*
import { Component, OnInit } from '@angular/core';

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

  // Add these properties if they are used for displaying data
  sampleProportionA: number | null = null;
  sampleProportionB: number | null = null;
  sampleProportionDiff: number | null = null;
  sampleAFailure: number | null = null;
  sampleASuccess: number | null = null;
  sampleBFailure: number | null = null;
  sampleBSuccess: number | null = null;
  isDataLoaded: boolean = false; // Example property for disabling buttons

  // Add these new properties for the template
  proportionDiff: number | null = null;
  meanSampleDiffs: number | null = null;
  stddevSampleDiffs: number | null = null;
  lowerBound: number | null = null;
  upperBound: number | null = null;
  totalSamples: number | null = null;
  

  constructor() { }

  ngOnInit(): void {
    // Initialization logic here
  }

  // Make sure to implement these methods
  loadData(): void {
    // Your logic here
  }

  runSimulations(): void {
    // Your logic here
  }

  buildConfidenceInterval(): void {
    // Your logic here
  }

  // Add other methods and logic as needed
}

*/












/*

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-two-proportions-ci',
  templateUrl: './two-proportions-ci.component.html',
  styleUrls: ['./two-proportions-ci.component.scss', './../scss/base.scss']
})
export class TwoProportionsCIComponent implements OnInit {
  // ... (existing properties)

  numASuccess: number = 0;
  numAFailure: number = 0;
  numBSuccess: number = 0;
  numBFailure: number = 0;
  numSimulations: number = 1;
  confidenceLevel: number = 95;

  // Add these properties if they are used for displaying data
  sampleProportionA: number | null = null;
  sampleProportionB: number | null = null;
  sampleProportionDiff: number | null = null;
  sampleAFailure: number | null = null;
  sampleASuccess: number | null = null;
  sampleBFailure: number | null = null;
  sampleBSuccess: number | null = null;
  isDataLoaded: boolean = false; // Example property for disabling buttons

  // Add these new properties for the template
  proportionDiff: number | null = null;
  meanSampleDiffs: number | null = null;
  stddevSampleDiffs: number | null = null;
  lowerBound: number | null = null;
  upperBound: number | null = null;
  totalSamples: number | null = null;

  constructor() { }

  ngOnInit(): void {
    // Initialization logic here (DONE).

    this.numASuccess = 10;
    this.numAFailure = 5;
    this.numBSuccess = 8;
    this.numBFailure = 4;
  }

  loadData(): void {
    // Assuming you have some logic to compute sample proportions based on input data
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = this.sampleProportionA - this.sampleProportionB;
  
    // Simulate random data for the most recent draw
    this.sampleAFailure = Math.floor(Math.random() * 10); // Replace with your logic (DONE)
    this.sampleASuccess = Math.floor(Math.random() * 10); // Replace with your logic (DONE)
    this.sampleBFailure = Math.floor(Math.random() * 10); // Replace with your logic (DONE)
    this.sampleBSuccess = Math.floor(Math.random() * 10); // Replace with your logic (DONE)
  
    // Set the flag to indicate that data is loaded
    this.isDataLoaded = true;
  }

  // ... (other methods and logic)

  runSimulations(): void {
    // Simulate random data for the most recent draw
    this.sampleAFailure = Math.floor(Math.random() * 10);
    this.sampleASuccess = Math.floor(Math.random() * 10);
    this.sampleBFailure = Math.floor(Math.random() * 10);
    this.sampleBSuccess = Math.floor(Math.random() * 10);
  
    // Update other properties as needed
    this.sampleProportionA = this.numASuccess / (this.numASuccess + this.numAFailure);
    this.sampleProportionB = this.numBSuccess / (this.numBSuccess + this.numBFailure);
    this.sampleProportionDiff = this.sampleProportionA - this.sampleProportionB;
  
    // Update the chart if you have a chart library (e.g., Chart.js)
    /*this.updateChart();*/
    /*
  }

  buildConfidenceInterval(): void {
    // Your logic for building confidence interval
  }

  // ... (other methods and logic)
}

*/



import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    // Initialization logic here
    this.numASuccess = 10;
    this.numAFailure = 5;
    this.numBSuccess = 8;
    this.numBFailure = 4;
  }

  loadData(): void {
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

  calculateZScore(): number {
    // You can use a Z-table or a statistical library for a more accurate value
    // Here, we'll use a standard value for a 95% confidence interval (1.96)
    return 1.96;
  }
}









