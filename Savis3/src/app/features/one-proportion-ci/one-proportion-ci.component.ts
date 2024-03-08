import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
//import { OnePropChart } from './chart/onepropchart';
import Chart, { ChartPoint, ChartType } from 'chart.js';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { StackedDotChartService } from 'src/app/Utils/stacked-dot-chart.service';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService } from 'src/app/Utils/sampling.service';
import { SummaryService } from 'src/app/Utils/summaries.service';
//import { max } from 'simple-statistics';

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
  increment:number = 0
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
      alert('The value of successes and failures must be greater than 0');
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
    this.increment = 0;
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
      this.numsuccess = this.success * increment;;
      this.numfailure = this.failure * increment;
   }else{
    alert('Increase by factor must be greater than zero')
   }
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

    if (this.increment<=0) {
      alert('Please increment the data for group');
    }

    else{
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
        };
      
        this.randomizedsuccess = samplesuccess;
        this.randomizedfailure = samplefailure;
  
        this.Summaries.updateSummaryElements(this.summaryElements, summary);
    
        this.barChartData2[0].data[simIdx] = MathService.roundToPlaces(successPercentagee, 2);
        this.barChartData2[1].data[simIdx] = MathService.roundToPlaces(failurePercentagee, 2);
      }
      this.mean = MathService.mean(this.simulations);
      this.stddev = MathService.stddev(this.simulations);
      this.total = this.simulations.length;
      this.buildci();
    }
  }

  buildci()
  {
    const standardError = this.stddev/Math.sqrt(this.total);
    const zScore = MathService.z_score_alpha_2(this.confidenceLevel);

    const marginOfError = zScore * standardError;
    
    this.lower = this.mean - marginOfError,
    this.upper = this.mean + marginOfError

    const temp = this.simulations.map(val => val);
    temp.sort((a,b) => a-b);

    const [chosen, unchosen] = SamplingService.splitUsing(temp, (val: number) => {
      return val>=this.lower &&  val<=this.upper;
    });

    let chosenFreq: Record<string, number> = {};
    let unchosenFreq: Record<string, number> = {};
    
    // Calculate frequencies for chosen and unchosen values
    chosenFreq = {};
    chosen.forEach(val => {
      chosenFreq[val] = (chosenFreq[val] || 0) + 1;
    });

    unchosenFreq = {};
    unchosen.forEach(val => {
      unchosenFreq[val] = (unchosenFreq[val] || 0) + 1;
    });

    // Convert frequencies to chart data
    let chosenData = Object.keys(chosenFreq).map(key => ({
      x: parseFloat(key),
      y: chosenFreq[key]
    }));

    let unchosenData = Object.keys(unchosenFreq).map(key => ({
      x: parseFloat(key),
      y: unchosenFreq[key]
    }));

    // Set the barChartData3 with both datasets
    this.barChartData3 = [
      {
        data: chosenData,
        label: 'Values in Interval',
        backgroundColor: 'green',
        pointBackgroundColor: 'green',
        pointRadius: 7,
        pointHoverBackgroundColor: 'green'
      },
      {
        data: unchosenData,
        label: 'Values not in Interval',
        backgroundColor: 'red',
        pointBackgroundColor: 'red',
        pointRadius: 7,
        pointHoverBackgroundColor: 'red'
      }
    ];
    // If you need to update the chart, do it here
    if (this.chart && this.chart.chart) {
        this.chart.chart.update();
    }

  }

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
