import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
//import { OnePropChart } from './chart/onepropchart';
import Chart, { ChartPoint, ChartType } from 'chart.js';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { StackedDotChartService } from 'src/app/Utils/stacked-dot-chart.service';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService } from 'src/app/Utils/sampling.service';
import { SummaryService } from 'src/app/Utils/summaries.service';
import { max } from 'simple-statistics';
@Component({
  selector: 'app-one-proportion-ci',
  templateUrl: './one-proportion-ci.component.html',
  styleUrls: ['./one-proportion-ci.component.scss']
})

export class OneProportionCIComponent implements OnInit {
  constructor( private cdRef: ChangeDetectorRef) {
  }
  
  ngOnInit(): void {
  }

  @ViewChild('successInput', { static: true }) successInput!: ElementRef<HTMLInputElement>;
  @ViewChild('failureInput', { static: true }) failureInput!: ElementRef<HTMLInputElement>;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  failure: number
  success: number
  randomizedfailure:number 
  randomizedsuccess:number 
  confidenceLevel:number = 95
  increment:number = 1
  sampleSize:number
  numSimulations:number  
  numsuccess:number 
  numfailure:number
  proportion: number 
  sampleProportion: number 
  mean: number
  stddev: number
  lower: number
  upper: number
  total: number
  needData = []
  simulations: number[] = []
  noData = []
  //chart: any
  sampleMeans: any
  Summaries = new SummaryService();
  summaryElements = this.Summaries.loadSummaryElements(document);
  data: {numsuccess: number, numfailure: number};
  Data: {success: number, failure: number};

  public barChartType1: ChartType = 'bar';
  public barChartType2: ChartType = 'scatter';

  public barChartData1: ChartDataSets[] =[
    {
      label: '% Successes',
      backgroundColor: 'green',
      hoverBackgroundColor: 'green',
      data: [],
      borderColor: 'green'
    },
    {
      label: '% Failures',
      backgroundColor: 'red',
      hoverBackgroundColor: 'red',
      data: [],
      borderColor: 'red'
    },
  ];
 public barChartLabels1: any = [];

  public barChartData2: ChartDataSets[] =[
    {
      label: '% Successes',
      backgroundColor: 'green',
      hoverBackgroundColor: 'green',
      data: [],
      borderColor: 'green'
    },
    {
      label: '% Failures',
      backgroundColor: 'red',
      hoverBackgroundColor: 'red',
      data: [],
      borderColor: 'red'
    },
  ];
  public barChartLabels2: any = [];

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
          ticks:{
            max:1,
            min:-1,
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

  loadData() {
    let numsuccess = this.getInputValue(this.successInput);
    let numfailure = this.getInputValue(this.failureInput);
    this.barChartData1 = this.barChartData1 = [
      { 
        data: [], 
        label: '% Successes',
        backgroundColor: 'green', 
        hoverBackgroundColor: 'green', 
      }, 
      { 
        data: [], 
        label: '% Failures', 
        backgroundColor: 'red',
        hoverBackgroundColor: 'red',
      }];
    if (numsuccess <= 0 || numfailure <= 0) {
      alert('Please enter valid values for success and failure, ensuring it is greater that 0.');
    }
    else {
      let proportion = this.calculateProportion(numsuccess, numfailure);
      this.proportion = proportion;
      let summary = {
         numsuccess, numfailure,
         proportion: this.proportion, // todo(matthewmerrill): fixed decimals
         ...this.resetAllBut(["numsuccess", "numfailure","proportion"])
        
      }
      this.Summaries.updateSummaryElements(this.summaryElements, summary);
      this.data = { numsuccess, numfailure};
      this.numfailure = numfailure;
      this.numsuccess = numsuccess;
      const successPercentage = this.calculateSuccessPercentage(numsuccess, numfailure);
      const failurePercentage = this.calculateFailurePercentage(numsuccess, numfailure);
  
      this.barChartData1[0].data = this.barChartData1[0].data || [];
      this.barChartData1[1].data = this.barChartData1[1].data || [];

    // Update the data in barChartData1
      this.barChartData1[0].data[0] = MathService.roundToPlaces(successPercentage, 2);
      this.barChartData1[1].data[0] = MathService.roundToPlaces(failurePercentage, 2);
    }
  }

  resetData(){
    this.success = 0;
    this.failure = 0;
    this.numfailure = 0;
    this.numsuccess = 0;
    this.proportion = NaN;
    this.sampleSize = 0;
    this.numSimulations = 0;
    this.sampleProportion = NaN;
    this.randomizedsuccess = 0;
    this.randomizedfailure = 0;
    this.mean = NaN;
    this.stddev = NaN;
    this.lower = NaN;
    this.upper = NaN;
    this.total = 0;
    this.simulations = [];
    

    this.barChartData1 = this.defaultChartData();
    this.barChartLabels1 = [];
    this.barChartOptions1 = this.defaultChartOptions;

    this.barChartData2 = this.defaultChartData2();
    this.barChartLabels2 = [];
    this.barChartOptions2 = this.defaultChartOptions2;

    // this.barChartData3.forEach
    // (this.defaultChartData3 = this.defaultChartData3);
    this.barChartData3 = this.defaultChartData3();
    this.barChartLabels3 = [];
    this.barChartOptions3 = this.defaultChartOptions3;
  }

  private defaultChartOptions: any={
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

  private defaultChartOptions2: any={
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
            stepSize:20
          },
          scaleLabel:{
            display: true,
          }
        },
      ],
    },
    maintainAspectRatio: false,
  }

  private defaultChartOptions3: any={
    responsive: true,
    scales:{
      xAxes:[
        {
          ticks:{
            max:1,
            min:-1,
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
  }
  
  private defaultChartData(): Chart.ChartDataSets[]{
    return [
      {
        label: '% Successes',
        backgroundColor: 'green',
        hoverBackgroundColor: 'green',
        data: [],
        borderColor: 'green'
      },
      {
        label: '% Failures',
        backgroundColor: 'red',
        hoverBackgroundColor: 'red',
        data: [],
        borderColor: 'red'
      },
    ]
  }

  private defaultChartData2(): Chart.ChartDataSets[]{
    return[
      {
        label: '% Successes',
        backgroundColor: 'green',
        hoverBackgroundColor: 'green',
        data: [],
        borderColor: 'green'
      },
      {
        label: '% Failures',
        backgroundColor: 'red',
        hoverBackgroundColor: 'red',
        data: [],
        borderColor: 'red'
      },
    ]
  }

  private defaultChartData3(): Chart.ChartDataSets[]{
    return[
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
    ]
  }

  calculateProportion(numsuccess: number, numfailure: number): number {
    let totalInA = numsuccess + numfailure;
    return numsuccess / totalInA;
  }

  private getInputValue(inputRef: ElementRef<HTMLInputElement>): number {
    return inputRef && inputRef.nativeElement ? +inputRef.nativeElement.value : 0;
  }

  incrementt(increment: number): void{
   if(increment > 0)
    {
      this.numsuccess*=increment;
      this.numfailure*=increment;
      //this.updateChart();
      // this.success = this.success*increment;
      // this.failure = this.failure*increment;
   }
   //this.calcNumsuccfail();
    //this.updateChart();
  }
  calcNumsuccfail(): void{
    this.numsuccess = Math.round(this.success);
    this.numfailure = Math.round(this.failure);
  }

  calculateSuccessPercentage(numsuccess: number, numfailure: number): number {
    let totalInA = numsuccess + numfailure;
    return (numsuccess / totalInA) * 100;
  }
  calculateFailurePercentage(numsuccess: number, numfailure: number): number {
    let totalInA = numsuccess + numfailure;
    return (numfailure / totalInA) * 100;
  }
  runSimulations() {
   let numSimulationsValue = this.numSimulations;
   let numsuccess = this.data.numsuccess ?? 0;
   let numfailure = this.data.numfailure ?? 0;
   let totalSuccess = numsuccess;
   let totalGroup = numsuccess + numfailure;
   const totalElements = this.sampleSize;
   this.barChartData2 = this.barChartData2 = [
    { 
      data: [], 
      label: '% Successes',
      backgroundColor: 'green',
      hoverBackgroundColor: 'green', 
    }, 
    { 
      data: [], 
      label: '% Failures', 
      backgroundColor: 'red',
      hoverBackgroundColor: 'red',
    }];

    for (let simIdx = 0; simIdx < numSimulationsValue; simIdx++) {
      let allItems = new Array(totalGroup);
      allItems.fill(0);
      allItems.fill(1, 0, totalSuccess);
      const shuffled = SamplingService.shuffle(allItems);
      const { chosen } = SamplingService.randomSubset(shuffled, totalElements);
      const samplesuccess = MathService.countWhere(chosen, (data: number) => data == 1);
      const samplefailure = totalElements - samplesuccess;
      let sampleProportion: number = MathService.roundToPlaces(samplesuccess / totalElements, 4);
      this.sampleProportion = sampleProportion;
      //const mean = MathService.mean(this.simulations);
      //const stddev = MathService.stddev(this.simulations);
      //const total = this.simulations.length ;

      const standardError = this.stddev/Math.sqrt(this.total);
      const zScore = MathService.z_score_alpha_2(this.confidenceLevel);
  
      const marginOfError = zScore * standardError;
  
      const lower = this.mean - marginOfError;
      const upper = this.mean + marginOfError;

      const successPercentagee = (samplesuccess / totalElements) * 100;
      const failurePercentagee = (samplefailure / totalElements) * 100;
  
      this.barChartData2[0].data = this.barChartData2[0].data || [];
      this.barChartData2[1].data = this.barChartData2[1].data || [];
    
      if (this.sampleSize !== totalElements) {
        this.sampleSize = totalElements;
        this.sampleMeans = [];
      }
  
      this.simulations.push(sampleProportion);
  
      let summary = {
        samplesuccess,
        samplefailure,
        sampleProportion,
        //mean,
        //stddev,
        //total,
        lower,
        upper
      };
    
      this.randomizedsuccess = samplesuccess;
      this.randomizedfailure = samplefailure;
     // this.mean = MathService.mean(this.simulations);
     // this.stddev = MathService.stddev(this.simulations);
     // this.total = total;
      this.lower = lower;
      this.upper = upper;

      this.Summaries.updateSummaryElements(this.summaryElements, summary);
  
      this.barChartData2[0].data[simIdx] = MathService.roundToPlaces(successPercentagee, 2);
      this.barChartData2[1].data[simIdx] = MathService.roundToPlaces(failurePercentagee, 2);
      //this.buildci();
      //this.updateLatestCharts();
      // Update the bar chart data for each simulation
      //const successPercentage = this.calculateSuccessPercentage(numsuccess, numfailure);
      //const failurePercentage = this.calculateFailurePercentage(numsuccess, numfailure);
  
    }
    this.mean = MathService.mean(this.simulations);
    this.stddev = MathService.stddev(this.simulations);
    this.total = this.simulations.length;
    this.buildci();
    this.updateC();
  }
  
  buildci()
  {
    const standardError = this.stddev/Math.sqrt(this.total);
    const zScore = MathService.z_score_alpha_2(this.confidenceLevel);

    const marginOfError = zScore * standardError;

    this.lower = this.mean - marginOfError;
    this.upper = this.mean + marginOfError;
  }

  updateC(): void{
    const [lower, upper] = MathService.getCutOffInterval(this.confidenceLevel, this.simulations.length);
    let pointsInInterval:any[] = [];
    let pointsNotInInterval:any[] = [];
    let frequencyMap: Record<number, number> = {};
    // let dataInInterval: any = [];
    // let dataNotInInterval: any = [];

    // let point:any = {};
    // let pointsArray:any = {};
    // for(let i=0; i<this.simulations.length; i++){
    //   let value = this.simulations[i];
    //   if(point[value] === undefined){
    //     point[value] = 1;
    //   } else{
    //     point[value] += 1;
    //   }
    //   pointsArray.push({x: value, y: point[value]});
    //   if (value >= lower && value <= upper) {
    //     this.barChartData3 = [{
    //       data: pointsArray.map((value:any) => ({x: value.x, y: value.y})),
    //       label: 'Values in Interval',
    //       pointBackgroundColor: pointsArray.map((value:any) => value.x > this.lower ? 'green' : 'red'),
    //     }];
    //   } else if(value> upper){
    //     this.barChartData3 = [{
    //       data: pointsArray.map((value:any) => ({x: value.x, y: value.y})),
    //       label: 'Values not in Interval',
    //       pointBackgroundColor: pointsArray.map((value:any) => value.x > this.lower ? 'red' : 'green'),
    //     }];
    //   }
    // }
    // Calculate frequency of each value
    for(let value of this.simulations){
      if(frequencyMap[value]){
          frequencyMap[value] += 1;
      } else {
          frequencyMap[value] = 1;
      }
  }

  // Separate the values into 'in interval' and 'not in interval'
  for(let value of Object.keys(frequencyMap)){
      let x = parseFloat(value);
      let y = frequencyMap[value as unknown as number];
      if(x >= lower && x <= upper){
          pointsInInterval.push({x: x, y: y});
      } else {
          pointsNotInInterval.push({x: x, y: y});
      }
  }

  // Set the barChartData3 with both datasets
  this.barChartData3 = [
    {
      data: pointsInInterval,
      label: 'Values in Interval',
      backgroundColor: 'green',
      pointBackgroundColor: pointsInInterval.map((value:any) => value.x > this.lower ? 'green' : 'red'),
    },
    {
      data: pointsNotInInterval,
      label: 'Values not in Interval',
      backgroundColor: 'red',
      pointBackgroundColor: pointsNotInInterval.map((value:any) => value.x > this.lower ? 'red' : 'green'),
    }
  ];

  // If you need to update the chart, do it here
  if (this.chart && this.chart.chart) {
      this.chart.chart.update();
  }
    //if (this.confidenceLevel == 0 || this.simulations.length === 0) return;

    //const sortedSimulations = [...this.simulations].sort((a,b) => a-b);

    // let frequencyMap = new Map<number, number>();
    // this.simulations.forEach(value => {
    //   let frequency = frequencyMap.get(value) || 0;
    //   frequencyMap.set(value, frequency + 1);
    // });

    // Populate the data arrays for in and out of interval.
    // frequencyMap.forEach((count, value) => {
    //   let dataPoint = { x: value, y: count };
    //   if (value >= lower && value <= upper) {
    //     dataInInterval.push(dataPoint);
    //   } else {
    //     dataNotInInterval.push(dataPoint);
    //   }
    // });  

    // this.barChartData3[0].data = dataInInterval;
    // this.barChartData3[1].data = dataNotInInterval;
 
    // this.barChartLabels3 = Array.from({ length: this.simulations.length }, (_, i) => `Simulation ${i + 1}`);

    // this.cdRef.detectChanges();

    // if (this.chart && this.chart.chart) {
    //   this.chart.chart.update();
    //   console.log('Chart updated');
    // }
  }

  // updateChartt(): void{
  //   //const confidenceLevel = Number(this.dom.ciElement.value) || 100;
  //  // let confidenceLevel = Number(this.dom.ciElement.value) || 100;;
  //   // if (this.dom.ciElement) {
  //   //   confidenceLevel = Number(this.dom.ciElement.value) || 100;
  //   // } else {
  //   //   // Handle the case where ciElement is not available.
  //   //   console.error('ciElement is not available.');
  //   //   // Set a default confidence level or perform other error handling as needed.
  //   //   confidenceLevel = 100;
  //   // }
  //   if (this.confidenceLevel == 0 || this.simulations.length === 0) return;

  //   const [lower, upper] = MathService.getCutOffInterval(this.confidenceLevel, this.simulations.length);
  //   const sortedSimulations = [...this.simulations].sort((a,b) => a-b);
  //   //const jitter = (amount: number) => Math.random() * amount - amount / 2;
  //   // const confidenceInterval = {
  //   //   lower: sortedSimulations[lower],
  //   //   upper: sortedSimulations[Math.min(upper, sortedSimulations.length - 1)]
  //   // };

  //   let frequencyMap = new Map<number, number>();

  //   // Count the frequency of each value
  //   for (const value of sortedSimulations) {
  //     frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
  //   }
    
  //   // const lowerBound = this.lower;
  //   // const upperBound = this.upper;

  //   // this.Summaries.updateSummaryElements(this.summaryElements, {
  //   //   lower: confidenceInterval.lower,
  //   //   upper: confidenceInterval.upper
  //   // });

  //   let dataInInterval: any = [];
  //   let dataNotInInterval: any = [];

  //   // Separate the values into in interval and not in interval arrays
  //   for (const [value, count] of frequencyMap) {
  //     if (value >= lower && value <= upper) {
  //       dataInInterval.push({ x: value, y: count });
  //     } else {
  //       dataNotInInterval.push({ x: value, y: count });
  //     }
  //   }
  //   // sortedSimulations.forEach((value) => {
  //   //   const yValueWithJitter = 1 + jitter(0.1); // Jitter of +/- 0.05 around y=1
  //   //   if (value >= lowerBound && value <= upperBound) {
  //   //     dataInInterval.push({ x: value, y: yValueWithJitter });
  //   //   } else {
  //   //     dataNotInInterval.push({ x: value, y: yValueWithJitter });
  //   //   }
  //   // });

  //   // let valueCounts: Record<number, number> = {};
    
  //   // interface ChartDataPoint{
  //   //   x: number;
  //   //   y: number;
  //   // }

  //   // for(const value of this.simulations){
  //   //   if(value >= this.lower && value <= this.upper){
  //   //     valueCounts[value] = (valueCounts[value] || 0) + 1;
  //   //   }
  //   // }

  //   // //let dataInInterval: ChartDataPoint[] = [];
  //   // //let dataNotInInterval: ChartDataPoint[] = [];

  //   // let dataInInterval = Object.keys(valueCounts).map((xValue) => {
  //   //   return { 
  //   //     x: parseFloat(xValue), 
  //   //     y: valueCounts[parseFloat(xValue)],
  //   //   };
  //   // });
    
  //   // let dataNotInInterval = this.simulations.filter((value) => value < this.lower || value > this.upper).map((value) => {
  //   //   return { 
  //   //     x: value,
  //   //     y: -1,
  //   //   }; // Using -1 just to indicate not in interval for visualization
  //   // });

  //   //let minValue = Math.min(...this.simulations);
  //   //let maxValue = Math.max(...this.simulations);

  //   // this.simulations.forEach((value, index) => {
  //   //   const point = {x:index, y:value};
  //   //   //let point = {x:index, y:value};
  //   //   if (value >= confidenceInterval.lower && value <= confidenceInterval.upper) {
  //   //     //dataInInterval;
  //   //     //this.barChartData3[0].data = dataInInterval;
  //   //     //dataInInterval.push(point);
  //   //     this.barChartData3[0].data?.push(point as any);
  //   //   } else {
  //   //     //dataNotInInterval;
  //   //     //this.barChartData3[0].data = dataNotInInterval;
  //   //     //dataNotInInterval.push(point);
  //   //     this.barChartData3[0].data?.push(point as any);
  //   //   }
  //   // });

  //   this.barChartData3[0].data = dataInInterval;
  //   this.barChartData3[1].data = dataNotInInterval;

  //   this.barChartLabels3 = sortedSimulations.map((_, index) => `Simulation ${index + 1}`);

  //   // this.barChartData3 = [
  //   //   {
  //   //     label: 'Values in Interval',
  //   //     backgroundColor: 'green', 
  //   //     data: dataInInterval, 
  //   //     borderColor: 'green',
  //   //     pointBorderColor: 'green'
  //   //     //"data": [{"x": value, "y": 1}, {"x": value2, "y": 1}, ...],
  //   //    // data: [],
  //   //   },
  //   //   {
  //   //     label: 'Values not in Interval',
  //   //     backgroundColor: 'red',
  //   //     data: dataNotInInterval,
  //   //     borderColor: 'red', 
  //   //     pointBorderColor: 'red'
  //   //     //"data": [{"x": value3, "y": 1}, {"x": value4, "y": 1}, ...],
  //   //     //data: [],
  //   //   }
  //   // ];

  //   //this.barChartLabels3 = Array.from({length: this.simulations.length}, (_, i) => 'Label ${i + 1}');
  // //   this.barChartLabels3 = this.simulations.map((_, index) => `Simulation ${index + 1}`);

  // //  // this.charts.ciChart.setScale(confidenceInterval.lower, confidenceInterval.upper);

  // //   this.barChartOptions3 ={
  // //     responsive: true,
  // //     scales:{
  // //       xAxes:[
  // //         {
  // //           ticks:{
  // //             max:maxValue,
  // //             min:minValue,
  // //             stepSize: 0.2, 
  // //             beginsAtZero: true,
  // //           },
  // //           scaleLabel: {
  // //             display:true,
  // //           }
  // //         },
  // //       ],
  // //       yAxes:[
  // //         {
  // //           ticks:{
  // //             min: 1,
  // //             stepSize:1,
  // //             beginsAtZero: true,
  // //           },
  // //           scaleLabel:{
  // //             display:true,
  // //           }
  // //         }
  // //       ]
  // //     },
  // //     maintainAspectRatio: false,
  // // };

  //   //this.barChartLabels3 = this.simulations.map((index:number) => `Label ${index + 1}`);
   
  //  //this.barChartData3[0].data = this.barChartData3[0].data || [];
  //  //this.barChartData3[1].data = this.barChartData3[1].data || [];
   
  //   // console.log('Updated Chart Data:', this.barChartData3);
  //   // // ... rest of your code ...

  //   //console.log(`Lower: ${this.lower}, Upper: ${this.upper}`);
   
  //   // this.simulations.forEach((value, index) => {
  //   //   let point:any = {x: index, y: value};
  //   //   if(value >= this.lower && value <= this.upper){
  //   //     this.barChartData3[0].data?.push(point);
  //   //   } else{
  //   //     this.barChartData3[1].data?.push(point);
  //   //   }
  //   // });
  //   // console.log('Updated Chart Data:', this.barChartData3);
  //   // for(const value of this.simulations){
  //   //   //let point: number[] = [value,1];
  //   //   if(value >= this.lower && value <= this.upper){
  //   //     this.barChartData3[0].data.push(value);
  //   //     //this.barChartData3[1].data.push(null!);
  //   //   }else{
  //   //     //this.barChartData3[0].data.push(null!);
  //   //     this.barChartData3[1].data.push(value);
  //   //   }
  //   // }
  //   //console.log('Final Chart Data:', JSON.stringify(this.barChartData3, null, 2));

  //   if (this.chart && this.chart.chart) {
  //     this.chart.chart.update();
  //     console.log('Chart updated');
  //   }
  //}

  resetAllBut(remove: string[]): Record<string, any>{
    const keys = Object.keys(this.summaryElements)
    const result: Record<string, any> ={};
    keys.forEach(key => {
      if (!remove.includes(key)){
        result[key] = this.noData
      }
    })
    return result
  }

  update() {
    this.chart.update();
  }
}
