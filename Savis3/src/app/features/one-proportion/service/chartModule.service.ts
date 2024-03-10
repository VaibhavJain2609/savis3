import { Injectable } from '@angular/core';
import Chart, { ChartDataSets, ChartXAxe } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private chart: Chart | null = null;
  private color = {
    sample: "rgba(255,0,0,0.7)",
    binomial: "rgba(0,0,255,0.6)",
    selected: "rgba(0,255,0,0.6)",
    line: "rgba(0,255,0,0.6)",
    box: "rgba(0,255,0,0.1)",
    invisible: "rgba(0,255,0,0.0)"
  };
  private dataFromCalculation = {
    theoryMean: 0,
    noOfSelected: 0
  };

  constructor() {
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontStyle = 'bold';
    Chart.defaults.global.defaultFontColor = "black";
    this.registerPlugins();
  }

  initializeChart(canvasEle: HTMLCanvasElement, translation: any): void {
    var ctx = canvasEle.getContext("2d");
    if(ctx){
        this.chart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: [],
              datasets: [
                {
                  label: translation.Samples,
                  data: [],
                  borderWidth: 1,
                  id: "x-axis-1",
                  backgroundColor: this.color.sample,
                  hidden: false
                } as ChartDataSets,
                {
                  type: "line",
                  label: translation.binomial,
                  data: [],
                  borderWidth: 1,
                  id: "x-axis-2",
                  borderColor: this.color.binomial,
                  backgroundColor: this.color.binomial,
                  pointRadius: 3,
                  fill: false,
                  hidden: false
                } as ChartDataSets,
                {
                  type: "line",
                  label: translation.selected,
                  data: [],
                  borderWidth: 0.1,
                  id: "x-axis-3",
                  backgroundColor: this.color.selected,
                  hidden: false,
                  fill: "end"
                } as ChartDataSets
              ]
            },
            options: {
              scales: {
                yAxes: [
                  {
                    ticks: {
                      max: 10,
                      beginAtZero: true
                    },
                    scaleLabel: {
                      display: true,
                      labelString: translation.noOfSamples
                    }
                  }
                ],
                xAxes: [
                  {
                    barPercentage: 1.0,
                    scaleLabel: {
                      display: true,
                      labelString: translation.noOfHeads
                    }
                  } as ChartXAxe
                ]
              },
              responsive: true,
              maintainAspectRatio: true,
              tooltips: {
                mode: "index",
                backgroundColor: "rgba(0,0,0,1.0)",
                callbacks: {
                  title: function(tooltipItem: { xLabel: string; }[], data: any) {
                    let title = tooltipItem[0].xLabel || "";
                    title += ` ${translation.heads}`;
                    return title;
                  },
                  label: (tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData) => {
                    if(!data.datasets || tooltipItem.datasetIndex === undefined){
                        return ""
                    }
                    
                    if (tooltipItem.datasetIndex !== 2) {
                      return `${data.datasets[tooltipItem.datasetIndex].label} : ${
                        tooltipItem.yLabel
                      }`;
                    } else {
                      return `${data.datasets[tooltipItem.datasetIndex].label} : ${
                        this.dataFromCalculation.noOfSelected
                      }`;
                    }
                  }
                }
              }
            }
          });
    }else {
        console.error('Unable to get 2D context from canvas')
    }
  }

  updateChartData(dataSet: any): void {
    if (!this.chart) {
      console.error('Chart not initialized');
      return;
    }

    const {
        labels,
        samples,
        binomail,
        selected,
        probability,
        noOfCoin,
        noOfSelected,
        mean,
        zoomIn
    } = dataSet;


    if(!zoomIn && this.chart.data.datasets) {
        this.chart.data.labels = labels
        this.chart.data.datasets[0].data = samples
        this.chart.data.datasets[1].data = binomail
        this.chart.data.datasets[2].data = selected
    } else {
        const roundedMean = Math.floor(probability * noOfCoin)
        const HALF_WIDTH = 24
        let lowerRange, upperRange
        if(roundedMean - HALF_WIDTH <= 0) {
            lowerRange = 0
            upperRange = lowerRange + HALF_WIDTH * 2
        } else if (roundedMean + HALF_WIDTH >= noOfCoin) {
            upperRange = noOfCoin + 1
            lowerRange = upperRange - HALF_WIDTH * 2
        } else {
            lowerRange = roundedMean - HALF_WIDTH
            upperRange = roundedMean + HALF_WIDTH
        }
        upperRange = lowerRange + HALF_WIDTH * 2
        this.chart.data.labels = labels.slice(lowerRange, upperRange)
        if(this.chart.data.datasets) {
            this.chart.data.datasets[0].data = samples.slice(lowerRange, upperRange)
            this.chart.data.datasets[1].data = binomail.slice(lowerRange, upperRange)
            this.chart.data.datasets[2].data = selected.slice(lowerRange, upperRange)
        }
    }

    const maxSamples = Math.max(...samples)
    // Ensure the chart and its necessary properties are defined
    if (this.chart && this.chart.options && this.chart.options.scales && this.chart.options.scales.yAxes && this.chart.options.scales.yAxes[0]) {
        const yAxis = this.chart.options.scales.yAxes[0];
    // Ensure the ticks object exists on the yAxis
        if (!yAxis.ticks) {
            yAxis.ticks = {};
        }

        if (maxSamples < 10) {
            yAxis.ticks.max = 10;
        } else {
            yAxis.ticks.max = maxSamples <= 100 
                          ? maxSamples + (10 - (maxSamples % 10)) 
                          : maxSamples + (100 - (maxSamples % 100));
        }
    }

    this.dataFromCalculation.theoryMean = mean
    this.dataFromCalculation.noOfSelected = noOfSelected
    (this.chart).mean = mean
    // this.chart.options.scales.xAxes[0].scaleLabel.labelString = `${
    //     this.translationData.noOfHeads
    // } ${noOfCoin} ${this.translationData.tosses2}`

    this.chart.update()
  }

  private registerPlugins(): void {
    Chart.pluginService.register({
      id: "offsetBar",
      afterUpdate: function(chart: any) {
        // ... plugin implementation for 'offsetBar' ...
      }
    });

    Chart.pluginService.register({
      id: "fixedSamplelegendColor",
      afterUpdate: function(chart: any) {
        // ... plugin implementation for 'fixedSamplelegendColor' ...
      }
    });

    Chart.pluginService.register({
      id: "dynamicBubbleSize",
      beforeUpdate: function(chart: any) {
        // ... plugin implementation for 'dynamicBubbleSize' ...
      }
    });

    // ... register any other plugins as needed ...
  }

  // ... any additional methods or logic for the service ...
}
