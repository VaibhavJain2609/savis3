import { Inject, ElementRef, Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class StackedDotChartService {
  private domElement: any;
  private datasets: any[] = [];
  private chart: any;
  private options: any;
  private bucketWidth: number = 0;

  constructor() { 
  }

  initChart(domElement: any, datasets: any[], options: any = {}){
    this.domElement = domElement;
    this.datasets = [];
    for (let dataset of datasets) {
      this.datasets.push(
      Object.assign({}, dataset, {
        pointRadius: 8
      })
    );
  }
    
    

    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontStyle = 'bold';
    Chart.defaults.global.defaultFontColor = "black";
    if (this.domElement) {
      this.chart = new Chart(this.domElement.nativeElement, {
        type: "scatter",
        data: {
          datasets: this.datasets
        },
        options: {
          scales: {
            xAxes: [{ 
              ticks: { 
                //beginAtZero: true,
                fontColor: 'black',
                fontSize: 16,
                padding: 0,
                min: 0,
                max: 1 
              },
              scaleLabel: {
                display: true,
                labelString: "",
                //fontColor: "black",
                //fontSize: "14"
              }
            }],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  /*min: 1, // Original
                  max:2,*/
                  min: 0, // Rafael Diaz
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: "",
                  //fontColor: "black",
                  //fontSize: "14"
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0,0,0,1.0)',
            bodyFontStyle:'normal',
          }
        }
      });
    }
    
    options = options || {};
    this.options = {
      autoBuckets: options.autoBuckets !== undefined ? options.autoBuckets : true,
      bucketWidth: options.bucketWidth,
    };
  }

  // New constructor for the stacked dot chart
  // initChart(domElement: any, datasets: any[], options: any = {}) {
  //   this.domElement = domElement;
  //   this.datasets = [];
  //   for (let dataset of datasets) {
  //     this.datasets.push(
  //       Object.assign({}, dataset, {
  //         pointRadius: 8
  //       })
  //     );
  //   }

  //   Chart.defaults.global.defaultFontSize = 16;
  //   Chart.defaults.global.defaultFontStyle = 'bold';
  //   Chart.defaults.global.defaultFontColor = "black";
  //   this.chart = new Chart(domElement, {
  //     type: "scatter",
  //     data: {
  //       datasets: this.datasets
  //     },
  //     options: {
  //       scales: {
  //         xAxes: [{ 
  //           ticks: { 
  //             //beginAtZero: true,
  //             fontColor: 'black',
  //             fontSize: 16,
  //             padding: 0,
  //             min: 0,
  //             max: 1 
  //           },
  //           scaleLabel: {
  //             display: true,
  //             labelString: "",
  //             //fontColor: "black",
  //             //fontSize: "14"
  //           }
  //         }],
  //         yAxes: [
  //           {
  //             ticks: {
  //               fontColor: 'black',
  //               fontSize: 16,
  //               padding: 0,
  //               /*min: 1, // Original
  //               max:2,*/
  //               min: 0, // Rafael Diaz
  //               stepSize: 1
  //             },
  //             scaleLabel: {
  //               display: true,
  //               labelString: "",
  //               //fontColor: "black",
  //               //fontSize: "14"
  //             }
  //           }
  //         ]
  //       },
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       tooltips: {
  //         backgroundColor: 'rgba(0,0,0,1.0)',
  //         bodyFontStyle:'normal',
  //       }
  //     }
  //   });
  //   options = options || {};
  //   this.options = {
  //     autoBuckets: options.autoBuckets !== undefined ? options.autoBuckets : true,
  //     bucketWidth: options.bucketWidth,
  //   };
  // }

  // round(x: number, bucketSize: number): number {
  //   if (bucketSize == undefined) {
  //     if (this.options.autoBuckets) {
  //       let scale = this.chart.scales['x-axis-1'];
  //       let inScaleWidth = scale.options.ticks.max - scale.options.ticks.min;
  //       let chartWidth = this.chart.width;
  //       let pointRadius = this.chart.data.datasets[0].pointRadius;
  //       bucketSize = Math.round(2 * pointRadius * (inScaleWidth / chartWidth) * 10000) / 10000;
  //     }
  //     else if (this.options.bucketWidth) {
  //       bucketSize = this.bucketWidth;
  //     }
  //   }
  //   if (bucketSize) {
  //     let r = Math.floor(x / bucketSize) * bucketSize;
  //     return r;
  //   }
  //   else {
  //     return x;
  //   }
  // }

  rawToScatter(arrs: any[]): any[] {
    let faceted = [];
    let counts: { [key: string]: number } = {};
    for (let arr of arrs) {
      let scatter = [];
      for (let item of arr) {
        let y = (counts[item] = (counts[item] || 0) + 1);
        scatter.push({ x: item, y: y/*, n:*/ });
      }
      faceted.push(scatter);
    }
    return faceted;
  }

  clear() {
    for (let dataset of this.chart.data.datasets) {
      dataset.data = [];
    }
    this.chart.options.scales.xAxes[0].ticks.min = 0;
    this.chart.options.scales.xAxes[0].ticks.max = 1;
  }

  setDataFromRaw(rawDataArrays: any[]): void {
    let scatterArrays = this.rawToScatter(rawDataArrays);
    for (let idx = 0; idx < rawDataArrays.length; idx++) {
      this.chart.data.datasets[idx].data = scatterArrays[idx];
    }
    let max = 1;
    for (let dataset of scatterArrays) {
      for (let item of dataset) {
        max = Math.max(max, item.y);
      }
    }
  }

  setScale(start: number, end: number): void {
    this.chart.options.scales.xAxes[0].ticks.min = (Math.floor(start))? Math.floor(start) : 0;
    this.chart.options.scales.xAxes[0].ticks.max = Math.ceil(end) + 1;
  }

  setAxisLabels(xLabel: string, yLabel: string){
    this.chart.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
    this.chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
  }

  /**
   * Attempts to scale y dimension to make the dots stack directly on top of
   * each other. If there is not enough space in the chart to do so, the y will
   * scale to contain all the dots, squishing them to clip into each other.
   * When there are many dots, this makes the stack look like a vertical bar.
   */
  scaleToStackDots() {
    // TODO(matthewmerrill): memoize getMax with a dirty flag
    let max = 1;
    for (let dataset of this.chart.data.datasets) {
      for (let item of dataset.data) {
        max = Math.max(max, item.y);
      }
    }
    
    this.chart.options.scales.yAxes[0].ticks.stepSize = (max>10)? Math.ceil(max * 0.2) : 1;
    if (max>1000)  this.chart.options.scales.yAxes[0].ticks.min = 0
  }

  updateLabelName(datasetIndex: number, labelName:string) {
    this.datasets[datasetIndex].label = labelName;
  }

  changeDotAppearance(pointRadius: number) {
    this.chart.data.datasets.forEach((x: any) => {
      x.pointRadius = pointRadius;
    });
  }

  setAnimationDuration(duration: number) {
    if (this.chart) {
      this.chart.options.animation.duration = duration;
    }
  }

  public getChart(): any {
    return this.chart;
  }
}