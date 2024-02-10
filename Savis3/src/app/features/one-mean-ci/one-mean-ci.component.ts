import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { StackedDotChartService } from 'src/app/Utils/stacked-dot-chart.service';
import { translation } from 'src/app/Utils/translation';
import { StackedDotChart } from 'src/app/Utils/stacked-dot-chart';
import { coverageChart } from 'src/app/Utils/coverage-chart';
import { CSVService } from 'src/app/Utils/csv.service';
@Component({
  selector: 'app-one-mean-ci',
  templateUrl: './one-mean-ci.component.html',
  styleUrls: ['./one-mean-ci.component.scss']
})

export class OneMeanCIComponent implements OnInit {
  @ViewChild('oneMeanDiv', { static: true }) oneMeanDiv: ElementRef;

  translationData: any; // Type accordingly
  shiftMean: number;
  multiplyFactor: number;
  originalDataFreqs: any; // Type accordingly
  originalData: any[]; // Type accordingly
  populationData: any[]; // Type accordingly
  sampleSize: number;
  numOfSamples: number;
  latestSampleDraw: any[];
  sampleMeans: number[];
  sampleStd: number[];
  tenthSampleMeans: number;
  confidenceLevel: number;
  charMu: string;
  elements: any; // Type accordingly
  dataSections: any; // Type accordingly
  datasets: any[]; // Type accordingly
  charts: any; // Type accordingly

  constructor() {
    this.translationData = translation.oneMean; // Assuming `translation` is defined elsewhere
    this.shiftMean = 0;
    this.multiplyFactor = 0;
    this.originalDataFreqs = {};
    this.originalData = [];
    this.populationData = [];
    this.sampleSize = 10;
    this.numOfSamples = 1;
    this.latestSampleDraw = [];
    this.sampleMeans = [];
    this.sampleStd = [];
    this.tenthSampleMeans = 0;
    this.confidenceLevel = 95;
    this.charMu = "µ";
    this.elements = {};
    this.dataSections = {
      originalData: 'originalData',
      hypotheticalPopulationData: 'hypotheticalPopulationData',
      sampleDrawSection: 'sampleDrawSection',
      confidenceIntervalSection: 'confidenceIntervalSection',
      coverageCISection: 'coverageCISection'
    };

    this.datasets = [{
      label: this.translationData.original,
      backgroundColor: 'orange',
      data: []
    }, {
      // label: this.translationData.hypotheticalPopulation,
      label: 'undefined',
      // backgroundColor: 'orange',
      data: []
    }, {
      label: this.translationData.mostRecentDraw,
      backgroundColor: 'purple',
      data: []
    }, [
      {
        label: this.translationData.InInterval,
        backgroundColor: 'green',
        data: []
      },
      {
        label: this.translationData.NotInInterval,
        backgroundColor: 'red',
        data: []
      }
    ], [
      {
        label: this.translationData.samplesWithMean,
        backgroundColor: 'rgba(31,255,31,1)',
        borderColor: 'rgba(31,255,31,1)',
        data: []
      }, {
        label: this.translationData.samplesWithoutMean,
        backgroundColor: 'red',
        borderColor: 'red',
        data: []
      }, {
        label: this.charMu,
        backgroundColor: 'black',
        borderColor: 'black',
        data: []
      }
    ]];

    this.charts = {
      originalDataChart: new StackedDotChart(
        this.elements.originialDataChart,
        [this.datasets[0]]
      ),
      sampleDrawChart: new StackedDotChart(
        this.elements.sampleDrawChart,
        [this.datasets[2]]
      ),
      confidenceIntervalChart: new StackedDotChart(
        this.elements.confidenceIntervalChart,
        this.datasets[3]
      ),
      coverageCI: new coverageChart(
        this.elements.coverageChart,
        this.datasets[4]
      )
    };

    this.charts.sampleDrawChart.setAnimationDuration(0);
    this.charts.confidenceIntervalChart.setAnimationDuration(0);
    this.initialize();
  }
  initializeElements(): void {
    this.elements = {
      sampleDataSelectionDropdown: this.oneMeanDiv.nativeElement.querySelector("#sample-data"),
      csvDataTextArea: this.oneMeanDiv.nativeElement.querySelector("#csv-input"),
      loadDataButton: this.oneMeanDiv.nativeElement.querySelector('#load-data-btn'),
      meanDescription: this.oneMeanDiv.nativeElement.querySelector("#input-mean-description"),
      stdDescription: this.oneMeanDiv.nativeElement.querySelector("#input-std-description"),
      sizeDescription: this.oneMeanDiv.nativeElement.querySelector("#input-size-description"),
      originalDataTextArea: this.oneMeanDiv.nativeElement.querySelector("#original-data-display"),
      originalDataMeanDisplay: this.oneMeanDiv.nativeElement.querySelector("#original-mean"),
      originalDataStandardDeviationDisplay: this.oneMeanDiv.nativeElement.querySelector("#original-std"),
      resetDataButton: this.oneMeanDiv.nativeElement.querySelector("#reset-btn"),
      toggleCheckBoxes: this.oneMeanDiv.nativeElement.querySelectorAll("input[type='checkbox']"),
      dataSections: this.oneMeanDiv.nativeElement.querySelectorAll(".chart-input-form"),
      originialDataChart: this.oneMeanDiv.nativeElement.querySelector("#original-data-chart"),
      sampleSizeInput: this.oneMeanDiv.nativeElement.querySelector("#sample-size"),
      numberOfSamplesInput: this.oneMeanDiv.nativeElement.querySelector("#no-of-sample"),
      runSimBtn: this.oneMeanDiv.nativeElement.querySelector("#run-sim-btn"),
      sampleDrawTextArea: this.oneMeanDiv.nativeElement.querySelector("#most-recent-sample-display"),
      sampleDrawMean: this.oneMeanDiv.nativeElement.querySelector("#sample-mean"),
      sampleDrawSTD: this.oneMeanDiv.nativeElement.querySelector("#sample-sd"),
      sampleDrawSimError: this.oneMeanDiv.nativeElement.querySelector("#run-sim-error-msg"),
      sampleDrawChart: this.oneMeanDiv.nativeElement.querySelector("#sample-data-chart"),
      samplesMeanTextArea: this.oneMeanDiv.nativeElement.querySelector("#samples-mean-display"),
      sampleMeansMean: this.oneMeanDiv.nativeElement.querySelector("#samples-mean"),
      sampleMeansSTD: this.oneMeanDiv.nativeElement.querySelector("#samplemeans-std"),
      totalSampleMeans: this.oneMeanDiv.nativeElement.querySelector("#total-samples"),
      confidenceIntervalChart: this.oneMeanDiv.nativeElement.querySelector("#statistic-data-chart"),
      minInterValInput: this.oneMeanDiv.nativeElement.querySelector("#min-interValue"),
      maxInterValInput: this.oneMeanDiv.nativeElement.querySelector("#max-interValue"),
      includeValMin: this.oneMeanDiv.nativeElement.querySelector("#includeMin"),
      includeValMax: this.oneMeanDiv.nativeElement.querySelector("#includeMax"),
      chosenSampleMeans: this.oneMeanDiv.nativeElement.querySelector("#chosen-sample-means"),
      unchosenSampleMeans: this.oneMeanDiv.nativeElement.querySelector("#unchosen-sample-means"),
      uploadbtn: this.oneMeanDiv.nativeElement.querySelector("#upload-btn"),
      fileInput: this.oneMeanDiv.nativeElement.querySelector("#fileInput"),
      size: this.oneMeanDiv.nativeElement.querySelector("#originalsize"),
      noOfCoveragesInput: this.oneMeanDiv.nativeElement.querySelector("#no-of-coverages"),
      coverageChart: this.oneMeanDiv.nativeElement.querySelector("#coverage-chart"),
      buildCovBtn: this.oneMeanDiv.nativeElement.querySelector("#build-coverages"),
      coverageWithMean: this.oneMeanDiv.nativeElement.querySelector("#with-mean"),
      coverageWithoutMean: this.oneMeanDiv.nativeElement.querySelector("#without-mean"),
      coveragesMsg: this.oneMeanDiv.nativeElement.querySelector("#warning-coverage-msg"),
      samplesMeanCoverageTable: this.oneMeanDiv.nativeElement.querySelector("#sample-mean-coverages-table"),
      samplesMeanCoverageDisplay: this.oneMeanDiv.nativeElement.querySelector("#sample-mean-coverages-display")
    };
  }
  initialize(): void {
    this.initializeElements();
  }
  ngOnInit(): void {
  }

}
