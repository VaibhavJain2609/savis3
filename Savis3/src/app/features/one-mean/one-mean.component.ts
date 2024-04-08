import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService } from 'src/app/Utils/sampling.service';
import { NgForm } from '@angular/forms';
import {ChartType} from 'chart.js';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-one-mean',
  templateUrl: './one-mean.component.html',
  styleUrls: ['./one-mean.component.scss']
})
export class OneMeanComponent implements OnInit, OnDestroy{
  // 1.Data
  dataInput: string = "";
  valuesArray: any = [];
  input: [] = [];
  inputMean: number = 0;
  standardDeviation: number = 0;
  inputSize: number = 0;

  // 2. Hypotheis Population
  hypoValuesArray: any = [];
  originalHypoValuesArray: any = [];
  rangeValue: number = 0;
  meanValue: number = 0;
  prevMean: number = this.meanValue;
  hypoInputMean: number = 0;

  // 3. Draw Sample
  sampleSize: number = 1;
  sampleSizeChange: number = 1;
  sampleMean: number = 0;
  numSamples: number = 1;
  sample: any = [];

  // 4.
  sampleMeans: any = [];
  sampleMeansMean: number = 0;
  sampleMeansStd:number = 0;
  meanSamples: number = 1;
  extremeSample: number = 0;
  distributionSelected: string = "default";
  minVal = 0;
  maxVal = 0;
  chosenVals = 0;
  sampleChosen = 0;
  sampleNotChosen = 0;

  // chart data
  public lineChartLegend = true;
  public lineChartType: ChartType = 'scatter';
  public lineChartData1: any = [];
  public lineChartLabels1: any = [];
  
  public lineChartData2: any = [];
  public lineChartLabels2: any = [];

  public lineChartData3: any = [];
  public lineChartLabels3: any = [];

  public lineChartData4: any = [];
  public lineChartLabels4: any = [];

  public lineChartOptions: any = {
    scales: {
      xAxes: [{
        ticks: { 
          //beginAtZero: true,
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

  public lineChartOptions2: any = {
    scales: {
      xAxes: [{
        ticks: { 
          //beginAtZero: true,
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



  constructor(private translate: TranslateService, private sharedService: SharedService) {}
  
  ngOnInit(): void {
    this.sharedService.currentData.subscribe(data => this.dataInput = data)
  }

  // values are in dataForm-input
  onSubmit(form: NgForm) {
    // get the textarea input
    this.dataInput = form.value.dataFormInput;
    // split the input into an array
    this.valuesArray = this.dataInput.split('\n').filter(value => value.trim() !== '');
    // convert the array into numbers
    this.valuesArray = this.valuesArray.map((value: string) => parseInt(value)).filter((value: number) => !isNaN(value));
    console.log(this.valuesArray);
    // calculate the mean
    this.inputMean = MathService.mean(this.valuesArray);
    this.hypoInputMean = this.inputMean;
    // calculate the standard deviation
    this.standardDeviation = parseFloat(MathService.stddev(this.valuesArray).toFixed(2));
    this.inputSize = this.valuesArray.length;
    this.hypoValuesArray = this.valuesArray;

    // create the chart
    // let service = new StackedDotChartService();
    // let chart = service.initChart(this.valuesArray);
    this.lineChartData1 = [{
      data: this.valuesArray.map((value:number) => ({x: value, y: 1})),
      label: this.translate.instant('original_dataset'),
      pointBackgroundColor: 'orange',
      backgroundColor: 'orange',
    }];
    this.lineChartLabels1 = this.valuesArray.map((index:number) => `Value ${index+1}`);
    this.lineChartData2 = [{
      data: this.valuesArray.map((value:number) => ({x: value, y: 1})),
      label: 'Hypothetical Population',
      pointBackgroundColor: 'orange',
      backgroundColor: 'orange',
    }];
    this.lineChartLabels2 = this.valuesArray.map((index:number) => `Value ${index+1}`);
    this.updateChartOptions();
  }

  updateChartOptions() {
    let minValue = Math.min(...this.valuesArray);
    let maxValue = Math.max(...this.valuesArray);

    this.lineChartOptions = {
      scales: {
        xAxes: [{
          ticks: { 
            //beginAtZero: true,
            fontColor: 'black',
            fontSize: 16,
            padding: 0,
            min: minValue,
            max: maxValue
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
          hoverRadius: 6,
        }
      },
      legend : {
        labels : {
          fontColor: 'black',
        }
      }
    }

    this.lineChartOptions2 = {
      scales: {
        xAxes: [{
          ticks: { 
            //beginAtZero: true,
            fontColor: 'black',
            fontSize: 16,
            padding: 0,
            min: minValue,
            max: maxValue
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
            stepSize: 0.5
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
    this.lineChartData4 = [];
    this.sample = [];
    this.sampleMean = 0;
    this.sampleSize = 1;
    this.sampleMeans = [];
    this.sampleMeansMean = 0;
    this.numSamples = 1;
    this.sampleMeansStd = 0;
    this.meanSamples = 0;
    this.minVal = 0;
    this.maxVal = 0;
    this.chosenVals = 0;
    this.sampleChosen = 0;
    this.sampleNotChosen = 0;
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
      backgroundColor: 'orange',
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
        label: this.translate.instant('opc_Recent'),
        pointBackgroundColor: 'orange',
        backgroundColor: 'orange',
      }];
      this.lineChartLabels3 = sample.map((index:number) => `Value ${index+1}`);
    }
    // get the mean of the sample
    this.sampleMean = parseFloat(MathService.mean(this.sample).toFixed(2));

    // loop # of samples of times, get a sample size length of the original data and get the mean of each sample
    // clear the sampleMeans array when the sample size changes
    if (this.sampleSizeChange != this.sampleSize) {
      this.sampleSizeChange = this.sampleSize;
      this.sampleMeans = [];
    }
    
    for (let i = 0; i < this.numSamples; i++) {
      let sample = this.randomSample(this.hypoValuesArray, this.sampleSize);
      this.sampleMeans.push(parseFloat(MathService.mean(sample).toFixed(2)));
    }
    this.meanSamples = this.sampleMeans.length;
    this.sampleMeansMean = parseFloat(MathService.mean(this.sampleMeans).toFixed(2));
    this.sampleMeansStd = parseFloat(MathService.stddev(this.sampleMeans).toFixed(2));
    this.minVal = Math.floor(Math.min(...this.sampleMeans));
    this.maxVal = Math.floor(Math.max(...this.sampleMeans));
    this.chosenVals = this.sampleMeans.length;
    this.sampleChosen = parseFloat((this.chosenVals / this.sampleMeans.length).toFixed(2));
    this.sampleNotChosen = this.sampleChosen - 1;

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

    this.lineChartData4 = [
      {
        data: pointsArray.map((value:any) => ({x: value.x, y: value.y})),
        label: this.translate.instant('dotPlot_means_in_interval'),
        pointBackgroundColor: 'orange',
        backgroundColor: 'orange',
      },
      {
        data: [],
        label: this.translate.instant('dotPlot_means_not_in_interval'),
        pointBackgroundColor: 'red',
        backgroundColor: 'red',
     }
  ];
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

  extremeSampleFunc() {

    this.chosenVals = this.sampleMeans.length;
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

    let data1 = [];
    let data2 = [];

    for (let i = 0; i < pointsArray.length; i++) {
      if (pointsArray[i].x > this.minVal && pointsArray[i].x < this.maxVal) {
        data1.push(pointsArray[i]);
      } else {
        data2.push(pointsArray[i]);
        this.chosenVals -= 1;
      }
    }

    this.sampleChosen = parseFloat((this.chosenVals / this.sampleMeans.length).toFixed(2));
    this.sampleNotChosen = parseFloat((1 - this.sampleChosen).toFixed(2));

    this.lineChartData4 = [
      {
        data: data1.map((value:any) => ({x: value.x, y: value.y})),
        label: this.translate.instant('dotPlot_means_in_interval'),
        backgroundColor: 'orange',
        pointBackgroundColor: 'orange',
      },
      {
        data: data2.map((value:any) => ({x: value.x, y: value.y})),
        label: this.translate.instant('dotPlot_means_not_in_interval'),
        backgroundColor: 'red',
        pointBackgroundColor: 'red',
      }
    ];
}
  
validateFile(fileInput: any) {
  this.valuesArray = [];
  let file = fileInput.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      // check if the data is vertical or horizontal
      console.log(e.target?.result);
      let vertical = (e.target?.result as string).split('\n').length > 1;
      if (vertical) {
        this.valuesArray = (e.target?.result as string).split('\n')
        .map(value => value.replace(/\r/g, ''))
        .filter(value => value.trim() !== '');
      } else {
        this.valuesArray = (e.target?.result as string).split(',')
        .map(value => value.replace(/\r/g, ''))
        .filter(value => value.trim() !== '');
      }
      // convert the array into numbers
      this.valuesArray = this.valuesArray.map((value: string) => parseInt(value)).filter((value: number) => !isNaN(value));
      // calculate the mean
      this.inputMean = MathService.mean(this.valuesArray);
      this.hypoInputMean = this.inputMean;
      // calculate the standard deviation
      this.standardDeviation = parseFloat(MathService.stddev(this.valuesArray).toFixed(2));
      this.inputSize = this.valuesArray.length;
      this.hypoValuesArray = this.valuesArray;
      // create the chart
      this.lineChartData1 = [{
        data: this.valuesArray.map((value:number) => ({x: value, y: 1})),
        label: this.translate.instant('original_dataset'),
        pointBackgroundColor: 'orange',
      }];
      this.lineChartLabels1 = this.valuesArray.map((index:number) => `Value ${index+1}`);
      this.lineChartData2 = [{
        data: this.valuesArray.map((value:number) => ({x: value, y: 1})),
        label: 'Hypothetical Population',
        pointBackgroundColor: 'orange',
      }];
      this.lineChartLabels2 = this.valuesArray.map((index:number) => `Value ${index+1}`);
      this.updateChartOptions();
    }
    reader.readAsText(file);
  }
}

ngOnDestroy(): void {
  this.sharedService.changeData('')
}

}