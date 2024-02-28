import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { chatClass } from 'src/app/Utils/stacked-dot';

@Component({
  selector: 'app-two-proportions',
  templateUrl: './two-proportions.component.html',
  styleUrls: ['./two-proportions.component.scss']
})
export class TwoProportionsComponent implements OnInit {

  // Your existing variables
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

  // Additional variables for ngModel
  numofSem: number;
  activateSim: boolean = true; // Modify this based on your logic
  mean_diff: number;
  sections = {
    sectionTwo: true,
    sectionThree: true
  };
  lastSummary: any
  chart1: any
  chart2: any
  chart3: any
  simsummary: any = {
    sampleMean1: NaN,
    sampleMean2: NaN,
    sampleMeanDiff: NaN,
  }
  demodata: any = [
  ]
  datasets = [
    { label: "Group 1", legend: true, backgroundColor: 'orange', data: this.demodata },
    { label: "Group 2", legend: true, backgroundColor: 'rebeccapurple', data: this.demodata },
    { label: "Group 3", legend: false, backgroundColor: 'rebeccapurple', data: this.demodata },
    { label: "Group 3", legend: false, backgroundColor: 'rebeccapurple', data: this.demodata },
  ];

  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  chartColors: Color[] = [
    {
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ];
  chartType: ChartType = 'bar';

  summaryData: ChartDataSets[] = [];



  numberOfSimulations: number;

  constructor() {

  }
  toggleSection(e: any, sec: string) {
    
  }
  dataTextArea: string = '';
  data: any
  updateData(data: any) {
    
    }

  calculateProportion(data: number[]) {
    
  }
  onResetChart() {
    this.chart1.clear()
    this.chart2.clear()
    this.chart3.clear()
    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
    this.chart3.chart.update(0)
  }

  async ngOnInit() {
    this.chart1 = new chatClass("data-chart-1", this.datasets[0]);
    this.chart2 = new chatClass("data-chart-2", this.datasets[1]);
    this.chart3 = new chatClass("diff-chart", this.datasets[3]);
   
  }
  ngAfterContentInit(){
    
    }
   
    
  
  loadData(): void {
    
  }

  updateChart(data: string): void {
  
    }

    
  updateSummaryChart(data: string): void {
    
  }

  runSimulations(): void {
  }

  sampleSelect(e: any) {
  }

  parseData(dataText: any) {
    let items = dataText
      .split(/[\r\n]+/)
      .filter((line: any) => line.length)
      .map((line: any) => {
        let [group, value] = line.split(',');
        return [group, value * 1.0];
      });
    let faceted: any = {};
    for (let [group, value] of items) {
      if (!faceted[group]) {
        faceted[group] = [];
      }
      faceted[group].push(value);
    }
    return Object.values(faceted);
  }

  runSim() {
  }

  addSimulationSample(sample: any[]) {
  
  }
  onFileSelected(e: any) {
    
  }

  onDrop(event: DragEvent): void {
    
  }
  selectedTest(event: any) {
    
  }
}
