import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { chatClass } from 'src/app/Utils/stacked-dot';
import { Sampling } from 'src/app/Utils/sampling';
import { TailchartService } from 'src/app/Utils/tailchart.service';
import * as XLS from 'xlsx';

@Component({
  selector: 'app-two-means',
  templateUrl: './two-means.component.html',
  styleUrls: ['./two-means.component.scss']
})
export class TwoMeansComponent implements OnInit {
  csv: any
  dataSize1: number = 0
  dataSize2: number = 0
  datamean2: number = 0
  datamean1: number = 0
  mean_diff: number = 0
  numofSem: number = 1
  chart1: any
  chart2: any
  chart3: any
  chart4: any
  chart5: any
  minmax: any
  csvraw:any
  samDisActive = false

  activateSim: boolean = false
  lastSummary: any
  simsummary: any = {
    sampleMean1: NaN,
    sampleMean2: NaN,
    sampleMeanDiff: NaN,
  }
  demodata: any = [
  ]
  datasets = [
    { label: "Group 1", backgroundColor: 'orange', data: this.demodata },
    { label: "Group 2", backgroundColor: 'rebeccapurple', data: this.demodata },
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

  dataTextArea: string = '';
  data: any
  updateData(data: any) {
    debugger
    this.dataSize1 = this.csv[0].length
    this.dataSize2 = this.csv[1].length
    this.datamean1 = Number(this.calculateMean(this.csv[0]).toFixed(3))
    this.datamean2 = Number(this.calculateMean(this.csv[1]).toFixed(3))
    this.mean_diff = Number((this.datamean1 - this.datamean2).toFixed(3))
    let dataValues = this.csv[0].concat(this.csv[1]);
    let min = Math.min.apply(undefined, dataValues);
    let max = Math.max.apply(undefined, dataValues);
    this.minmax = {
      "min": min,
      "max": max,
    }
    let rData = {
      "minmax": this.minmax,
      "data": [this.csv[0]],
      background: "orange"
    }
    let rData2 = {
      "minmax": this.minmax,
      "data": [this.csv[1]],
      background: "green"
    }

    this.chart1.setScale(min, max)
    this.chart2.setScale(min, max)
    this.chart1.setDataFromRaw(rData)
    this.chart2.setDataFromRaw(rData2)
    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
    this.activateSim = true
  }

  calculateMean(data: number[]) {
    if (data.length === 0) {
      return 0;
    }
    const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const mean = sum / data.length;
    return mean;
  }
  onResetChart(){
    this.chart1.clear()
    this.chart2.clear()
    this.chart3.clear()
    this.chart4.clear()
    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
    this.chart3.chart.update(0)
    this.chart4.chart.update(0)
  }

  async ngOnInit() {
    this.chart1 = new chatClass("data-chart-1", this.datasets[0]);
    this.chart2 = new chatClass("data-chart-2", this.datasets[0]);
    this.chart3 = new chatClass("data-chart-3", this.datasets[0]);
    this.chart4 = new chatClass("data-chart-4", this.datasets[0]);
    this.chart5 = new chatClass("diff-chart", this.datasets[0]);
  }

  loadData(): void {
    const data = this.csv
    this.updateData(this.csv)

    // this.updateChart(data);
    // this.updateSummaryChart(data);
  }

  updateChart(data: string): void {debugger
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
    debugger
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
      let sampleDiffOfMeans = mean1 - mean0;
      results.push(sampleDiffOfMeans);

      this.simsummary = {
        sampleMean1: Number(mean0.toFixed(3)),
        sampleMean2: Number(mean1.toFixed(3)),
        sampleMeanDiff: Number(sampleDiffOfMeans.toFixed(3))
      };
      this.tail.addAllResults(results)
    }
    this.samDisActive = true
    // this.charts.tailChart.addAllResults(results);
    // this.updateSimResults();
  }

  addSimulationSample(sample: any[]) {
    let a: any = []
    let b: any = []
    let facetedArrays = [a, b];
    console.log(facetedArrays);
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
    debugger
    this.tail.setTailDirection(e.target.value)
    let data = this.tail.updateChart2(this.chart5)
    this.chart5.setDataFromRaw(data);
    this.lastSummary = this.tail.getSummary()
    this.chart5.chart.update(0)
    console.log(this.lastSummary);

  }
  onFileSelected(e: any) {
    debugger
    const files = e.target.files || e.dataTransfer?.files;
    if (files.length) {
      const file = files[0]
      const filereader  = new  FileReader();
      filereader.readAsBinaryString(file)
      filereader.onload = (event:any) =>{
        const wb = XLS.read(filereader.result, {type:'binary'})
        const sheets = wb.SheetNames; 
        if (sheets.length) {
          const row  = XLS.utils.sheet_to_csv(wb.Sheets[sheets[0]])
          debugger
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
