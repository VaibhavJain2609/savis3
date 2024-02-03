import { Component, ElementRef } from '@angular/core';
import { StackedDotChartService } from 'src/app/Utils/stacked-dot-chart.service';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService } from 'src/app/Utils/sampling.service';
import { CSVService } from 'src/app/Utils/csv.service';


@Component({
  selector: 'app-one-mean',
  templateUrl: './one-mean.component.html',
  styleUrls: ['./one-mean.component.scss']
})
export class OneMeanComponent {
  shiftMean: number;
  mulFactor: number;
  populationMean: any;
  originalData: any[];
  mostRecentDraw: any[];
  sampleMeans: any[];
  sampleSize: any;
  tailDirection: any;
  scaleValues: any[];
  dataReserv: any[];
  sampleMeansChartLabel: any;
  ele: any;
  datasets: any[];
  translationData: any;
  dataChart1: StackedDotChartService;
  dataChart3: StackedDotChartService;
  dataChart4: StackedDotChartService;
  dataName: { originalData: string; populationData: string; mostRecentDraw: string; sampleMeans: string; };
  loadEventListener: () => void;
  
  
  constructor(OneMeanDiv: ElementRef) {
    this.shiftMean = 0;
    this.mulFactor = 0;
    //this.populationData = [];
    this.populationMean = undefined;
    this.originalData = [];
    this.mostRecentDraw = [];
    this.sampleMeans = [];
    this.sampleSize = undefined;
    // this.translationData = undefined;
    this.tailDirection = null;
    this.scaleValues = [];
    this.dataReserv = [];
    // this.translationData = translation.oneMean;
    this.sampleMeansChartLabel = null;
    this.ele = {
      csvTextArea: OneMeanDiv.nativeElement.querySelector("#csv-input"),
      loadDataBtn: OneMeanDiv.nativeElement.querySelector("#load-data-btn"),
      
      originalDataDisplay: OneMeanDiv.nativeElement.querySelector("#original-data-display"),
      
      recentSampleDisplay: OneMeanDiv.nativeElement.querySelector("#most-recent-sample-display"),
      sampleMeansDisplay: OneMeanDiv.nativeElement.querySelector("#samples-mean-display"),
      sampleMean: OneMeanDiv.nativeElement.querySelector("#sample-mean"),
      samplesMean: OneMeanDiv.nativeElement.querySelector("#samples-mean"),
      originalMean: OneMeanDiv.nativeElement.querySelector("#original-mean"),
      runSimBtn: OneMeanDiv.nativeElement.querySelector("#run-sim-btn"),
      drawSampleStd: OneMeanDiv.nativeElement.querySelector("#drawsample-std"),
      sampleSizeInput: OneMeanDiv.nativeElement.querySelector("#sample-size"),
      noOfSampleInput: OneMeanDiv.nativeElement.querySelector("#no-of-sample"),
    
      minTailValInput: OneMeanDiv.nativeElement.querySelector("#min-tailValue"),
      maxTailValInput: OneMeanDiv.nativeElement.querySelector("#max-tailValue"),
      includeValMin: OneMeanDiv.nativeElement.querySelector("#includeMin"),
      includeValMax: OneMeanDiv.nativeElement.querySelector("#includeMax"),
      chosensampleMeans: OneMeanDiv.nativeElement.querySelector("#chosen-sample-means"),
      unchosensampleMeans: OneMeanDiv.nativeElement.querySelector("#unchosen-sample-means"),

      totalSamplesDisplay: OneMeanDiv.nativeElement.querySelector("#total-samples"),
      oneMeanDiv: OneMeanDiv,
      runSimErrorMsg: OneMeanDiv.nativeElement.querySelector("#run-sim-error-msg"),
      sampleDataDropDown: OneMeanDiv.nativeElement.querySelector("#sample-data"),
      resetBtn: OneMeanDiv.nativeElement.querySelector("#reset-btn"),
      // translationData: OneMeanDiv.nativeElement.querySelector("#translation-data"),
      originalStd: OneMeanDiv.nativeElement.querySelector("#original-std"),
      sampleMeansStd: OneMeanDiv.nativeElement.querySelector("#samplemeans-std"),
      //populationStd: OneMeanDiv.querySelector("#population-std"),
      uploadbtn: OneMeanDiv.nativeElement.querySelector("#upload-btn"),
      fileInput: OneMeanDiv.nativeElement.querySelector("#fileInput"),
      size: OneMeanDiv.nativeElement.querySelector("#originalsize")
    };
    
    

    CSVService.enableUploadDataFile(this.ele.uploadbtn, this.ele.fileInput, this.ele.csvTextArea)

    this.datasets = [
      {
        // label: this.translationData.original,
        label: "original",
        backgroundColor: "orange",
        data: []
      },
      {
        // label: this.translationData.hypotheticalPopulation,
        label: "hypotheticalPopulation",
        backgroundColor: "orange",
        data: []
      },
      {
        // label: this.translationData.mostRecentDraw,
        label: "mostRecentDraw",
        backgroundColor: "blue",
        data: []
      },
      [
        {
          // label: this.translationData.sampleMeans,
          label: "sampleMeans",
          backgroundColor: "green",
          data: []
        },
        { label: "N/A", backgroundColor: "red", data: [] }
      ]
    ];

    this.dataChart1 = new StackedDotChartService();
    this.dataChart1.initChart(OneMeanDiv.nativeElement.querySelector("#original-data-chart"), [this.datasets[0]]);
    
    this.dataChart3 = new StackedDotChartService();
    this.dataChart3.initChart(OneMeanDiv.nativeElement.querySelector("#sample-data-chart"), [this.datasets[2]])
    this.dataChart3.setAnimationDuration(0);

    this.dataChart4 = new StackedDotChartService();
    this.dataChart4.initChart(OneMeanDiv.nativeElement.querySelector("#statistic-data-chart"), [this.datasets[3]])
    this.dataChart4.setAnimationDuration(0);

    this.dataName = {
      originalData: "originalData",
      populationData: "populationData",
      mostRecentDraw: "mostRecentDraw",
      sampleMeans: "sampleMeans"
    };
    [this.dataChart1, /*this.dataChart2,*/ this.dataChart3, this.dataChart4].forEach(
      (plt, idx) => {
        if (plt.getChart()) {
          plt.getChart().options.scales.xAxes[0].scaleLabel.labelString = (idx < 3)
          ? this.translationData.xAxisTitle1
          : this.translationData.xAxisTitle2;
        plt.getChart().options.scales.yAxes[0].scaleLabel.labelString = this.translationData.yAxisTitle;
        }
        
      }
    );
    this.loadEventListener = () => {
      // added this 
      if (this.ele.loadDataBtn) {
        this.ele.loadDataBtn.addEventListener("click", (e: Event) => {
          this.originalData = CSVService.parseCSVtoSingleArray(this.ele.csvTextArea.value);
          this.updateData(this.dataName.originalData);
          this.shiftMean = 0;
          this.mulFactor = 0;
          this.ele.size.innerText = this.originalData.length
          this.clearResult();
          /*this.updatedPopulationData(
            this.originalData,
            this.shiftMean,
            this.mulFactor
          );*/
          e.preventDefault();
      })
    };

      CSVService.dropTextFileOnTextArea(this.ele.csvTextArea);
      this.sampleListListener();
      /*this.shiftMeanListener();
      this.mulFactorListener();*/
      this.resetBtnListener();

      // added this check 
      if (this.ele.runSimBtn) {
        this.ele.runSimBtn.addEventListener("click", (e: Event) => {
          const newSampleSize = Number(this.ele.sampleSizeInput.value);
          const noOfSamples = Number(this.ele.noOfSampleInput.value);
          this.runSim(newSampleSize, noOfSamples);
          e.preventDefault();
        });
      }
      
      // added this check 
      if (this.ele.minTailValInput) {
        this.ele.minTailValInput.addEventListener("input", (e: Event) => {
          if (this.sampleMeans.length) this.updateData(this.dataName.sampleMeans);
        });
      }
      

      // added this check 
      if (this.ele.maxTailValInput) {
        this.ele.maxTailValInput.addEventListener("input", (e: Event) => {
          if (this.sampleMeans.length) this.updateData(this.dataName.sampleMeans);
        });
      }
      

      if (this.ele.oneMeanDiv instanceof HTMLElement) {
        this.ele.oneMeanDiv.addEventListener("click", (e: Event) => {
          if (e.target instanceof HTMLElement) {
            if (e.target.className === "toggle-box") {
              if (e.target.parentElement) {
                const div = e.target.parentElement.nextElementSibling as HTMLElement;
                if (div) {
                  div.style.display = div.style.display === "none" ? "flex" : "none";
                }
                
              }
            }
  
            if (e.target.id == 'includeMin' || e.target.id == 'includeMax') {
              if (this.sampleMeans.length) this.updateData(this.dataName.sampleMeans);
            }
          }
        });  
      } else {
        console.log("oneMeanDiv is not an HTMLElement. Line 218 in one-mean.component.ts");
      }
      
    };
    // this.loadSampleDataList();
    this.loadEventListener();

} 
  // loadSampleDataList() {
  //   const path = [null, "../sampleData/sample1.csv", "../sampleData/sample2.csv"];
  //   [this.translationData.selectData, this.translationData.selectOpt1, this.translationData.selectOpt2].forEach(
  //     (val, idx) => {
  //       const option = document.createElement("option", {});
  //       const optionValue = path[idx]
  //       if (optionValue != null) {
  //         option.setAttribute("value", optionValue);
  //       }
        
  //       option.innerText = val;
  //       this.ele.sampleDataDropDown.appendChild(option);
  //     }
  //   );
  // }
  runSim(sampleSize: number, noOfSamples: number) {
    const newMeanSamples = [];
    try {
      if (!this.originalData.length) throw this.translationData.errorNoPopulation;
      for (let i = 0; i < noOfSamples; i++) {
        const { chosen, unchosen } = SamplingService.randomSubset(
          //this.populationData,
          this.originalData,
          sampleSize
        );
        const roundedMean = MathService.roundToPlaces(
          MathService.mean(chosen.map(x => x.value)),
          3
        );
        newMeanSamples.push(roundedMean);
        if (i === noOfSamples - 1) this.mostRecentDraw = chosen;
      }
      if (this.sampleSize !== sampleSize) {
        this.sampleSize = sampleSize;
        this.sampleMeans = newMeanSamples;
      } else {
        this.sampleMeans = this.sampleMeans.concat(newMeanSamples);
      }
      const minNumber = MathService.minInArray(this.sampleMeans);
      const maxNumber = MathService.maxInArray(this.sampleMeans);
      this.ele.minTailValInput.value = (minNumber % 1 == 0) ? minNumber - 1 : Math.floor(minNumber);
      this.ele.maxTailValInput.value = (maxNumber % 1 == 0) ? maxNumber + 1 : Math.ceil(maxNumber);
    } catch (err) {
      let errMsg = "ERROR\n"
      //if (this.populationData.length)
      if (this.originalData.length)
        errMsg += this.translationData.errorNotEnoughElements;
      else
        errMsg += this.translationData.errorNoPopulation;
      this.ele.runSimErrorMsg.innerText = errMsg;
      setTimeout(() => {
        this.ele.runSimErrorMsg.innerText = "";
      }, 2000);
    }
    this.updateData(this.dataName.mostRecentDraw);
    this.updateData(this.dataName.sampleMeans);
  }
  resetBtnListener() {
    if (this.ele.resetBtn) {
      this.ele.resetBtn.addEventListener("click", (e:Event) => {
        this.clearResult();
        this.ele.csvTextArea.value = "";
        this.originalData = [];
        this.updateData(this.dataName.originalData);
        this.shiftMean = 0;
        this.mulFactor = 0;
        this.ele.size.innerText = 0
        this.clearResult();
        this.ele.sampleDataDropDown.selectedIndex = 0;
        e.preventDefault();
      });
    }
    
  }
  sampleListListener() {
    if (this.ele.sampleDataDropDown) {
      this.ele.sampleDataDropDown.addEventListener("change", () => {
        if (this.ele.sampleDataDropDown.value != this.translationData.selectData) {
          CSVService.readLocalFile(this.ele.sampleDataDropDown.value).then(
            text => (this.ele.csvTextArea.value = text)
          );
        } else this.ele.csvTextArea.value = "";
      });
    }
  }
clearResult() {
    this.mostRecentDraw = [];
    this.sampleMeans = [];
    this.tailDirection = null;
    this.updateData(this.dataName.mostRecentDraw);
    this.updateData(this.dataName.sampleMeans);
  }
updateData(dataName: string) {
  let chart, data, meanEle, textAreaEle;
  if (dataName === this.dataName.originalData) {
    chart = this.dataChart1;
    data = this.originalData;
    meanEle = this.ele.originalMean;
    textAreaEle = this.ele.originalDataDisplay;
    this.ele.originalStd.innerText = MathService.roundToPlaces(MathService.stddev(data.map(x => x.value)), 2);
    this.scaleValues = [MathService.minInArray(data.map(x => x.value)), MathService.maxInArray(data.map(x => x.value))];
  } else if (dataName === this.dataName.mostRecentDraw) {
    chart = this.dataChart3;
    data = this.mostRecentDraw;
    meanEle = this.ele.sampleMean;
    textAreaEle = this.ele.recentSampleDisplay;
    this.ele.drawSampleStd.innerText = MathService.roundToPlaces(MathService.sampleStddev(data.map(x => x.value)), 2);
  } else {
    chart = this.dataChart4;
    data = this.sampleMeans;
    meanEle = this.ele.samplesMean;
    textAreaEle = this.ele.sampleMeansDisplay;
    this.ele.sampleMeansStd.innerText = MathService.roundToPlaces(MathService.stddev(data), 2);
  }
  // update chart
  let valuesArr = null;
  if (data.length) {
    if (dataName !== this.dataName.sampleMeans) {
      valuesArr = data.map(x => x.value);
      chart.setDataFromRaw([valuesArr]);
    } else {
      valuesArr = data;
      //const mean = this.populationMean;*/
      const { chosen, unchosen } = SamplingService.splitByPredicate(
        valuesArr,
        this.predicateForTail(Number(this.ele.minTailValInput.value), Number(this.ele.maxTailValInput.value))
      );
      //update statistic output
      this.updateStatistic(chosen.length, unchosen.length);
      this.updateSampleMeansChartLabels(this.sampleMeansChartLabel);
      chart.setDataFromRaw([chosen, unchosen]);
    }
   
    if (valuesArr.length < 1000) chart.changeDotAppearance(5);
    else chart.changeDotAppearance(3);
    if (dataName === this.dataName.originalData || dataName === this.dataName.sampleMeans) chart.setScale(MathService.minInArray(valuesArr), MathService.maxInArray(valuesArr));
    else chart.setScale(this.scaleValues[0], this.scaleValues[1]);
  } else chart.clear();

  chart.scaleToStackDots();
  // where did this update() come from????
  chart.getChart().update();

  //update mean output
  const mean = data.length
    ? MathService.roundToPlaces(MathService.mean(valuesArr), 2)
    : this.translationData.noData;
  meanEle.innerText = mean;
 
  // update text area output
  if (dataName !== this.dataName.sampleMeans) {
    textAreaEle.value = data.reduce(
      (acc, x) => acc + `${x.id}`.padEnd(8, ' ') + `${x.value}\n`,
      `${this.translationData.id}`.padEnd(8, ' ') + `${this.translationData.value}\n`
    );
  } else {
    textAreaEle.value = data.reduce(
      (acc, x, index) => acc + `${index + 1}`.padEnd(8, ' ') + `${x}\n`,
      `${this.translationData.id}`.padEnd(8, ' ') + `${this.translationData.mean}\n`
    );
  }
  }

  updateStatistic(totalChosen: number, totalUnchosen: number) {
    const totalSamples = totalChosen + totalUnchosen;
    const proportionChosen = MathService.roundToPlaces(totalChosen / totalSamples, 4);
    const proportionUnchosen = MathService.roundToPlaces(totalUnchosen / totalSamples, 4);
    //this.ele.totalSelectedSamplesDisplay.innerText = totalChosen;
    this.ele.totalSamplesDisplay.innerText = totalSamples;
    this.ele.chosensampleMeans.innerText = `${totalChosen} / ${totalSamples} = ${proportionChosen}`;
    this.ele.unchosensampleMeans.innerText = `${totalUnchosen} / ${totalSamples} = ${proportionUnchosen}`;
  }

  predicateForTail(left: number, right: number) {
    if (this.ele.includeValMin.checked && this.ele.includeValMax.checked) {
      this.sampleMeansChartLabel = 'closed';
      return function (x: number) {
        return x >= left && x <= right;
      }
    } else if (this.ele.includeValMin.checked && !this.ele.includeValMax.checked) {
      this.sampleMeansChartLabel = 'left';
      return function (x: number) {
        return x >= left && x < right;
      }
    } else if (!this.ele.includeValMin.checked && this.ele.includeValMax.checked) {
      this.sampleMeansChartLabel = 'right';
      return function (x: number) {
        return x > left && x <= right;
      }
    } else if (!this.ele.includeValMin.checked && !this.ele.includeValMax.checked) {
      this.sampleMeansChartLabel = 'open';
      return function (x: number) {
        return x > left && x < right;
      }
    } else return null;
  }

  updateSampleMeansChartLabels(intervalType: any) {
    const sampleName = this.translationData.sampleMeans;
    if (intervalType === "closed") {
      this.dataChart4.updateLabelName(0,
        Number(this.ele.minTailValInput.value) + ' ≤ ' + sampleName + ' ≤ ' + Number(this.ele.maxTailValInput.value));
      this.dataChart4.updateLabelName(1,
        sampleName + ' < ' + Number(this.ele.minTailValInput.value) + '  ⋃  ' + Number(this.ele.maxTailValInput.value) + ' < ' + sampleName);
    } else if (intervalType === "left") {
      this.dataChart4.updateLabelName(0,
        Number(this.ele.minTailValInput.value) + ' ≤ ' + sampleName + ' < ' + Number(this.ele.maxTailValInput.value));
      this.dataChart4.updateLabelName(1,
        sampleName + ' < ' + Number(this.ele.minTailValInput.value) + '  ⋃  ' + Number(this.ele.maxTailValInput.value) + ' ≤ ' + sampleName);
    } else if (intervalType === "right") {
      this.dataChart4.updateLabelName(0,
        Number(this.ele.minTailValInput.value) + ' < ' + sampleName + ' ≤ ' + Number(this.ele.maxTailValInput.value));
      this.dataChart4.updateLabelName(1,
        sampleName + ' ≤ ' + Number(this.ele.minTailValInput.value) + '  ⋃  ' + Number(this.ele.maxTailValInput.value) + ' < ' + sampleName);
    } else if (intervalType === "open") {
      this.dataChart4.updateLabelName(0,
        Number(this.ele.minTailValInput.value) + ' < ' + sampleName + ' < ' + Number(this.ele.maxTailValInput.value));
      this.dataChart4.updateLabelName(1,
        sampleName + ' ≤ ' + Number(this.ele.minTailValInput.value) + '  ⋃  ' + Number(this.ele.maxTailValInput.value) + ' ≤ ' + sampleName);
    } else {
      this.dataChart4.updateLabelName(0, sampleName);
      this.dataChart4.updateLabelName(1, "N/A");
    }

  }
}