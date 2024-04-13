import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart }  from 'chart.js';
import {MathService} from 'src/app/Utils/math.service'
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { chatClass } from 'src/app/Utils/stacked-dot';
import { Sampling } from 'src/app/Utils/sampling';

@Component({
  selector: 'app-two-proportions',
  templateUrl: './two-proportions.component.html',
  styleUrls: ['./two-proportions.component.scss']
})
export class TwoProportionsComponent implements OnInit, AfterViewInit {

  // Your existing variables
  numASuccess: number = 0;
  numAFailure: number = 0;
  numBSuccess: number = 0;
  numBFailure: number = 0;
  sampleProportionA: number = 0;
  sampleProportionB: number = 0;
  sampleProportionDiff: number = 0;
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

  numofSem: number = 1;
  activateSim: boolean = true; // Modify this based on your logic
  mean_diff: number;
  sections = {
    sectionTwo: true,
    sectionThree: true
  };
  lastSummary: any

  @ViewChild('chart1') chart1Ref: ElementRef<HTMLCanvasElement>
  @ViewChild('chart2') chart2Ref: ElementRef<HTMLCanvasElement>
  @ViewChild('chart3') chart3Ref: ElementRef<HTMLCanvasElement>
  
  chart1: Chart
  chart2: Chart
  chart3: Chart

  sampleProportionA_chart2: string = 'NaN';
  sampleProportionB_chart2: string = 'NaN';
  sampleProportionDiff_chart2: string = 'NaN';
  sampleMeanDiff_chart3: String = '';
  

  numberOfSimulations: number;

  
  toggleSection(e: any, sec: string) {
    
  }
  dataTextArea: string = '';
  data: any
  updateData(data: any) {
    
    }

  public barChartData1: ChartDataSets[] = [
    {
      label: '% success',
      backgroundColor: 'green',
      data: [0, 0], // Data points for success and failure for Group A
    },
    {
      label: '% failures',
      backgroundColor: 'red', // Colors for success and failure bars for Group B
      data: [0, 0], // Data points for success and failure for Group B
    },
  ];
  public barChartData2: ChartDataSets[] = [
    {
      label: '% success',
      backgroundColor: 'green',
      data: [0, 0], // Data points for success and failure for Group A
    },
    {
      label: '% failures',
      backgroundColor: 'red', // Colors for success and failure bars for Group B
      data: [0, 0], // Data points for success and failure for Group B
    },
  ];
  
  public barChartData3: ChartDataSets[] = [

        { label: 'Differences', backgroundColor: "green", data: [] },
        { label: "N/A", backgroundColor: "red", data: [] }
  ];
  
  constructor(private cdr: ChangeDetectorRef, private sampling: Sampling) { }

  shuffleArray() {
    // Create an array
    const array = [1, 2, 3, 4, 5];

    // Shuffle the array using the sampling service
    const shuffledArray = this.sampling.shuffle(array);

    console.log(shuffledArray); // Shuffled array
  }



  ngOnInit(): void {
    this.numASuccess = 0;
    this.numAFailure = 0;
    this.numBSuccess = 0;
    this.numBFailure = 0;

    this.numofSem = 1 
  }

  ngAfterViewInit(): void {
    this.CreateChart1()
    this.CreateChart2()
    this.CreateChart3()
  }

  CreateChart1(): void {
    const ctx = this.chart1Ref.nativeElement.getContext('2d');
    
    if (ctx) {
        this.chart1 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Group A', 'Group B'],
                datasets: this.barChartData1,
            },
            options: {
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            max: 100,
                        },
                    }],
                    yAxes: [{
                        id: 'groupAAxis',
                        stacked: true,
                        ticks: {
                            max: 100,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: ''
                        }
                    }]
                },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Corrected background color
                    callbacks: {
                        title: function(tooltipItem, data) {
                            let title = tooltipItem[0].xLabel || '';
                            return title.toString();
                        },
                        label: (tooltipItem, data) => {
                            return tooltipItem.yLabel + data.datasets[tooltipItem.datasetIndex].label;
                        }
                    }
                }
            }
        });
    }
}

CreateChart2(): void {
  const ctx = this.chart2Ref.nativeElement.getContext('2d');
  
  if (ctx) {
      this.chart2 = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ['Group A', 'Group B'],
              datasets: this.barChartData2, // TODO: replace with a new dataset
          },
          options: {
              scales: {
                  xAxes: [{
                      stacked: true,
                      ticks: {
                          max: 100,
                      },
                  }],
                  yAxes: [{
                      id: 'groupAAxis',
                      stacked: true,
                      ticks: {
                          max: 100,
                      },
                      scaleLabel: {
                          display: true,
                          labelString: ''
                      }
                  }]
              },
              responsive: true,
              maintainAspectRatio: false,
              tooltips: {
                  mode: 'index',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Corrected background color
                  callbacks: {
                      title: function(tooltipItem, data) {
                          let title = tooltipItem[0].xLabel || '';
                          return title.toString();
                      },
                      label: (tooltipItem, data) => {
                          return tooltipItem.yLabel + data.datasets[tooltipItem.datasetIndex].label;
                      }
                  }
              }
          }
      });
  }
}

CreateChart3(): void {
  const ctx = this.chart3Ref.nativeElement.getContext('2d');
  
  if (ctx) {
      this.chart3 = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: this.barChartData3
        },
        options: {
          scales: {
            xAxes: [{ 
              ticks: { 
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
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 1,
                  max: 2,
                  stepSize: 1
                      },
                      scaleLabel: {
                          display: true,
                          labelString: ''
                      }
                  }]
              },
              responsive: true,
              maintainAspectRatio: false,
              tooltips: {
                  mode: 'index',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', // Corrected background color
                  callbacks: {
                      title: function(tooltipItem, data) {
                          let title = tooltipItem[0].xLabel || '';
                          return title.toString();
                      },
                      label: (tooltipItem, data) => {
                          return tooltipItem.yLabel + data.datasets[tooltipItem.datasetIndex].label;
                      }
                  }
              }
          }
      });
  }
}

loadData(): void {
  let numAS = this.numASuccess * 1;
  let numAF = this.numAFailure * 1; // Corrected variable name
  let numBS = this.numBSuccess * 1; // Corrected variable name
  let numBF = this.numBFailure * 1;
  
  if (numAS <= 0 || numAF <= 0 || numBS <= 0 || numBF <= 0) {
    alert('Inputs need to be at least one');
  } else {
      // Calculate proportions
      this.sampleProportionA = this.roundToPlaces(numAS / (numAS + numAF), 2);
      this.sampleProportionB = this.roundToPlaces(numBS / (numBS + numBF), 2);
      this.sampleProportionDiff = this.roundToPlaces(this.sampleProportionA - this.sampleProportionB, 2);
     
      // Update chart 1
      this.setProportions(this.chart1, {
          numASuccess: numAS,
          numAFailure: numAF,
          numBSuccess: numBS,
          numBFailure: numBF
      });
      this.chart1.update();
      
      this.setProportions(this.chart2, {
          numASuccess: 0,
          numAFailure: 0,
          numBSuccess: 0,
          numBFailure: 0
      });
       this.chart2.update();
  }
}


  // loadData() {
  //   let numASuccess = this.dom.aSuccess.value * 1;
  //   let numAFailure = this.dom.aFailure.value * 1;
  //   let numBSuccess = this.dom.bSuccess.value * 1;
  //   let numBFailure = this.dom.bFailure.value * 1;
  //   if (numASuccess <= 0 || numAFailure <= 0 || numBSuccess <= 0 || numBFailure <= 0) {
  //     alert(translation.twoProportions.alertAtLeastOne);
  //   }
  //   else {
  //     let summary = {
  //       numASuccess, numAFailure, numBSuccess, numBFailure,
  //       proportionA: numASuccess / (numASuccess + numAFailure), // todo(matthewmerrill): fixed decimals
  //       proportionB: numBSuccess / (numBSuccess + numBFailure),
  //     }
  //     summary.proportionDiff = summary.proportionA - summary.proportionB;
  //     Summaries.updateSummaryElements(this.summaryElements, summary);
  //     this.data = { numASuccess, numAFailure, numBSuccess, numBFailure };
  //     this.charts.inputChart.setProportions(this.data);
  //     this.charts.inputChart.update();
  //     this.charts.lastSimChart.setProportions({
  //       numASuccess: 0, numAFailure: 0, numBSuccess: 0, numBFailure: 0,
  //     });
  //     this.charts.lastSimChart.update();
  //     this.charts.tailChart.reset();
  //     this.charts.tailChart.updateChart();
  //     /*for (let elem of this.dom.needData) {
  //       elem.removeAttribute('disabled');
  //     }
  //     for (let elem of this.dom.needResults) {
  //       elem.setAttribute('disabled', true);  
  //     }*/
  //     this.disabledSimulationSection(false);
  //     //this.dom.tailInputElement.value = roundToPlaces(summary.proportionDiff, 4);
  //     //this.dom.tailInputElement.dispatchEvent(new Event('change'));
  //     this.charts.tailChart.updateChart();
  //   }
  // }


  runSim() {
    console.log('run sim started')
    let numSimulations = this.numofSem * 1;
    // let {numASuccess, numAFailure, numBSuccess, numBFailure} = this.data;
    let totalSuccess = this.numASuccess + this.numBSuccess;
    let totalFailure = this.numAFailure + this.numBFailure;
    let totalGroupA = this.numASuccess + this.numAFailure;
    let totalGroupB = this.numBSuccess + this.numBFailure;
    let allItems, shuffled, sampleA, sampleASuccess, sampleAFailure, sampleAProportion = [];
    let sampleB, sampleBSuccess, sampleBFailure, sampleBProportion = [];
    for (let simIdx = 0; simIdx < numSimulations; simIdx++) {
      console.log('inside forloop of run sim')
      allItems = new Array(totalGroupA + totalGroupB);
      allItems.fill(0);
      allItems.fill(1, 0, totalSuccess);
      shuffled = this.sampling.shuffle(allItems);
      sampleA = shuffled.slice(0, totalGroupA);
      sampleB = shuffled.slice(totalGroupA);
      sampleASuccess = MathService.countWhere(sampleA, (x: number) => x == 1);
      sampleBSuccess = MathService.countWhere(sampleB, (x: number) => x == 1);
      sampleAFailure = totalGroupA - sampleASuccess;
      sampleBFailure = totalGroupB - sampleBSuccess;
      this.sampleProportionA_chart2 = (String)(sampleASuccess / totalGroupA);
      this.sampleProportionB_chart2 = (String)(sampleBSuccess / totalGroupB);
      this.sampleProportionDiff_chart2=  (String) ((sampleASuccess - sampleBSuccess) / (totalGroupA + totalGroupB));
      if (simIdx + 1 === numSimulations) {
        this.setProportions(this.chart2, {
          numASuccess: sampleASuccess,
          numBSuccess: sampleBSuccess,
          numAFailure: totalGroupA - sampleASuccess,
          numBFailure: totalGroupB - sampleBSuccess,
          
        });
        
        console.log(this.chart2.data.datasets)
        
      }
      allItems = [];
    }
    this.chart2.update();
    
    }
  

  
  
  



  
  calculateProportion(data: number[]) {
    
  }
  
  ngAfterContentInit(){
    
    }
   
    
  
  

  updateChart(data: string): void {
  
    }

    
  updateSummaryChart(data: string): void {
    
  }

 
  sampleSelect(e: any) {
  }

  

 

  // addSimulationSample(sample: any[]) {
  
  // }
  // onFileSelected(e: any) {
    
  // }

  // onDrop(event: DragEvent): void {
    
  // }
  selectedTest(event: any) {
    
  }
  
  setProportions(chart:Chart, { numASuccess, numAFailure, numBSuccess, numBFailure } : { numASuccess: any; numAFailure: any; numBSuccess: any; numBFailure: any }): void{
    let totalInA = numASuccess + numAFailure
    let totalInB = numBSuccess + numBFailure
    let totalSuccess = numASuccess + numBSuccess
    let totalFailure = numAFailure + numBFailure

    chart.data.datasets[0].data[0] = this.roundToPlaces(100 * numASuccess/ totalInA, 2)
    chart.data.datasets[0].data[1] = this.roundToPlaces(100 * numBSuccess / totalInB, 2)
    chart.data.datasets[1].data[0] = this.roundToPlaces(100 * numAFailure / totalInA, 2)
    chart.data.datasets[1].data[1] = this.roundToPlaces(100 * numBFailure / totalInB, 2)
  }

  roundToPlaces(values: any, places: any) {
    let pow10 = Math.pow(10, places)
    return Math.round(values * pow10) / pow10 
  }


}
