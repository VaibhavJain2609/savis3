import { AfterViewInit, Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartDataSets, ChartOptions, Chart, ChartXAxe  } from 'chart.js';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import { oneProportionDynamicBubbleSize, oneProportionOffset, oneProportionSampleLegendColor } from '../../Utils/chartjs-plugin';
import { max } from 'simple-statistics';

@Component({
  selector: 'app-one-proportion',
  templateUrl: './one-proportion.component.html',
  styleUrls: ['./one-proportion.component.scss']
})
export class OneProportionComponent implements AfterViewInit, OnChanges{
  // User input properties
  noOfCoin: number = 5
  probability: number = 0.5
  labels: string[] = []
  binomialData: number[] = []
  samples: number[] = []
  selected: number[] = []
  mean: number = NaN
  std: number = NaN
  noOfSelected: number = 0
  totalSamples: number = 0
  lowerSelectedRange: number = 0
  upperSelectedRange: number = 0
  thisSampleSizes: number = 1
  zoomIn: boolean = false
  interval: number = 0

  proportion: string = '0/0 = NaN'

  // Chart colors
  colors = {
    sample: "rgba(255, 0, 0, 0.7)",
      binomial: "rgba(0, 0, 255, 0.6)",
      selected: "rgba(0, 255, 0, 0.6)",
      line: "rgba(0, 255, 0, 0.6)",
      box: "rgba(0, 255, 0, 0.1)",
      invisible: "rgba(0, 255, 0, 0.0)"
  }

  chart: Chart
  @ViewChild('chartCanvas') chartCanvas: ElementRef<HTMLCanvasElement>

  dataFromCalculation = {
    theoryMean: 0,
    noOfSelected: 0,
  }

  constructor(
    private translate: TranslateService,
    ) {

      Chart.pluginService.register({
        id: "offsetBar",
        afterUpdate: function(chart) {
          // We get the dataset and set the offset here
          const dataset = chart.config.data.datasets[2]
          // const width = dataset._meta[0].data[1]._model.x - dataset._meta[0].data[0]._model.x;
          let offset;
          const meta: any = Object.values((dataset as any)._meta)[0]
          if (meta.data.length > 0) {
            offset = -(meta.data[1]._model.x - meta.data[0]._model.x) / 2
          }
      
          // For every data in the dataset ...
          for (var i = 0; i < meta.data.length; i++) {
            // We get the model linked to this data
            var model = meta.data[i]._model
            // And add the offset to the `x` property
            model.x += offset;
      
            // .. and also to these two properties
            // to make the bezier curve fits the new graph
            model.controlPointNextX += offset
            model.controlPointPreviousX += offset
          }
        }
      })
      
      Chart.pluginService.register({
        id: "fixedSamplelegendColor",
        afterUpdate: function(chart) {
          (chart as any).legend.legendItems[0].fillStyle = "rgba(255,0,0,0.8)"
        }
      })
      
      Chart.pluginService.register({
        id: "dynamicBubbleSize",
        beforeUpdate: function(chart) {
          if ((chart as any).mean) {
            const chartData = chart.config.data; // sample dataset
            const dynamicSize = 50 / chartData.labels.length
            const minSize = 2
            chartData.datasets[1].radius =
              dynamicSize > minSize ? dynamicSize : minSize
          }
        }
      })

  }

  ngAfterViewInit(): void {
      this.createChart()
  }

  createChart(): void {
    const context = this.chartCanvas.nativeElement.getContext('2d')
    if(context){
      this.chart = new Chart(context, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: this.translate.instant('op_bar_sample'),
              data: [],
              borderWidth: 1,
              // id: 'x-axis-1',
              backgroundColor: this.colors.sample,
              hidden: false,
            },
            {
              type: 'line',
              label: this.translate.instant('op_bar_binomial'),
              data: [],
              borderWidth: 1,
              // id: 'x-axis-2',
              borderColor: this.colors.binomial,
              backgroundColor: this.colors.binomial,
              pointRadius: 3,
              pointHoverRadius: 15,
              pointHoverBackgroundColor: this.colors.binomial,
              fill: false,
              hidden: false,
              showLine: false,
            },
            {
              type: 'line',
              label: this.translate.instant('op_bar_selected'),
              data: [],
              borderWidth: 0.1,
              // id: 'x-axis-3',
              backgroundColor: this.colors.selected,
              hidden: false,
              fill: 'end',
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  autoSkip: true,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('op_bar_num_samples'),
                  // fontColor: 'black',
                  // fontSize: 14
                }
              }
            ],
            xAxes: [
              {
                // barPercentage: 1.0,
                scaleLabel: {
                  display: true,
                  labelString: `${this.translate.instant('op_bar_heads')} ` + this.upperSelectedRange + ` ${this.translate.instant('op_bar_heads2')}`,
                  // fontColor: 'black',
                  // fontSize: 14
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: true,
          tooltips: {
            mode: 'index',
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            callbacks: {
              title: function(tooltipItem, data) {
                if (tooltipItem[0]) {
                  let title = tooltipItem[0].xLabel || ''
                  title += ` heads`;
                  return title.toString(); // Explicitly convert to string
                }
                return '' // Return an empty string if tooltipItem[0] is undefined
              },
              label: (tooltipItem, data) => {
                if (tooltipItem && tooltipItem.datasetIndex !== undefined) {
                  if (tooltipItem.datasetIndex !== 2) {
                    return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${tooltipItem.yLabel}`;
                  } else {
                    return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${
                      this.interval
                    }`
                  }
                }
                return '' // Return an empty string if tooltipItem or tooltipItem.datasetIndex is undefined
              }
            }
          }
        }  
      })
    }

    (this.chart as any).mean = this.mean

    this.chart.canvas.ondblclick = (event) => {
      if(!this.zoomIn && this.noOfCoin >= 50) {
        this.zoomIn = true
        this.updateChart()
      } else {
        this.zoomIn = false
        this.updateChart()
      }
    }
  }

  // Reset the form and chart data
  reset() {
    this.noOfCoin = 5
    this.probability = 0.5
    this.labels = []
    this.binomialData = []
    this.samples = []
    this.selected = []
    this.mean = NaN
    this.std = NaN
    this.noOfSelected = 0
    this.totalSamples = 0
    this.thisSampleSizes = 1
    this.lowerSelectedRange = 0
    this.upperSelectedRange = 0
    this.zoomIn = false
    this.interval = 0
    this.proportion = '0/0 = NaN'

    this.resetChart()
  }

  resetChart(): void {
    if(this.chart) {
      this.chart.destroy()
    }
    this.createChart()
  }
  
  sampleDraw() {
    this.totalSamples += this.thisSampleSizes

    const newSamples = this.drawSamples()
    this.binomialData = this.calculateBionomial()
    this.selected = this.generateSelectedArray()

    if(this.samples.length === 0) {
      this.samples = Array(this.noOfCoin + 1).fill(0)
    }
    this.samples = this.addSamples(this.samples, newSamples)

    if (this.chart && this.chart.data && this.chart.data.datasets && this.chart.data.datasets[0] && this.chart.data.datasets[1] && this.chart.data.datasets[2]) {
      this.chart.data.datasets[0].data = this.samples
      this.chart.data.datasets[1].data = this.binomialData
      this.chart.data.datasets[2].data = this.selected
    }

    this.mean = this.calculateMean()
    this.std = this.calculateStd() || 0

    this.generateLabels()
    this.chart.data.labels = this.labels

    this.interval = this.calculateSamplesSelected()
    this.proportion = `${this.interval}/${this.totalSamples} = ${(this.interval / this.totalSamples).toFixed(3)}`

    this.chart.update()
  }

  generateLabels(): void {
    this.labels = Array(this.noOfCoin + 1)
    for (let i = 0; i < this.noOfCoin + 1; i++) {
      this.labels[i] = i.toString()
    }

    this.chart.data.labels = this.labels
    this.chart.update()
  }

  recalculateSamples():void {
    this.samples = []
    this.generateLabels()

    const reSamples = this.drawSamplesWithSameSize()
    
    if(this.samples.length === 0) {
      this.samples = Array(this.noOfCoin + 1).fill(0)
    }
    this.samples = this.addSamples(this.samples, reSamples)

    this.mean = this.calculateMean()
    this.std = this.calculateStd() || 0
    this.interval = this.calculateSamplesSelected()
    this.proportion = `${this.interval}/${this.totalSamples} = ${(this.interval / this.totalSamples).toFixed(3)}`

    this.chart.data.datasets[0].data = this.samples
    this.chart.update()
  }

  updateSelected(): void {
    this.binomialData = this.calculateBionomial()
    this.generateLabels()
    this.chart.data.datasets[1].data = this.binomialData
    this.chart.data.datasets[2].data = this.generateSelectedArray()
    
    this.interval = this.calculateSamplesSelected()
    this.proportion = `${this.interval}/${this.totalSamples} = ${(this.interval / this.totalSamples).toFixed(3)}`

    this.chart.update();
  }

  generateSelectedArray(): Array<number> {
    const lower = this.lowerSelectedRange >= 0 ? this.lowerSelectedRange : 0
    const upper = this.upperSelectedRange <= this.noOfCoin + 2 ? this.upperSelectedRange : this.noOfCoin + 2

    const select = Array(this.noOfCoin + 2).fill(NaN)

    return select.map((x, i) => {
      if(i >= lower && i <= upper + 1) {
        return 0
      }
      return x
    })
  }

  calculateBionomial(): Array<number> {
    const coeff = Array(this.noOfCoin + 1).fill(0)
    coeff[0] = 1

    const binomialBase = Array(this.noOfCoin + 1)

    binomialBase[0] = Math.pow(1 - this.probability, this.noOfCoin)
    for(let i = 1; i < this.noOfCoin + 1; i++) {
      coeff[i] = (coeff[i - 1] * (this.noOfCoin + 1 - i)) / i

      binomialBase[i] = coeff[i] * Math.pow(1 - this.probability, this.noOfCoin - i) * Math.pow(this.probability, i)
    }
    return binomialBase.map(x => x * this.totalSamples)
  }

  drawSamples() : Array<Array<number>> {
    const drawResults = Array(this.thisSampleSizes)

    for(let i = 0; i < this.thisSampleSizes; i++) {
      const singleDraw = Array(this.noOfCoin).fill(NaN)
      drawResults[i] = singleDraw.map(x => {
        return Math.random() < this.probability ? 1 : 0
      })
    }

    return drawResults
  }

  drawSamplesWithSameSize() : Array<Array<number>> {
    const drawResults = Array(this.totalSamples)

    for(let i = 0; i < this.totalSamples; i++) {
      const singleDraw = Array(this.noOfCoin).fill(NaN)
      drawResults[i] = singleDraw.map(x => {
        return Math.random() < this.probability ? 1 : 0
      })
    }

    return drawResults
  }

  calculateMean(): number {
    return (
      this.samples.reduce((acc: number, x: number, i: number) => acc + x * i, 0) / this.samples.reduce((acc: any, x: any) => acc+ x, 0)
    )
  }

  calculateStd(): number {
    const mean = this.calculateMean()

    return Math.sqrt(
      this.samples.reduce((acc: number, x: number, i: number) => acc + (i - mean) * (i - mean) * x, 0) /
      (this.samples.reduce((acc: any, x: any) => acc + x, 0) - 1)
    )
  }

  calculateSamplesSelected(): number {
    const lower = this.lowerSelectedRange >= 0 ? this.lowerSelectedRange : 0
    const upper = this.upperSelectedRange <= this.samples.length ? this.upperSelectedRange : this.samples.length

    return this.samples.reduce((acc, x, i) => {
      if(i >= lower && i <= upper) {
        return acc + x
      }
      return acc
    }, 0)
  }

  addSamples(originalSamples: any[], drawResults: any[]) {
    const summary = drawResults.reduce((acc, eachDraw) => {
      const noOfHead = eachDraw.reduce((accHeads: any, head: any) => accHeads + head, 0)
      const headsCount = acc[noOfHead] + 1 || 1
      return { ...acc, [noOfHead]: headsCount }
    }, {})

    return originalSamples.map((x, i) => x + (summary[i] || 0))
  }

  updateChart() {
    if(!this.zoomIn) {
      this.chart.data.labels = this.labels
      if (this.chart && this.chart.data && this.chart.data.datasets && this.chart.data.datasets[0] && this.chart.data.datasets[1] && this.chart.data.datasets[2]){
        this.chart.data.datasets[0].data = this.samples
        this.chart.data.datasets[1].data = this.binomialData
        this.chart.data.datasets[2].data = this.selected
      }
    } else {
      const roundedMean = Math.floor(this.probability * this.noOfCoin)
      const HALF_WIDTH = 25
      let lowerRange, upperRange

      if (roundedMean - HALF_WIDTH <= 0) {
        lowerRange = 0
        upperRange = lowerRange + HALF_WIDTH * 2
      } else if (roundedMean + HALF_WIDTH >= this.noOfCoin) {
        upperRange = this.noOfCoin + 1
        lowerRange = upperRange - HALF_WIDTH * 2
      } else {
        lowerRange = roundedMean - HALF_WIDTH
        upperRange = roundedMean + HALF_WIDTH
      }

      upperRange = lowerRange + HALF_WIDTH * 2

      this.chart.data.labels = this.labels.slice(lowerRange, upperRange)
      this.chart.data.datasets[0].data = this.samples.slice(lowerRange, upperRange)
      this.chart.data.datasets[1].data = this.binomialData.slice(lowerRange, upperRange)
      this.chart.data.datasets[2].data = this.selected.slice(lowerRange, upperRange)
    }

    const maxSamples = Math.max(...this.samples)

    if (maxSamples < 10) {
      this.chart.options.scales.yAxes[0].ticks.max = 10
    } else {
      if(maxSamples <= 100) {
        this.chart.options.scales.yAxes[0].ticks.max = maxSamples + ( 10 - (maxSamples % 10) )
      } else {
        this.chart.options.scales.yAxes[0].ticks.max = maxSamples + ( 100 - (maxSamples % 100) )
      }
    }

    // this.dataFromCalculation.theoryMean = this.mean
    // this.dataFromCalculation.noOfSelected = this.noOfSelected;
    
    (this.chart as CustomChart).mean = this.mean

    if (this.chart && this.chart.options && this.chart.options.scales && this.chart.options.scales.xAxes && this.chart.options.scales.xAxes[0] && this.chart.options.scales.xAxes[0].scaleLabel) {
      this.chart.options.scales.xAxes[0].scaleLabel.labelString = `${this.translate.instant('op_bar_heads')} ` + this.upperSelectedRange + ` ${this.translate.instant('op_bar_heads2')}`;
    }

    this.chart.update()

  }

  ngOnChanges() {
    this.updateChart()
  }

}

interface CustomChart extends Chart {
  mean: number
}