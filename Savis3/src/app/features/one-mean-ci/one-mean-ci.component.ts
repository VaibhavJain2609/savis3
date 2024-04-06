import { Component, ElementRef } from '@angular/core';
import { StackedDotChartService } from 'src/app/Utils/stacked-dot-chart.service';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService } from 'src/app/Utils/sampling.service';
import { CSVService } from 'src/app/Utils/csv.service';
import { NgForm } from '@angular/forms';
import {ChartType} from 'chart.js';
import * as XLS from 'xlsx';
import { chatClass } from 'src/app/Utils/stacked-dot';
import { sample } from 'simple-statistics';
@Component({
  selector: 'app-one-mean-ci',
  templateUrl: './one-mean-ci.component.html',
  styleUrls: ['./one-mean-ci.component.scss']
})
export class OneMeanCIComponent {
  minInterValInput: number = 0
  maxInterValInput: number = 0

  includeValMin: any
  includeValMax: any

  sampleSize: number = 10
  noOfSim: number = 1
  sampleStds: number[] = []
  csvTextArea: string = ''
  disabledInput: boolean = true
  inputDataArray: any[] = []
  lowerBound: any[] = []
  upperBound: any[] = []
  samplemean2: any[] = []
  sampleDataArray: any[] = []
  min:number = 0
  max:number = 1

  sampleMeans: any[] = []

  sampleMeansChartLabel:string = ''

  scaleChart: any[] = []

  inputDataSize: any = NaN
  sampleMeansSize: any = NaN

  inputDataDisplay: any = ''
  sampleDataDisplay: any = ''
  sampleMeansDisplay: any = ''
  sampleMeansCoverageDisplay: any = ''
  inputDataMean: any = NaN
  sampleDataMean: any = NaN
  sampleMeansMean: any = NaN

  inputDataStd: any = NaN
  sampleDataStd: any = NaN
  sampleMeansStd: any = NaN

  sampleMeansChosen: any = NaN
  sampleMeansUnchosen: any = NaN
  confidenceIntervalCount = 0
  confidenceIntervalCountNot = 0
  meanSymbol: string = 'μ'
  stdSymbol: string = 'σ'
  sizeSymbol: string = 'n'

  sampleMeanDisabled: boolean = true

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>

  @ViewChild('sampleChart') sampleDataChartRef: ElementRef<HTMLCanvasElement>

  @ViewChild('sampleMeansChart') sampleMeansChartRef: ElementRef<HTMLCanvasElement>

  @ViewChild('inputForm') inputForm: NgForm
  @ViewChild('confidenceIntervalChart') confidenceIntervalChartRef: ElementRef<HTMLCanvasElement>
  inputDataChart: Chart


  sampleDataChart: Chart

  sampleMeansChart: Chart
  confidenceIntervalChart: Chart
  noOfIntervals: number = 1
  sampleRadio: string = 'population'

  private _showInputForm = true
  private _showSampleForm = true
  private _showMeansForm = true
  private _showConfidenceIntervalForm = true

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.includeValMin = false
    this.includeValMax = false
  }

  ngAfterViewInit() {
    this.createInputChart()
    this.createSampleChart()
    this.createSampleMeansChart()
    this.createConfidenceIntervalChart()
  }
  createConfidenceIntervalChart(): void {
    const ctx = this.confidenceIntervalChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.confidenceIntervalChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('OMCI_DataMean'),
              backgroundColor: 'black',
              data: []
            },
            {
              label: this.translate.instant('OMCI_InInterval'),
              backgroundColor: 'green',
              data: []
            },
            {
              label: this.translate.instant('OMCI_NotInInterval'),
              backgroundColor: 'red',
              data: []
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('OMCI_SAMPLE_NUMBER'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('OMCI_95%_CI'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          }
        }
      })
    }
  }
  createInputChart(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.inputDataChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('dotPlot_input_data'),
              backgroundColor: 'orange',
              data: []
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_data'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_frequencies'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          }
        }
      })
    }

  }

  createSampleChart(): void {
    const ctx = this.sampleDataChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.sampleDataChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('dotPlot_last_drawn'),
              backgroundColor: 'blue',
              data: []
            },
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_data'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_frequencies'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          }
        }
      })
    }

  }

  createSampleMeansChart(): void {
    const ctx = this.sampleMeansChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.sampleMeansChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('dotPlot_means_in_interval'),
              backgroundColor: 'green',
              data: []
            },
            {
              label: this.translate.instant('dotPlot_means_not_in_interval'),
              backgroundColor: 'red',
              data: []
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  max: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_sample_means'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  stepSize: 1
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_frequencies'),
                  fontStyle: 'bold',
                  fontColor: 'black'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          }
        }
      })
    }

  }

  loadDataButton() {
    this.inputDataArray = this.parseCSVtoSingleArray(this.csvTextArea)
    
    if(this.inputDataArray.length) {
      this.updateData(0)
      this.inputDataSize = this.inputDataArray.length
    }

    this.disabledInput = false
  }

  runSimulationButton() {
    this.updateSampleData(this.sampleSize, this.noOfSim)
    this.sampleMeanDisabled = false
  }

  sampleMeanChange() {
    if(this.sampleMeans.length) {
      this.updateData(2)
    }
  }

  radioChange(str: string) {
    this.sampleRadio = str
    if (this.inputDataArray.length) {
      this.updateData(0)
    }

    if (str === 'population') {
      this.meanSymbol = 'μ'
      this.stdSymbol = 'σ'
      this.sizeSymbol = 'N'
      if (this.inputDataArray.length) {
        this.disabledInput = false
      }
    }

    if (str === 'sample') {
      this.meanSymbol = 'x̄'
      this.stdSymbol = 's'
      this.sizeSymbol = 'n'
      this.sampleMeanDisabled = true
      this.disabledInput = true
    }
  }

  populationRadioChange() {
    if(this.inputDataArray.length) {
      this.updateData(0)
    }

  }

  resetSampleMeansChart() {
    this.sampleMeans = []
    this.sampleMeansChartLabel = ''
    this.updateData(2)
  }

  resetSampleChart() {
    this.sampleDataArray = []
    this.updateData(1)
  }

  totalReset() {
    this.inputDataArray = []
    this.sampleDataArray = []
    this.sampleMeans = []
    this.sampleMeansChartLabel = ''
    this.minInterValInput = 0
    this.maxInterValInput = 0
    this.noOfSim = 1
    this.sampleSize = 10
    this.inputDataSize = 0
    this.inputDataDisplay = ''
    this.sampleDataDisplay = ''
    this.sampleMeansDisplay = ''
    this.inputDataMean = NaN
    this.sampleDataMean = NaN
    this.sampleMeansMean = NaN
    this.inputDataStd = NaN
    this.sampleDataStd = NaN
    this.sampleMeansStd = NaN
    this.sampleMeansChosen = NaN
    this.sampleMeansUnchosen = NaN
    this.radioChange('population')
    this.disabledInput = true
    this.sampleMeanDisabled = true
    this.sampleMeansSize = NaN
    
    this.clearChart(this.inputDataChart)
    this.clearChart(this.sampleDataChart)
    this.clearChart(this.sampleMeansChart)
    this.resetSampleMeansChart()
    this.resetSampleChart()
  }

  updateInfoSampleMeans(totalChosen: number, totalUnchosen: number) {
    const proportionChosen = this.roundToPlaces(totalChosen / this.sampleMeans.length, 4)
    const proportionUnchosen = this.roundToPlaces(totalUnchosen / this.sampleMeans.length, 4)

    this.sampleMeansChosen = `${totalChosen} / ${this.sampleMeans.length} = ${proportionChosen}`
    this.sampleMeansUnchosen = `${totalUnchosen} / ${this.sampleMeans.length} = ${proportionUnchosen}`

  }

  updateSampleData(sz:any, num: any) {
    try {
      if (!this.sampleSize) throw new Error('Sample size is required')

      let roundedMean
      let newMeanSamples = []
      let newStdDeviations = [];

      for(let it = 0; it < num; it++){
        const { chosen, unchosen } = this.randomSubset(this.inputDataArray, sz)
        roundedMean = this.roundToPlaces(this.mean(chosen.map(x => x.value)), 4)
        newMeanSamples.push(roundedMean)
        const stdDeviation = this.roundToPlaces(MathService.sampleStddev(chosen.map(x => x.value)), 3);
        newStdDeviations.push(stdDeviation);

        if(it === num - 1) {
          this.sampleDataArray = chosen
        }
      }

      if(this.sampleSize !== sz) {
        this.sampleSize = sz
        this.sampleMeans = newMeanSamples
        this.sampleStds = newStdDeviations; 
      } else {
        this.sampleMeans = this.sampleMeans.concat(newMeanSamples)
        this.sampleStds = this.sampleStds.concat(newStdDeviations); 
      }

      this.updateData(1)

      const minNumber = this.minInArray(this.sampleMeans)
      const maxNumber = this.maxInArray(this.sampleMeans)
      this.minInterValInput = (minNumber%1===0)?minNumber-1:Math.floor(minNumber)
      this.maxInterValInput = (maxNumber%1===0)?maxNumber+1:Math.ceil(maxNumber)


      this.updateData(2)
    } catch (error) {
      let errMsg = 'ERRROR\n'
      alert(error)
      
    }
  }

  predicateForSets(left: any, right: any) {
    if(this.includeValMin.checked && this.includeValMax.checked) {
      return function(x: any) {
        return x >= left && x <= right
      }
    } else if (this.includeValMin.checked && !this.includeValMax.checked) {
      return function(x: any) {
        return x >= left && x < right
      }
    } else if (!this.includeValMin.checked && this.includeValMax.checked) {
      return function(x: any) {
        return x > left && x <= right
      }
    } else {
      return function(x: any) {
        return x > left && x < right
      }
    }
  }

  updateData(num: number) {
    let dataChart, dataArray, dataDisplay, dataMean, dataStd, valuesArr;
  
    if (num === 0) {
      dataChart = this.inputDataChart;
      dataArray = this.inputDataArray;
      dataDisplay = this.inputDataDisplay;
    } else if (num === 1) {
      dataChart = this.sampleDataChart;
      dataArray = this.sampleDataArray;
      dataDisplay = this.sampleDataDisplay;
    } else if (num === 2) {
      dataChart = this.sampleMeansChart;
      dataArray = this.sampleMeans;
      dataDisplay = this.sampleMeansDisplay;
    } else {
      dataChart = this.confidenceIntervalChart;
      dataArray = this.sampleMeans;
      dataDisplay = this.sampleMeansCoverageDisplay;
    }
  
    if (dataArray.length) {
      if (num !== 2) {
        valuesArr = dataArray.map(x => x.value);
        dataChart = this.setDataFromRaw(dataChart, [valuesArr]);
        dataDisplay = dataArray.reduce(
          (acc, x) => acc + `${x.id}`.padEnd(8, ' ') + `${x.value}\n`,
          `ID`.padEnd(8, ' ') + `${this.translate.instant('dotPlot_values')}\n`
        );
        if (num === 0) {
          this.scaleChart = [this.minInArray(valuesArr), this.maxInArray(valuesArr)];
        }
      } else {
        valuesArr = dataArray;
        const { chosen, unchosen } = this.splitByPredicate(
          valuesArr,
          this.predicateForSets(this.minInterValInput, this.maxInterValInput)
        );
        dataChart.options.animation.duration = 0;
        this.updateInfoSampleMeans(chosen.length, unchosen.length);
        dataChart = this.setDataFromRaw(dataChart, [chosen, unchosen]);
        dataDisplay = dataArray.reduce(
          (acc, x, idx) =>
            acc +
            `${idx + 1}`.padEnd(8, ' ') +
            `${x} σ: ${this.sampleStds[idx]}`.padEnd(25, ' ') +
            `${this.translate.instant('dotPlot_mean')} ${this.stdSymbol}\n`,
          `ID`.padEnd(8, ' ') +
            `${this.translate.instant('dotPlot_values')} ${this.stdSymbol}\n`
        );
      }
  
      if (num < 2) {
        dataChart = this.setScale(dataChart, this.scaleChart[0], this.scaleChart[1]);
      } else {
        dataChart = this.setScale(dataChart, this.minInArray(valuesArr), this.maxInArray(valuesArr));
      }
  
      if (valuesArr.length < 1000) {
        dataChart = this.changeDotAppearance(dataChart, 5);
      } else {
        dataChart = this.changeDotAppearance(dataChart, 3);
      }
  
      dataChart = this.scaleToStackDots(dataChart);
    } else {
      this.clearChart(dataChart);
    }
  
    dataChart.update();
    dataMean = dataArray.length ? this.roundToPlaces(this.mean(valuesArr), 2) : 'No data';
  
    if (this.sampleRadio === 'population' && num === 0) {
      dataStd = dataArray.length ? this.roundToPlaces(this.stddev(dataArray.map(x => x.value)), 2) : 'No data';
    } else if (num === 2) {
      dataStd = dataArray.length ? this.roundToPlaces(this.sampleStddev(dataArray), 2) : 'No data';
    } else {
      dataStd = dataArray.length ? this.roundToPlaces(this.sampleStddev(dataArray.map(x => x.value)), 2) : 'No data';
    }
  
    if (num === 0) {
      this.inputDataDisplay = dataDisplay;
      this.inputDataMean = dataMean;
      this.inputDataStd = dataStd;
    } else if (num === 1) {
      this.sampleDataDisplay = dataDisplay;
      this.sampleDataMean = dataMean;
      this.sampleDataStd = dataStd;
    } else if (num === 2) {
      this.sampleMeansDisplay = dataDisplay;
      this.sampleMeansMean = dataMean;
      this.sampleMeansSize = valuesArr.length;
      this.sampleMeansStd = dataStd;
    } else {
      this.sampleMeansCoverageDisplay = dataDisplay;

    }
  }

  

  sampleSelect(e: any) {
    this.csv = null
    let link = ""
    if (e.target.value == "sample1") {
      link = "../../../assets/samp1.csv"
    } else {
      link = "../../../assets/samp2.csv"

    }
    fetch(link).then(data => data.text())
      .then((data) => {
        this.csvraw = data
        this.csv = this.parseData(data.trim());
        this.dataInput = this.csvraw;

      })
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
          this.dataInput = this.csvraw;
        }
      }
    }

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
    this.csv = null
    this.csvraw = null
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
  filterData(){

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
    this.sampleMean = parseFloat(MathService.mean(this.sampleMeans).toFixed(2));
    this.sampleStd = parseFloat(MathService.sampleStddev(this.sampleMeans).toFixed(2));

    // loop # of samples of times, get a sample size length of the original data and get the mean of each sample
    // clear the sampleMeans array when the sample size changes
    if (this.sampleSizeChange != this.sampleSize) {
      this.sampleSizeChange = this.sampleSize;
      this.sampleMeans = [];
      this.sampleStds = [];
    }
    
    for (let i = 0; i < this.numSamples; i++) {
      let sample = this.randomSample(this.hypoValuesArray, this.sampleSize);
      this.sampleMeans.push(parseFloat(MathService.mean(sample).toFixed(2)));
      this.sampleStds.push(parseFloat(MathService.sampleStddev(sample).toFixed(2)));
    } 
    
    console.log(this.sampleStds)

    this.meanSamples = this.sampleMeans.length;
    this.sampleMeansMean = parseFloat(MathService.mean(this.sampleMeans).toFixed(2));
    this.sampleMeansStd = parseFloat(MathService.sampleStddev(this.sampleMeans).toFixed(2));

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
    this.extremeSampleFunc();
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
  
  set showSampleForm(value: boolean) {
    this._showSampleForm = value;
    if (value) {
      setTimeout(() => this.initializeSampleChart(), 0)
    }
  }
  
  get showMeansForm(): boolean {
    return this._showMeansForm;
  }
  
  set showMeansForm(value: boolean) {
    this._showMeansForm = value;
    if (value) {
      setTimeout(() => this.initializeMeansChart(), 0)
    }
  }
  
  initializeInputChart() {
    if (this.inputDataChart) {
      this.inputDataChart.destroy();
    }
    this.createInputChart();
  }
  initializeConfidenceIntervalChart() {
    if (this.confidenceIntervalChart) {
      this.confidenceIntervalChart.destroy();
    }
    this.createConfidenceIntervalChart();
  }
  
  initializeSampleChart() {
    if (this.sampleDataChart) {
      this.sampleDataChart.destroy();
    }
    this.createSampleChart();
  }
  
  initializeMeansChart() {
    if (this.sampleMeansChart) {
      this.sampleMeansChart.destroy();
    }
    this.createSampleMeansChart();
  }
  confidenceInterval() {
    let chosenMeans: number[] = [];
    let processedStd: number[] = [];
    let idxArr: number[] = []; // This array is not used in the provided code
    this.samplemean2 = [];
    this.upperBound = [];
    this.lowerBound = [];
    const noOfCoverage: number = Number(this.noOfIntervals);
    if(noOfCoverage < 1 || noOfCoverage > this.sampleMeans.length) {
      alert('Number of coverage intervals must be between 1 and the number of sample means')
      return
    }
    for (let it = 0; it < noOfCoverage; it++) {
      chosenMeans.push(this.sampleMeans[it]);
      processedStd.push(2 * this.sampleStds[it]/ Math.sqrt(this.sampleSize));
    }
    console.log(processedStd)
  let it: number;
let sampleMean: number;
let procStd: number;
let lower: number;
let upper: number;
let minNum: number;
let maxNum: number;
let assignedDataset: any[];
let tmp: number;

let inInterval: number[] = [];
let notInInterval: number[] = [];
let lowers: number[] = [];
let uppers: number[] = [];

let wMean: number = 0;
  const centMean = Number(this.inputDataMean);
  console.log(centMean + "CENTMEAN")
  for (it = 0; it < chosenMeans.length; it++) {
    sampleMean = chosenMeans[it];
    procStd = processedStd[it];
    lower = sampleMean - procStd;
    upper = sampleMean + procStd;
    if (lower < minNum || !minNum) minNum = lower;
    if (upper > maxNum || !maxNum) maxNum = upper;

    if (lower <= centMean && centMean <= upper) wMean += 1; // wMean should increment if the centMean is within the the upper and lower bound of the sample
    console.log(wMean + "WMEAN");
    if ((it < noOfCoverage) && (it < 100)){
      assignedDataset = (lower <= centMean && centMean <= upper) ? inInterval : notInInterval

      assignedDataset.push(
        { x: it + 1, y: MathService.roundToPlaces(lower, 2) },
        { x: it + 1, y: sampleMean },
        { x: it + 1, y: MathService.roundToPlaces(upper, 2) },
        { x: undefined, y: undefined }
      )
    }
    
    lowers.push(MathService.roundToPlaces(lower, 2))
    uppers.push(MathService.roundToPlaces(upper, 2))
}
it++
    tmp = inInterval.pop()
    tmp = notInInterval.pop()
    this.confidenceIntervalChart.options.scales.xAxes[0].ticks.max = (it < 100) ? it : 100
    this.confidenceIntervalChart.options.scales.yAxes[0].ticks.max = Math.ceil(maxNum)
    this.confidenceIntervalChart.options.scales.yAxes[0].ticks.min = Math.floor(maxNum)
    this.confidenceIntervalChart.data.datasets[0].data = inInterval
    this.confidenceIntervalChart.data.datasets[1].data = notInInterval
    this.confidenceIntervalChart.data.datasets[2].data = [{x: 0, y: centMean}, {x: (it < 100) ? it : 100, y: centMean}]
    this.confidenceIntervalChart.data.datasets[2].label = '${this.meanSymbol} = ${centMean}'
    this.confidenceIntervalChart.update()
    this.confidenceIntervalCount = wMean
    this.confidenceIntervalCountNot = noOfCoverage - wMean
    this.samplemean2 = chosenMeans
    this.upperBound = uppers
    this.lowerBound = lowers


}
}