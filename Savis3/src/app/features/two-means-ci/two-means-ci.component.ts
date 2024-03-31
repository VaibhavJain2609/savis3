import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { chatClass } from 'src/app/Utils/stacked-dot';
import { Sampling } from 'src/app/Utils/sampling';
import { TailchartService } from 'src/app/Utils/tailchart.service';
import * as XLS from 'xlsx';
import { MathService } from 'src/app/Utils/math.service';
@Component({
  selector: 'app-two-mean-ci',
  templateUrl: './two-means-ci.component.html',
  styleUrls: ['./two-means-ci.component.scss']
})
export class TwoMeansCIComponent implements OnInit {
  activateSim: boolean = false
  dataSize1: number = 0
  dataSize2: number = 0
  datamean2: number = 0
  datamean1: number = 0
  multiplier: number = 1
  mean_diff: number = 0
  numofSem: number = 1
  confidenceLevel:number = 95
  increment: number = 10
  samDisActive = false
  lastSummary: any
  chart1: any
  chart2: any
  chart3: any
  chart4: any
  chart5: any
  minmax: any
  stDev1: number = 0
  stDev2: number = 0
  meansOfMeans: any = []
  csvraw: any
  csv: any
  lowerBound: number = 0
  upperBound: number = 0
  sections: any = {
    sectionOne: true,
    sectionTwo: true,
    sectionThree: true
  }
  simsummary: any = {
    sampleMean1: NaN,
    sampleMean2: NaN,
    sampleMeanDiff: NaN,
    stdev1sim: NaN,
    stdev2sim: NaN
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
  chartType: ChartType = 'scatter';

  summaryData: ChartDataSets[] = [];



  numberOfSimulations: number;

  constructor(private smp: Sampling, private tail: TailchartService) {

  }
  toggleSection(e: any, sec: string) {
    this.sections[sec] = e.target.checked
  }
  dataTextArea: string = '';
  data: any
  updateData(data: any) {
    this.dataSize1 = this.csv[0].length
    this.dataSize2 = this.csv[1].length
    this.datamean1 = Number(this.calculateMean(this.csv[0]).toFixed(3))
    this.datamean2 = Number(this.calculateMean(this.csv[1]).toFixed(3))
    this.mean_diff = Number((this.datamean1 - this.datamean2).toFixed(3))
    let dataValues = this.csv[0].concat(this.csv[1]);
    let min = Math.min.apply(undefined, dataValues);
    let max = Math.max.apply(undefined, dataValues);
    // Calculate standard deviations
  const stdDev1 = Number(this.calculateStandardDeviation(this.csv[0]).toFixed(3));
  const stdDev2 = Number(this.calculateStandardDeviation(this.csv[0]).toFixed(2));
    this.stDev1 = stdDev1
    this.stDev2 = stdDev2
    this.minmax = {
      "min": min,
      "max": max,
    }
    let rData = {
      "minmax": this.minmax,
      "data": [this.csv[0]],
      "label": "Group 1",
      "backgroundColor": "orange"
    }
    let rData2 = {
      "minmax": this.minmax,
      "data": [this.csv[1]],
      "label": "Group 2",
      "backgroundColor": "rebeccapurple"
    }

    this.chart1.setScale(min, max)
    this.chart2.setScale(min, max)
    this.chart1.setDataFromRaw(rData)
    this.chart2.setDataFromRaw(rData2)
    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
    this.activateSim = true
  }
  calculateStandardDeviation(data: number[]): number {
    if (data.length === 0) return 0;
  
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  incrementYValues(chartIdentifier: string): void {
    let chartToIncrement: any;
  
    if (chartIdentifier === 'chart1') { 
      chartToIncrement = this.chart1;
    } else if (chartIdentifier === 'chart2') {
      chartToIncrement = this.chart2;
    }

    console.log(chartToIncrement)
    console.log(chartToIncrement.chart.config)
    let maxY = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;

    console.log('Before update', chartToIncrement.chartData);
    if (chartToIncrement && this.multiplier) {
      chartToIncrement.chart.config.data.datasets.forEach((dataset: any) => {
        dataset.data = dataset.data.map((point: any) => {
          let newY = (typeof point.y !== 'undefined' ? point.y * this.multiplier : point * this.multiplier);
          if (newY > maxY) maxY = newY;
          if (newY < minY) minY = newY;
          if (typeof point === 'object' && point.y !== undefined) {
            return { x: point.x, y: point.y * this.multiplier };
          } else if (typeof point === 'number') {
            return point * this.multiplier;
          }
          return point;
        });
      });
      console.log('After update', chartToIncrement.chartData);
      // Call the update method on the chart
      if (chartToIncrement.chart.options.scales.yAxes) {
        chartToIncrement.chart.options.scales.yAxes[0].ticks.min = minY;
        chartToIncrement.chart.options.scales.yAxes[0].ticks.max = maxY;
      } else if (chartToIncrement.chart.options.scales.y) { // For Chart.js 3.x
        chartToIncrement.chart.options.scales.y.min = minY;
        chartToIncrement.chart.options.scales.y.max = maxY;
      }
      chartToIncrement.chart.update(); // Assuming this is the correct method to update your chart
    }
  }
  
  calculateMean(data: number[]) {
    if (data.length === 0) {
      return 0;
    }
    const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const mean = sum / data.length;
    return mean;
  }
  onResetChart() {
    this.chart1.clear()
    this.chart2.clear()
    this.chart3.clear()
    this.chart4.clear()
    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
    this.chart3.chart.update(0)
    this.chart4.chart.update(0)
    this.chart1.options.scales.yAxes[0].ticks.min = 0

    this.chart1.options.scales.yAxes[0].ticks.max = 10
  }
  resetAxis(chartInstance: any) {
    if (chartInstance.chart.options.scales.yAxes) {
        // Reset for Chart.js 2.x
        chartInstance.chart.options.scales.yAxes[0].ticks.min = 'auto';
        chartInstance.chart.options.scales.yAxes[0].ticks.max = 'auto';
    } else if (chartInstance.chart.options.scales.y) {
        // Reset for Chart.js 3.x
        chartInstance.chart.options.scales.y.min = 'auto';
        chartInstance.chart.options.scales.y.max = 'auto';
    }
}
  async ngOnInit() {
    this.chart1 = new chatClass("data-chart-1", this.datasets[0]);
    this.chart2 = new chatClass("data-chart-2", this.datasets[1]);
    this.chart3 = new chatClass("data-chart-3", this.datasets[3]);
    this.chart4 = new chatClass("data-chart-4", this.datasets[3]);
    this.chart5 = new chatClass("diff-chart", this.datasets[0]);
   
  }
  ngAfterContentInit(){
    let leg = [`Differences `, `NaN`]
    let color = [`orange `, `red`]
    let rData2: { minmax: [number, number], data: any[][], backgroundColor: string } = {
      "minmax": [0 ,1],
      "data": [[],[]],
      "backgroundColor": "rebeccapurple"
    }
   
    this.chart5.setDataFromRaw(rData2);
    this.chart5.setLengend(leg,color)

    this.chart5.chart.update(0) 
  }
  loadData(): void {
    this.csv = this.parseData(this.csvraw.trim());
    console.log(this.csv);
    this.updateData(this.csv)

    // this.updateChart(data);
    // this.updateSummaryChart(data);
  }

  updateChart(data: string): void {
    
    const rows = data.split('\n');
    const parsedData = rows.map(row => {
      const [group, value] = row.split(',').map(Number);
      return { x: value, y: group };
    });

    this.chartData = [
      {
        data: parsedData,
        label: 'Original Data',
        pointRadius: 6,
      },
    ];

    this.chartLabels = parsedData.map((_, index) => `Data Point ${index + 1}`);
  }
  updateSummaryChart(data: string): void {
    const rows = data.split('\n');
    const group1Data = rows.map(row => parseFloat(row.split(',')[1])).filter(value => !isNaN(value));
    const group2Data: any = [];  // Assuming data for Group 2 is not available in the provided example

    const sizeGroup1 = group1Data.length;
    const meanGroup1 = sizeGroup1 > 0 ? group1Data.reduce((acc, val) => acc + val, 0) / sizeGroup1 : NaN;

    const sizeGroup2 = group2Data.length;
    const meanGroup2 = sizeGroup2 > 0 ? group2Data.reduce((acc: any, val: any) => acc + val, 0) / sizeGroup2 : NaN;

    const diffOfMeans = isNaN(meanGroup1) || isNaN(meanGroup2) ? NaN : meanGroup1 - meanGroup2;

    this.summaryData = [
      { data: [sizeGroup1, meanGroup1, sizeGroup2, meanGroup2, diffOfMeans], label: 'Summary Statistics' },
    ];
  }

  runSimulations(): void {
    // You should implement your simulation logic here
    // For simplicity, I'm just logging the number of simulations
    console.log('Running', this.numberOfSimulations, 'simulations');
  }

  sampleSelect(e: any) {
    this.csv = null
    let link = ""
    if (e.target.value == "sample1") {
      link = "../../../assets/twomean_sample1.csv"
    } else {
      link = "../../../assets/twomean_sample2.csv"

    }
    fetch(link).then(data => data.text())
      .then((data) => {
        this.csvraw = data
        this.csv = this.parseData(data.trim());

      })
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
    let numSims = this.numofSem * 1;
    let results = [];
    for (let simIdx = 0; simIdx < numSims; simIdx++) {
      let allData = [];
      for (let item of this.csv[0]) {
        allData.push({ datasetId: 0, value: item });
      }
      for (let item of this.csv[1]) {
        allData.push({ datasetId: 1, value: item });
      }
      if (allData.length === 0) {
        return;
      }
      let { chosen, unchosen } = this.smp.randomSubset(allData, this.csv[0].length);
      this.chart3.setDataFromRaw(this.addSimulationSample(chosen));
      this.chart4.setDataFromRaw(this.addSimulationSample(unchosen));
      this.chart3.chart.update();
      this.chart4.chart.update();

      // TODO(matthewmerrill): This is very unclear.
      let sampleValues = [chosen.map(a => a.value), unchosen.map(a => a.value)];
      let mean0 = this.calculateMean(sampleValues[0]);
      let mean1 = this.calculateMean(sampleValues[1]);
      let stdevSim1 = this.calculateStandardDeviation(sampleValues[0]);
      let stdevSim2 = this.calculateStandardDeviation(sampleValues[1]);
      let sampleDiffOfMeans = mean1 - mean0;
      results.push(sampleDiffOfMeans);
      this.meansOfMeans.push(sampleDiffOfMeans)
      this.simsummary = {
        sampleMean1: Number(mean0.toFixed(3)),
        sampleMean2: Number(mean1.toFixed(3)),
        sampleMeanDiff: Number(sampleDiffOfMeans.toFixed(3)),
        stdev1sim: Number(stdevSim1.toFixed(3)),
        stdev2sim: Number(stdevSim2.toFixed(3)),
      };
      this.tail.addAllResults(results)
    }
    this.samDisActive = true
    this.confidenceInteval()
    // this.charts.tailChart.addAllResults(results);
    // this.updateSimResults();
  }

  addSimulationSample(sample: any[]) {
    let a: any = []
    let b: any = []
    let facetedArrays = [a, b];
    for (let item of sample) {
      facetedArrays[item.datasetId].push(item.value);
    }
    let rData2 = {
      "minmax": this.minmax,
      "data": facetedArrays
    }
    return rData2
  }
  selectedTest(e: any) {
    this.tail.setTailDirection(e.target.value)
    let data = this.tail.updateChart2(this.chart5)
    this.chart5.setDataFromRaw(data);
    this.lastSummary = this.tail.getSummary()
    let leg = [`Differences < ${this.mean_diff}`, `Differences > = ${this.mean_diff}`]
    let color
    if (e.target.value == "oneTailRight") {
      color = [`green`, `red`]
    }
    else{
       color = [`red`, `green`]
     }
    this.chart5.setLengend(leg,color)
    this.chart5.chart.update(0)

  }
  confidenceInteval(){
    let sumOfMeans = this.meansOfMeans.reduce((a: any, b:any) => a + b, 0);
    let stdev: number = parseFloat(MathService.sampleStddev(this.meansOfMeans).toFixed(2));
    let lowerBound: number = sumOfMeans - 2 * stdev
    let upperBound: number = sumOfMeans + 2* stdev
    let invalidValues: number[] = [];
    let valid: number[] = [];
    console.log(this.meansOfMeans[0])
this.meansOfMeans.forEach((mean: number) => {
  if (mean < lowerBound || mean > upperBound) {
    // Do something with the value if needed
    console.log(`Invalid value: ${mean}`);
    invalidValues.push(mean);
  }
  else valid.push(mean);
});
let chartData = [
  {
    label: 'Valid Data',
    data: valid.map((value: number) => ({ x: value, y: 0 })), // Assuming a simple scatter plot on the X-axis
    backgroundColor: 'green', // Valid data points in green
    pointRadius: 5,
  },
  {
    label: 'Invalid Data',
    data: invalidValues.map(value => ({ x: value, y: 0 })), // Assuming a simple scatter plot on the X-axis
    backgroundColor: 'red', // Invalid data points in red
    pointRadius: 5,
  }
];

// Assuming chart4 is already initialized and is a Chart.js instance
this.chart5.chart.config.data.datasets = chartData;
this.chart5.chart.update();
  }
  onFileSelected(e: any) {
    const files = e.target.files || e.dataTransfer?.files;
    if (files.length) {
      const file = files[0]
      const filereader = new FileReader();
      filereader.readAsBinaryString(file)
      filereader.onload = (event: any) => {
        const wb = XLS.read(filereader.result, { type: 'binary' })
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const row = XLS.utils.sheet_to_csv(wb.Sheets[sheets[0]])
          this.csvraw = row
          this.csv = this.parseData(this.csvraw.trim())
        }
      }
    }

  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.onFileSelected(event)
  }
}
