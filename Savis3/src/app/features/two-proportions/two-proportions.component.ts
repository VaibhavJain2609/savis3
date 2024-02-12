import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-two-proportions',
  templateUrl: './two-proportions.component.html',
  styleUrls: ['./two-proportions.component.scss']
})
export class TwoProportionsComponent implements OnInit {
  
  numASuccess: number;
  numAFailure: number;
  numBSuccess: number;
  numBFailure: number;
  sampleProportionA: number;
  sampleProportionB: number;
  sampleProportionDiff: number;
  sampleAFailure: number;
  sampleASuccess: number;
  sampleBFailure: number;
  sampleBSuccess: number;

  
  numSimulations: number;
  isDataLoaded: boolean = false;

  
  selectedTestOption: string;
  prop_diff: number;
  samDisActive: boolean = false;
  proportionDiff: number;
  meanSampleDiffs: number;
  stddevSampleDiffs: number;
  totalSamples: number;
  extremediff: number;
  propextremediff: number;

  constructor() { }

  ngOnInit(): void {
  }

  // Method to load data
  loadData() {
    // Implement data loading logic here
    // Update variables like sampleProportionA, sampleProportionB, etc.
    this.isDataLoaded = true;
  }

  // Method to run simulations
  runSimulations() {
    // Implement simulation logic here
    // Update variables based on simulation results
  }

  // Method for handling test type change
  onTestTypeChange() {
    // Implement logic for test type change
  }
}
