// import { Component, OnInit } from '@angular/core';
// import { ElementRef, ViewChild } from '@angular/core';
// import { StackedDotChartService } from 'src/app/Utils/stacked-dot-chart.service';
// import {TranslateService} from 'src/app/Utils/translate.service;
// import { StackedDotChart } from 'src/app/Utils/stacked-dot-chart';
// import { coverageChart } from 'src/app/Utils/coverage-chart';
// import { MathUtil } from 'src/app/Utils/math-util';
// import { CSVService } from 'src/app/Utils/csv.service'
// import { computeFrequencies, extractDataByColumn, computeDataSimilarity, splitByPredicate, pre } from 'src/app/Utils/data-processing';
// @Component({
//   selector: 'app-one-mean-ci',
//   templateUrl: './one-mean-ci.component.html',
//   styleUrls: ['./one-mean-ci.component.scss']
// })

// export class OneMeanCIComponent implements OnInit {
//   @ViewChild('oneMeanDiv', { static: true }) oneMeanDiv: ElementRef ;

//   translationData: any; // Type accordingly
//   shiftMean: number;
//   multiplyFactor: number;
//   originalDataFreqs: any; // Type accordingly
//   originalData: any[]; // Type accordingly
//   populationData: any[]; // Type accordingly
//   sampleSize: number;
//   numOfSamples: number;
//   latestSampleDraw: any[];
//   sampleMeans: number[];
//   sampleStd: number[];
//   tenthSampleMeans: number;
//   confidenceLevel: number;
//   charMu: string;
//   elements: any; // Type accordingly
//   dataSections: any; // Type accordingly
//   datasets: any[]; // Type accordingly
//   charts: any; // Type accordingly

//   constructor() {
    
//     this.translationData = TranslateService.translation.oneMean; // Assuming `translation` is defined elsewhere
//     this.shiftMean = 0;
//     this.multiplyFactor = 0;
//     this.originalDataFreqs = {};
//     this.originalData = [];
//     this.populationData = [];
//     this.sampleSize = 10;
//     this.numOfSamples = 1;
//     this.latestSampleDraw = [];
//     this.sampleMeans = [];
//     this.sampleStd = [];
//     this.tenthSampleMeans = 0;
//     this.confidenceLevel = 95;
//     this.charMu = "µ";
//     this.elements = {};
//     this.dataSections = {
//       originalData: 'originalData',
//       hypotheticalPopulationData: 'hypotheticalPopulationData',
//       sampleDrawSection: 'sampleDrawSection',
//       confidenceIntervalSection: 'confidenceIntervalSection',
//       coverageCISection: 'coverageCISection'
//     };

//     this.datasets = [{
//       label: this.translationData.original,
//       backgroundColor: 'orange',
//       data: []
//     }, {
//       // label: this.translationData.hypotheticalPopulation,
//       label: 'undefined',
//       // backgroundColor: 'orange',
//       data: []
//     }, {
//       label: this.translationData.mostRecentDraw,
//       backgroundColor: 'purple',
//       data: []
//     }, [
//       {
//         label: this.translationData.InInterval,
//         backgroundColor: 'green',
//         data: []
//       },
//       {
//         label: this.translationData.NotInInterval,
//         backgroundColor: 'red',
//         data: []
//       }
//     ], [
//       {
//         label: this.translationData.samplesWithMean,
//         backgroundColor: 'rgba(31,255,31,1)',
//         borderColor: 'rgba(31,255,31,1)',
//         data: []
//       }, {
//         label: this.translationData.samplesWithoutMean,
//         backgroundColor: 'red',
//         borderColor: 'red',
//         data: []
//       }, {
//         label: this.charMu,
//         backgroundColor: 'black',
//         borderColor: 'black',
//         data: []
//       }
//     ]];

//     this.charts = {
//       originalDataChart: new StackedDotChart(
//         this.elements.originialDataChart,
//         [this.datasets[0]]
//       ),
//       sampleDrawChart: new StackedDotChart(
//         this.elements.sampleDrawChart,
//         [this.datasets[2]]
//       ),
//       confidenceIntervalChart: new StackedDotChart(
//         this.elements.confidenceIntervalChart,
//         this.datasets[3]
//       ),
//       coverageCI: new coverageChart(
//         this.elements.coverageChart,
//         this.datasets[4]
//       )
//     };

//     this.charts.sampleDrawChart.setAnimationDuration(0);
//     this.charts.confidenceIntervalChart.setAnimationDuration(0);
//     this.initialize();
//   }
//   initializeElements(): void {
//     this.elements = {
//       sampleDataSelectionDropdown: this.oneMeanDiv.nativeElement.querySelector("#sample-data"),
//       csvDataTextArea: this.oneMeanDiv.nativeElement.querySelector("#csv-input"),
//       loadDataButton: this.oneMeanDiv.nativeElement.querySelector('#load-data-btn'),
//       meanDescription: this.oneMeanDiv.nativeElement.querySelector("#input-mean-description"),
//       stdDescription: this.oneMeanDiv.nativeElement.querySelector("#input-std-description"),
//       sizeDescription: this.oneMeanDiv.nativeElement.querySelector("#input-size-description"),
//       originalDataTextArea: this.oneMeanDiv.nativeElement.querySelector("#original-data-display"),
//       originalDataMeanDisplay: this.oneMeanDiv.nativeElement.querySelector("#original-mean"),
//       originalDataStandardDeviationDisplay: this.oneMeanDiv.nativeElement.querySelector("#original-std"),
//       resetDataButton: this.oneMeanDiv.nativeElement.querySelector("#reset-btn"),
//       toggleCheckBoxes: this.oneMeanDiv.nativeElement.querySelectorAll("input[type='checkbox']"),
//       dataSections: this.oneMeanDiv.nativeElement.querySelectorAll(".chart-input-form"),
//       originialDataChart: this.oneMeanDiv.nativeElement.querySelector("#original-data-chart"),
//       sampleSizeInput: this.oneMeanDiv.nativeElement.querySelector("#sample-size"),
//       numberOfSamplesInput: this.oneMeanDiv.nativeElement.querySelector("#no-of-sample"),
//       runSimBtn: this.oneMeanDiv.nativeElement.querySelector("#run-sim-btn"),
//       sampleDrawTextArea: this.oneMeanDiv.nativeElement.querySelector("#most-recent-sample-display"),
//       sampleDrawMean: this.oneMeanDiv.nativeElement.querySelector("#sample-mean"),
//       sampleDrawSTD: this.oneMeanDiv.nativeElement.querySelector("#sample-sd"),
//       sampleDrawSimError: this.oneMeanDiv.nativeElement.querySelector("#run-sim-error-msg"),
//       sampleDrawChart: this.oneMeanDiv.nativeElement.querySelector("#sample-data-chart"),
//       samplesMeanTextArea: this.oneMeanDiv.nativeElement.querySelector("#samples-mean-display"),
//       sampleMeansMean: this.oneMeanDiv.nativeElement.querySelector("#samples-mean"),
//       sampleMeansSTD: this.oneMeanDiv.nativeElement.querySelector("#samplemeans-std"),
//       totalSampleMeans: this.oneMeanDiv.nativeElement.querySelector("#total-samples"),
//       confidenceIntervalChart: this.oneMeanDiv.nativeElement.querySelector("#statistic-data-chart"),
//       minInterValInput: this.oneMeanDiv.nativeElement.querySelector("#min-interValue"),
//       maxInterValInput: this.oneMeanDiv.nativeElement.querySelector("#max-interValue"),
//       includeValMin: this.oneMeanDiv.nativeElement.querySelector("#includeMin"),
//       includeValMax: this.oneMeanDiv.nativeElement.querySelector("#includeMax"),
//       chosenSampleMeans: this.oneMeanDiv.nativeElement.querySelector("#chosen-sample-means"),
//       unchosenSampleMeans: this.oneMeanDiv.nativeElement.querySelector("#unchosen-sample-means"),
//       uploadbtn: this.oneMeanDiv.nativeElement.querySelector("#upload-btn"),
//       fileInput: this.oneMeanDiv.nativeElement.querySelector("#fileInput"),
//       size: this.oneMeanDiv.nativeElement.querySelector("#originalsize"),
//       noOfCoveragesInput: this.oneMeanDiv.nativeElement.querySelector("#no-of-coverages"),
//       coverageChart: this.oneMeanDiv.nativeElement.querySelector("#coverage-chart"),
//       buildCovBtn: this.oneMeanDiv.nativeElement.querySelector("#build-coverages"),
//       coverageWithMean: this.oneMeanDiv.nativeElement.querySelector("#with-mean"),
//       coverageWithoutMean: this.oneMeanDiv.nativeElement.querySelector("#without-mean"),
//       coveragesMsg: this.oneMeanDiv.nativeElement.querySelector("#warning-coverage-msg"),
//       samplesMeanCoverageTable: this.oneMeanDiv.nativeElement.querySelector("#sample-mean-coverages-table"),
//       samplesMeanCoverageDisplay: this.oneMeanDiv.nativeElement.querySelector("#sample-mean-coverages-display")
//     };
//   }
//   getDefaultValues(){
//     return {
//       mean: 'NaN',
//       standardDeviation: 'NaN'
//     }
//   }
//   initialize(): void {
//     this.initializeElements();
//   }
//   ngOnInit(): void {
//     console.log(this.oneMeanDiv.nativeElement);
//   }
//   addSelectDataDropDownListener() {
//     this.elements.sampleDataSelectionDropdown.addEventListener(
//       'change',
//       this.renderSampleDataSelectionCallBackFunc()
//     )
//   }
//   addLoadButtonListener() {
//     this.elements.loadDataButton.addEventListener('click', this.loadDataButtonCallBackFunc())
//   }
//   loadDataButtonCallBackFunc(): (event: Event) => void {
//     const loadDataBtn = (event: Event) => {
//       // Get the data
//       const rawData: string = this.elements.csvDataTextArea.nativeElement.value;
//       const cleanedData: any[] = CSVService.parseCSVtoSingleArray(rawData); // Adjust the type accordingly
//       const freqs: any = computeFrequencies(extractDataByColumn(cleanedData, "value")); // Adjust the type accordingly
  
//       // Check if the original data is not set or if the new data differs from the original data
//       if (!this.originalData || !computeDataSimilarity(this.originalDataFreqs, freqs)) {
//         this.originalData = cleanedData;
//         this.originalDataFreqs = freqs;
//         this.shiftMean = 0;
//         this.multiplyFactor = 0;
//         this.sampleSize = 10;
//         this.numOfSamples = 1;
//         this.confidenceLevel = 95;
//         this.updateData(this.dataSections.originalData);
//         this.clearResult();
//       }
//       this.clearResult();
  
//       event.preventDefault();
//     };
//     return loadDataBtn;
//   }
//   disableControlsCoverageMeans(flag: boolean): void {
//     this.elements.noOfCoveragesInput.nativeElement.disabled = flag;
//     this.elements.buildCovBtn.nativeElement.disabled = flag;
//     this.elements.noOfCoveragesInput.nativeElement.value = flag ? '' : this.tenthSampleMeans;
//     this.elements.coverageWithMean.nativeElement.innerText = this.translationData.noData;
//     this.elements.coverageWithoutMean.nativeElement.innerText = this.translationData.noData;
//     this.elements.samplesMeanCoverageDisplay.nativeElement.value = '';
//     this.charts.coverageCI.chart.data.datasets[2].label = this.charMu;
//   }
  
//   clearResult() {
//     this.disableControlsCoverageMeans(true)
//     this.charts.coverageCI.clear()
//     this.charts.coverageCI.chart.update()
//     /*this.elements.shiftMeanInput.value = this.shiftMean
//     this.elements.multiplyPopulationDataSlider.value = this.multiplyFactor
//     this.elements.multiplyPopulationDataDisplay.innerText = this.multiplyFactor*/
//     this.elements.sampleSizeInput.value = this.sampleSize
//     this.elements.numberOfSamplesInput.value = this.numOfSamples
//     //this.elements.confidenceLevelDisplay.innerText = this.confidenceLevel
//     //this.elements.confidenceLevelSlider.value = this.confidenceLevel
//     this.latestSampleDraw = []
//     this.sampleMeans = []
//     this.updateData(this.dataSections.sampleDrawSection)
//     this.updateData(this.dataSections.confidenceIntervalSection)
//     this.updateConfidenceIntervalChartLabel("null", "null")
//     /*this.elements.lower.innerText = this.translationData.noData
//     this.elements.upper.innerText = this.translationData.noData*/
//   }
//   updateConfidenceIntervalChartLabel(leftBound: number | string, rightBound: number | string): void {
//     if (leftBound === "null" || rightBound === "null") {
//       this.charts.confidenceIntervalChart.updateLabelName(0, this.translationData.InInterval);
//       this.charts.confidenceIntervalChart.updateLabelName(1, this.translationData.NotInInterval);
//     } else {
//       let intervalStr = "";
  
//       if (this.elements.intervalType.left && this.elements.intervalType.right)  intervalStr = `[${leftBound}, ${rightBound}]`;
//       else if (this.elements.intervalType.left && !this.elements.intervalType.right)  intervalStr = `[${leftBound}, ${rightBound})`;
//       else if (!this.elements.intervalType.left && this.elements.intervalType.right) intervalStr = `(${leftBound}, ${rightBound}]`;
//       else  intervalStr = `(${leftBound}, ${rightBound})`;
  
//       this.charts.confidenceIntervalChart.updateLabelName(0, `${this.translationData.InInterval} ${intervalStr}`);
//       this.charts.confidenceIntervalChart.updateLabelName(1, `${this.translationData.NotInInterval} ${intervalStr}`);
//     }
//   }
  
//   updateStandardDeviation(standardDeviationDisplay: HTMLElement, data: any[]): void {
//     const stddev = data.length > 0 ? MathUtil.stddev(data) : this.getDefaultValues().standardDeviation;
//     standardDeviationDisplay.innerText = MathUtil.roundToPlaces(stddev, 2).toString();
//   }
  
//   updateMean(meanDisplayElement: HTMLElement, data: any[]): void {
//     const mean = data.length > 0 ? MathUtil.mean(data) : this.getDefaultValues().mean;
//     meanDisplayElement.innerText = MathUtil.roundToPlaces(mean, 2).toString();
//   }
  
//   updateDataTextArea(transform: () => string, dataTextAreaElement: HTMLTextAreaElement): void {
//     const dataString = transform();
//     dataTextAreaElement.value = dataString;
//   }
  
//   getPredicateFunction(leftBound: number, rightBound: number, temp: any[]): (value: any, index: number) => boolean {
//     const predictateFunction = (value: any, index: number): boolean => {
//       return value >= temp[leftBound] && value <= (rightBound >= temp.length ? temp[temp.length - 1] : temp[rightBound]);
//     };
//     return predictateFunction;
//   }
//   updateInfoSampleMeans(totalChosen: number, totalUnchosen: number): void {
//     const proportionChosen = MathUtil.roundToPlaces(totalChosen / this.sampleMeans.length, 4);
//     const proportionUnchosen = MathUtil.roundToPlaces(totalUnchosen / this.sampleMeans.length, 4);
//     this.elements.totalSampleMeans.innerText = this.sampleMeans.length.toString();
//     this.elements.chosenSampleMeans.innerText = `${totalChosen} / ${this.sampleMeans.length} = ${proportionChosen}`;
//     this.elements.unchosenSampleMeans.innerText = `${totalUnchosen} / ${this.sampleMeans.length} = ${proportionUnchosen}`;
//   }
  
//   updateData(dataSectioName: string) {
//     let data: any, meanElement: any, dataStringTextAreaElement: any, chart: any;
//     let pointRadius = 6;
//     let values: any;

//     if (dataSectioName === this.dataSections.originalData) {
//       chart = this.charts.originalDataChart;
//       data = this.originalData;
//       meanElement = this.elements.originalDataMeanDisplay;
//       dataStringTextAreaElement = this.elements.originalDataTextArea;
//       this.elements.size.innerText = data.length;
//       this.updateStandardDeviation(this.elements.originalDataStandardDeviationDisplay, extractDataByColumn(data, "value"));
//     } else if (dataSectioName === this.dataSections.sampleDrawSection) {
//       chart = this.charts.sampleDrawChart;
//       data = this.latestSampleDraw;
//       meanElement = this.elements.sampleDrawMean;
//       dataStringTextAreaElement = this.elements.sampleDrawTextArea;
//       this.elements.sampleDrawSTD.innerText = this.sampleStd[this.sampleStd.length - 1];
//     } else {
//       chart = this.charts.confidenceIntervalChart;
//       data = this.sampleMeans;
//       meanElement = this.elements.sampleMeansMean;
//       dataStringTextAreaElement = this.elements.samplesMeanTextArea;
//       this.elements.totalSampleMeans.innerText = this.sampleMeans.length;
//       this.updateStandardDeviation(this.elements.sampleMeansSTD, data);
//       this.elements.intervalType = {
//         left: this.elements.includeValMin.checked,
//         right: this.elements.includeValMax.checked
//       };
//     }

//     if (chart) {
//       if (data.length > 0) {
//         if (dataSectioName !== this.dataSections.confidenceIntervalSection) {
//           values = this.extractDataByColumn(data, "value");
//           chart.setDataFromRaw([values]);
//         } else {
//           values = data;

//           const leftBound = Number(this.elements.minInterValInput.value);
//           const rightBound = Number(this.elements.maxInterValInput.value);

//           const { chosen, unchosen } = splitByPredicate(
//             values,
//             this.predicateForSets(leftBound, rightBound)
//           );

//           this.updateInfoSampleMeans(chosen.length, unchosen.length);
//           chart.setDataFromRaw([chosen, unchosen]);

//           if (chosen.length)
//             this.updateConfidenceIntervalChartLabel(
//               MathUtil.roundToPlaces(MathUtil.minInArray(chosen), 4),
//               MathUtil.roundToPlaces(MathUtil.maxInArray(chosen), 4)
//             );
//           else
//             this.updateConfidenceIntervalChartLabel(
//               MathUtil.roundToPlaces(leftBound, 4),
//               MathUtil.roundToPlaces(rightBound, 4)
//             );

//           pointRadius = 4;
//         }

//         chart.changeDotAppearance(pointRadius, undefined);
//         let [min, max] = [MathUtil.minInArray(values), MathUtil.maxInArray(values)];
//         chart.setScale(min, max);
//       } else {
//         chart.clear();
//       }
//       chart.scaleToStackDots();
//       chart.chart.update();
//     }

//     this.updateMean(meanElement, dataSectioName !== this.dataSections.confidenceIntervalSection ? this.extractDataByColumn(data, "value") : data);
//     let dataTransformationFunc = null;
//     if (dataSectioName !== this.dataSections.confidenceIntervalSection) {
//       dataTransformationFunc = () => {
//         return data.reduce(
//           (currString: string, currentRow: any) => currString + `${currentRow.id}`.padEnd(8, ' ') + `${currentRow.value}\n`,
//           `${this.translationData.id}`.padEnd(8, ' ') + `${this.translationData.value}\n`
//         );
//       };
//     } else {
//       dataTransformationFunc = () => {
//         return data.reduce(
//           (currString: string, currentRow: any, index: number) => currString + `${index + 1}`.padEnd(8, ' ') + `${currentRow}\n`,
//           `${this.translationData.id}`.padEnd(8, ' ') + `${this.translationData.mean}\n`
//         );
//       };
//     }
//     this.updateDataTextArea(dataTransformationFunc, dataStringTextAreaElement);
//   }
//   extractDataByColumn(data: any[], columnName: string): any[] {
//     return data.map(row => row[columnName]);
// }
//   renderSampleDataSelectionCallBackFunc(): (event: Event) => void {
//     const render = (event: Event) => {
//       // Get the selected sample data option
//       const selectedSampleDataOption = this.elements.sampleDataSelectionDropdown.nativeElement.value;
//       if (selectedSampleDataOption !== this.translationData.selectData) {
//         // Assuming readLocalFile is a function that returns a Promise<string>
//         CSVService.readLocalFile(selectedSampleDataOption).then(
//          (data: string) => this.elements.csvDataTextArea.nativeElement.value = data
//         );
//       } else {
//         this.elements.csvDataTextArea.nativeElement.value = '';
//       }
//       event.preventDefault();
//     };
//     return render;
//   }
//   predicateForSets(left: number, right: number): ((x: number) => boolean) | null {
//     if (this.elements.intervalType.left && this.elements.intervalType.right) {
//       return function(x: number): boolean {
//         return x >= left && x <= right;
//       };
//     } else if (this.elements.intervalType.left && !this.elements.intervalType.right) {
//       return function(x: number): boolean {
//         return x >= left && x < right;
//       };
//     } else if (!this.elements.intervalType.left && this.elements.intervalType.right) {
//       return function(x: number): boolean {
//         return x > left && x <= right;
//       };
//     } else if (!this.elements.intervalType.left && !this.elements.intervalType.right) {
//       return function(x: number): boolean {
//         return x > left && x < right;
//       };
//     } else {
//         return null;
//     }
//   }
//   updateCoverageMeans(): void {
//     let chosenMeans: number[] = [], processedStd: number[] = [];
//     const noOfCoverage: number = Number(this.elements.noOfCoveragesInput.value);

//     for (let it = 0; it < noOfCoverage; it++) {
//         chosenMeans.push(this.sampleMeans[it]);
//         processedStd.push(2 * this.sampleStd[it] / Math.sqrt(this.sampleSize));
//     }

//     let it: number, sampleMean: number, procStd: number, lower: number, upper: number, minNum: number = Infinity, maxNum: number = -Infinity, assignedDataset: { x: number | undefined, y: number | undefined }[], tmp: any;
//     let inInterval: { x: number | undefined, y: number  }[] = [], notInInterval: { x: number | undefined, y: number }[] = [], lowers: number[] = [], uppers: number[] = [];
//     let wMean: number = 0;
//     const centMean: number = Number(this.elements.originalDataMeanDisplay.innerText);

//     for (it = 0; it < chosenMeans.length; it++) {
//         sampleMean = chosenMeans[it];
//         procStd = processedStd[it];
//         lower = sampleMean - procStd;
//         upper = sampleMean + procStd;
//         if (lower < minNum) minNum = lower;
//         if (upper > maxNum) maxNum = upper;

//         if (lower <= centMean && centMean <= upper) wMean += 1;

//         if ((it < noOfCoverage) && (it < 100)) {
//             assignedDataset = (lower <= centMean && centMean <= upper) ? inInterval : notInInterval;

//             assignedDataset.push(
//                 { x: it + 1, y: MathUtil.roundToPlaces(lower, 2) },
//                 { x: it + 1, y: sampleMean },
//                 { x: it + 1, y: MathUtil.roundToPlaces(upper, 2) },
//                 { x: undefined, y : undefined }
//             );
//         }

//         lowers.push(MathUtil.roundToPlaces(lower, 2));
//         uppers.push(MathUtil.roundToPlaces(upper, 2));
//     }

//     it++;
//     tmp = inInterval.pop();
//     tmp = notInInterval.pop();
//     this.charts.coverageCI.setScales({
//         x_term: (it < 100) ? it : 100,
//         y_init: minNum,
//         y_term: maxNum
//     });

//     this.charts.coverageCI.updateChartData([
//         inInterval,
//         notInInterval,
//         [{ x: 0, y: centMean }, { x: (it < 100) ? it : 100, y: centMean }]
//     ]);

//     this.charts.coverageCI.chart.data.datasets[2].label = `${this.charMu} = ${centMean}`;
//     this.charts.coverageCI.chart.update();

//     this.elements.coverageWithMean.innerText = wMean;
//     this.elements.coverageWithoutMean.innerText = noOfCoverage - wMean;

//     this.elements.samplesMeanCoverageDisplay.value = chosenMeans.reduce((prev, val, idx) =>
//         prev + `${idx}`.padEnd(5, ' ') + `${lowers[idx].toFixed(2)}`.padEnd(8, ' ') + `${val}`.padEnd(6, ' ') + `${uppers[idx].toFixed(2)}\n`,
//         `${this.translationData.id}`.padEnd(5, ' ') + `${this.translationData.lowerLimit}`.padEnd(8, ' ') + `${this.translationData.mean}`.padEnd(6, ' ') + `${this.translationData.lowerLimit}\n`
//     );
// }

// }

import { Component, ElementRef } from '@angular/core';
import { StackedDotChartService } from 'src/app/Utils/stacked-dot-chart.service';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService } from 'src/app/Utils/sampling.service';
import { CSVService } from 'src/app/Utils/csv.service';
import { NgForm } from '@angular/forms';
import {ChartType} from 'chart.js';

@Component({
  selector: 'app-one-mean-ci',
  templateUrl: './one-mean-ci.component.html',
  styleUrls: ['./one-mean-ci.component.scss']
})
export class OneMeanCIComponent {
  // 1.Data
  dataInput: string = "";
  valuesArray: any = [];
  input: [] = [];
  inputMean: number = 0;
  standardDeviation: number = 0;
  inputSize: number = 0;

  // 2. Hypotheis Population
  hypoValuesArray: any = [];
  originalHypoValuesArray: any = [];
  rangeValue: number = 0;
  meanValue: number = 0;
  prevMean: number = this.meanValue;
  hypoInputMean: number = 0;

  // 3. Draw Sample
  sampleSize: number = 1;
  sampleSizeChange: number = 1;
  sampleMean: number = 0;
  numSamples: number = 1;
  sample: any = [];

  // 4.
  sampleMeans: any = [];
  sampleMeansMean: number = 0;
  sampleMeansStd:number = 0;
  meanSamples: number = 0;
  extremeSample: number = 0;
  distributionSelected: string = "default";

  // chart data
  public lineChartLegend = true;
  public lineChartType: ChartType = 'scatter';
  public lineChartData1: any = [];
  public lineChartLabels1: any = [];
  
  public lineChartData2: any = [];
  public lineChartLabels2: any = [];

  public lineChartData3: any = [];
  public lineChartLabels3: any = [];

  public lineChartData4: any = [];
  public lineChartLabels4: any = [];

  public lineChartOptions: any = {
    scales: {
      xAxes: [{
        ticks: { 
          //beginAtZero: true,
          fontColor: 'black',
          fontSize: 16,
          padding: 0,
          min: -1,
          max: 1
        },
        scaleLabel: {
          display: true,
          labelString: "",
        }
      }],
      yAxes:[{
        ticks: {
          fontColor: 'black',
          fontSize: 16,
          padding: 0,
          min: 1, // Rafael Diaz
          stepSize: 1
        },
        scaleLabel: {
          display: true,
          labelString: "",
          //fontColor: "black",
          //fontSize: "14"
        }
      }]
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: 'rgba(0,0,0,1.0)',
      bodyFontStyle:'normal',
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 6
      }
    }
  };

  public lineChartOptions2: any = {
    scales: {
      xAxes: [{
        ticks: { 
          //beginAtZero: true,
          fontColor: 'black',
          fontSize: 16,
          padding: 0,
          min: -1,
          max: 1
        },
        scaleLabel: {
          display: true,
          labelString: "",
        }
      }],
      yAxes:[{
        ticks: {
          fontColor: 'black',
          fontSize: 16,
          padding: 0,
          min: 1, // Rafael Diaz
          stepSize: 1
        },
        scaleLabel: {
          display: true,
          labelString: "",
          //fontColor: "black",
          //fontSize: "14"
        }
      }]
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: 'rgba(0,0,0,1.0)',
      bodyFontStyle:'normal',
    },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 6
      }
    }
  };



  constructor() {}
  // values are in dataForm-input
  onSubmit(form: NgForm) {
    // get the textarea input
    this.dataInput = form.value.dataFormInput;
    // split the input into an array
    this.valuesArray = this.dataInput.split('\n').filter(value => value.trim() !== '');
    // convert the array into numbers
    this.valuesArray = this.valuesArray.map((value: string) => parseInt(value)).filter((value: number) => !isNaN(value));
    console.log(this.valuesArray);
    // calculate the mean
    this.inputMean = MathService.mean(this.valuesArray);
    this.hypoInputMean = this.inputMean;
    // calculate the standard deviation
    this.standardDeviation = parseFloat(MathService.stddev(this.valuesArray).toFixed(2));
    this.inputSize = this.valuesArray.length;
    this.hypoValuesArray = this.valuesArray;

    // create the chart
    // let service = new StackedDotChartService();
    // let chart = service.initChart(this.valuesArray);
    this.lineChartData1 = [{
      data: this.valuesArray.map((value:number) => ({x: value, y: 1})),
      label: 'Original Dataset',
      pointBackgroundColor: 'orange',
    }];
    this.lineChartLabels1 = this.valuesArray.map((index:number) => `Value ${index+1}`);
    this.lineChartData2 = [{
      data: this.valuesArray.map((value:number) => ({x: value, y: 1})),
      label: 'Hypothetical Population',
      pointBackgroundColor: 'orange',
    }];
    this.lineChartLabels2 = this.valuesArray.map((index:number) => `Value ${index+1}`);
    this.updateChartOptions();
  }

  updateChartOptions() {
    let minValue = Math.min(...this.valuesArray);
    let maxValue = Math.max(...this.valuesArray);

    this.lineChartOptions = {
      scales: {
        xAxes: [{
          ticks: { 
            //beginAtZero: true,
            fontColor: 'black',
            fontSize: 16,
            padding: 0,
            min: minValue,
            max: maxValue
          },
          scaleLabel: {
            display: true,
            labelString: "",
          }
        }],
        yAxes:[{
          ticks: {
            fontColor: 'black',
            fontSize: 16,
            padding: 0,
            min: 1, // Rafael Diaz
            stepSize: 1
          },
          scaleLabel: {
            display: true,
            labelString: "",
            //fontColor: "black",
            //fontSize: "14"
          }
        }]
      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: 'rgba(0,0,0,1.0)',
        bodyFontStyle:'normal',
      },
      elements: {
        point: {
          radius: 5,
          hoverRadius: 6,
        }
      },
      legend : {
        labels : {
          fontColor: 'black',
        }
      }
    }

    this.lineChartOptions2 = {
      scales: {
        xAxes: [{
          ticks: { 
            //beginAtZero: true,
            fontColor: 'black',
            fontSize: 16,
            padding: 0,
            min: minValue,
            max: maxValue
          },
          scaleLabel: {
            display: true,
            labelString: "",
          }
        }],
        yAxes:[{
          ticks: {
            fontColor: 'black',
            fontSize: 16,
            padding: 0,
            min: 1, // Rafael Diaz
            stepSize: 0.5
          },
          scaleLabel: {
            display: true,
            labelString: "",
            //fontColor: "black",
            //fontSize: "14"
          }
        }]
      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: 'rgba(0,0,0,1.0)',
        bodyFontStyle:'normal',
      },
      elements: {
        point: {
          radius: 5,
          hoverRadius: 6
        }
      }
    };

  }

  onReset(form: NgForm) {
    form.reset();
    this.dataInput = "";
    this.valuesArray = [];
    this.inputMean = 0;
    this.standardDeviation = 0;
    this.inputSize = 0;
    this.hypoInputMean = 0;
    this.rangeValue = 0;
    this.hypoValuesArray = [];
    this.meanValue = 0;
    this.lineChartData1 = [];
    this.lineChartData2 = [];
    this.lineChartData3 = [];
    this.lineChartData4 = [];
    this.sample = [];
    this.sampleMean = 0;
    this.sampleSize = 1;
    this.sampleMeans = [];
    this.sampleMeansMean = 0;
    this.numSamples = 1;
    this.sampleMeansStd = 0;
    this.meanSamples = 1;
  }

  increaseData() {
    this.hypoValuesArray = this.valuesArray.map((value: number) => parseFloat((value + this.meanValue).toFixed(1)));
    this.originalHypoValuesArray = this.hypoValuesArray;
    this.hypoInputMean = parseFloat(MathService.mean(this.hypoValuesArray).toFixed(2));
    this.lineChartData2 = [{
      data: this.originalHypoValuesArray.map((value:number) => ({x: value, y: 1})),
      label: 'Hypothetical Population',
      pointBackgroundColor: 'orange',
    }];
    this.lineChartLabels2 = this.originalHypoValuesArray.map((index:number) => `Value ${index+1}`);
    let increase = false;
    if (this.prevMean < this.meanValue) {
      increase = true;
    }
    this.updateXAxis(increase);
    this.lineChartData3 = [];
    this.sample = [];
  }

  // shift the x-axis when the mean is shifted 
  updateXAxis(increase: boolean) {
    let prevMin = this.lineChartOptions2.scales.xAxes[0].ticks.min;
    let prevMax = this.lineChartOptions2.scales.xAxes[0].ticks.max
    if (increase == true) {
      this.lineChartOptions2 = {
        scales: {
          xAxes: [{
            ticks: { 
              //beginAtZero: true,
              fontColor: 'black',
              fontSize: 16,
              padding: 0,
              min: prevMin,
              max: prevMax + 0.1
            },
            scaleLabel: {
              display: true,
              labelString: "",
            }
          }],
          yAxes:[{
            ticks: {
              fontColor: 'black',
              fontSize: 16,
              padding: 0,
              min: 1, // Rafael Diaz
              stepSize: 1
            },
            scaleLabel: {
              display: true,
              labelString: "",
              //fontColor: "black",
              //fontSize: "14"
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: 'rgba(0,0,0,1.0)',
          bodyFontStyle:'normal',
        },
        elements: {
          point: {
            radius: 5,
            hoverRadius: 6
          }
        }
      };
    } else {
      this.lineChartOptions2 = {
        scales: {
          xAxes: [{
            ticks: { 
              //beginAtZero: true,
              fontColor: 'black',
              fontSize: 16,
              padding: 0,
              min: prevMin - 0.1,
              max: prevMax
            },
            scaleLabel: {
              display: true,
              labelString: "",
            }
          }],
          yAxes:[{
            ticks: {
              fontColor: 'black',
              fontSize: 16,
              padding: 0,
              min: 1, // Rafael Diaz
              stepSize: 1
            },
            scaleLabel: {
              display: true,
              labelString: "",
              //fontColor: "black",
              //fontSize: "14"
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: 'rgba(0,0,0,1.0)',
          bodyFontStyle:'normal',
        },
        elements: {
          point: {
            radius: 5,
            hoverRadius: 60
          }
        }
      };
    }
    
  }

  increaseRange() {
    if (this.originalHypoValuesArray.length != 0) {
      this.hypoValuesArray = [].concat(...this.originalHypoValuesArray.map((value: number) => new Array(this.rangeValue).fill(value)));
    } else {
      this.hypoValuesArray = [].concat(...this.valuesArray.map((value: number) => new Array(this.rangeValue).fill(value)));
    }
    this.stackDots();
  }

  stackDots() {
    let points:any = {};
    let pointsArray: any = [];
    for (let i = 0; i < this.hypoValuesArray.length; i++) {
      let value = this.hypoValuesArray[i];
      if (points[value] === undefined) {
        points[value] = 1;
      } else {
        points[value] += 1;
      }
      pointsArray.push({x: value, y: points[value]});
    }
    
    this.lineChartData2 = [{
      data: pointsArray.map((value:any) => ({x: value.x, y:value.y})),
      label: 'Hypothetical Population',
      pointBackgroundColor: 'orange',
    }];
  }

  runSimulation() {
    if (this.sampleSize > this.hypoValuesArray.length) {
      alert("Sample size cannot be greater than the population size");
    } else {
      let sample = this.randomSample(this.hypoValuesArray, this.sampleSize);
      let points:any = {};
      let pointsArray: any = [];
      for (let i = 0; i < sample.length; i++) {
        let value = sample[i];
        if (points[value] === undefined) {
          points[value] = 1;
        } else {
          points[value] += 1;
        }
        pointsArray.push({x: value, y: points[value]});
      }
      this.lineChartData3 = [{
        data: pointsArray.map((value:any) => ({x: value.x, y: value.y})),
        label: 'Most Recent Drawn',
        pointBackgroundColor: 'orange',
      }];
      this.lineChartLabels3 = sample.map((index:number) => `Value ${index+1}`);
    }
    // get the mean of the sample
    this.sampleMean = parseFloat(MathService.mean(this.sample).toFixed(2));

    // loop # of samples of times, get a sample size length of the original data and get the mean of each sample
    // clear the sampleMeans array when the sample size changes
    if (this.sampleSizeChange != this.sampleSize) {
      this.sampleSizeChange = this.sampleSize;
      this.sampleMeans = [];
    }
    
    for (let i = 0; i < this.numSamples; i++) {
      let sample = this.randomSample(this.hypoValuesArray, this.sampleSize);
      this.sampleMeans.push(parseFloat(MathService.mean(sample).toFixed(2)));
    }
    this.meanSamples = this.sampleMeans.length;
    this.sampleMeansMean = parseFloat(MathService.mean(this.sampleMeans).toFixed(2));
    this.sampleMeansStd = parseFloat(MathService.stddev(this.sampleMeans).toFixed(2));

    let points:any = {};
    let pointsArray: any = [];
    for (let i = 0; i < this.sampleMeans.length; i++) {
      let value = this.sampleMeans[i];
      if (points[value] === undefined) {
        points[value] = 1;
      } else {
        points[value] += 1;
      }
      pointsArray.push({x: value, y: points[value]});
    }

    this.lineChartData4 = [{
      data: pointsArray.map((value:any) => ({x: value.x, y: value.y})),
      label: 'Sample Means',
      pointBackgroundColor: 'orange',
    }];
  }

  randomSample(arr: any, n: number) { 
    let maxValue = arr.length;
    let minValue = 0;
    let sampleCopy: any = [];
    let copyArr: any = [...arr];
    let i = 0;
    while (i < n) {
        let index = SamplingService.randomInt(minValue,maxValue);
        sampleCopy.push(copyArr[index]);
        copyArr.splice(index, 1);
        maxValue -= 1;
        i++;
      }
    
    this.sample = sampleCopy;
    return this.sample;
  }

  extremeSampleFunc() {

    let points:any = {};
    let pointsArray: any = [];
    for (let i = 0; i < this.sampleMeans.length; i++) {
      let value = this.sampleMeans[i];
      if (points[value] === undefined) {
        points[value] = 1;
      } else {
        points[value] += 1;
      }
      pointsArray.push({x: value, y: points[value]});
    }
    console.log(this.distributionSelected);
    if (this.distributionSelected == "one-right") {
    this.lineChartData4 = [{
      data: pointsArray.map((value:any) => ({x: value.x, y: value.y})),
      label: 'Sample Means',
      pointBackgroundColor: pointsArray.map((value:any) => value.x > this.extremeSample ? 'red' : 'orange'),
    }];
  } else if (this.distributionSelected == "one-left") {
    this.lineChartData4 = [{
      data: pointsArray.map((value:any) => ({x: value.x, y: value.y})),
      label: 'Sample Means',
      pointBackgroundColor: pointsArray.map((value:any) => value.x > this.extremeSample ? 'orange' : 'red'),
    }];
  }
}
// getZScore(confidenceLevel: number): number {
//   const alpha: number = 1 - confidenceLevel;
//   const normalDist = new NormalDistribution(0, 1); // Assuming standard normal distribution
//   return normalDist.invCDF(1 - alpha / 2);
// }
// calculateBounds(sampleMeans: number[], sampleStdDev: number, confidenceLevel: number): { lowerBounds: number[], upperBounds: number[] } {
//   const n: number = sampleMeans.length;
//   const zScore: number = this.getZScore(confidenceLevel);
//   const lowerBounds: number[] = [];
//   const upperBounds: number[] = [];

//   for (let i = 0; i < n; i++) {
//       const lowerBound: number = sampleMeans[i] - (zScore * (sampleStdDev / Math.sqrt(n)));
//       const upperBound: number = sampleMeans[i] + (zScore * (sampleStdDev / Math.sqrt(n)));
//       lowerBounds.push(lowerBound);
//       upperBounds.push(upperBound);
//   }

//   return { lowerBounds, upperBounds };
// }
  
 }