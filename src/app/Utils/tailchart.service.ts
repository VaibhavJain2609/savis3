import { Injectable } from '@angular/core';
import { StackedDotChartService } from './stacked-dot-chart.service';
import { MathService } from './math.service';
import { SummaryService } from './summaries.service';
import { SamplingService } from './sampling.service';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class TailchartService {

  tailDirection: string | null = null;
  minTailVal = 0;
  maxTailVal = 1;
  whatAreWeRecording?: string;
  dom: any;
  chart: any;
  summaryElements: any = {};
  results: any[] = [];
  tailInput?: number;

  constructor(
    private MathUtil: MathService,
    private Summaries: SummaryService,
    private Sampling: SamplingService,
    private translation: TranslateService,
    private stackedDotChart: StackedDotChartService,
  ) { }

  initialize(config: any): void {
    let {
      chartElement,
      whatAreWeRecording,
      summaryElements = {},
    } = config;

    // FIXME: Not sure what translation is used for here
    // this.whatAreWeRecording = whatAreWeRecording || translation.twoMean.Samples;
    this.dom = { chartElement };
    this.chart = this.stackedDotChart.initChart(
      chartElement,
      [
        { label: this.whatAreWeRecording, backgroundColor: "green", data: [] },
        { label: "N/A", backgroundColor: "red", data: [] }
      ]
    );
    this.summaryElements = summaryElements;
    this.updateChartLabels();
  }

  reset() {
    this.tailDirection = null;
    this.tailInput = 0;
    this.dropResults();
  }

  addResult(result: any, skipCallback: any) {
    this.results.push(this.MathUtil.roundToPlaces(result,4));
    this.updateSummary();
  }

  addAllResults(results: any) {
    for (let result of results) {
      this.results.push(this.MathUtil.roundToPlaces(result,4));
    }
    this.updateSummary();
  }

  dropResults() {
    this.results = [];
  }

  updateSummary() {
    const { chosen, unchosen } = this.Sampling.splitByPredicate(
      this.results,
      this.predicateForTail(Number(this.minTailVal), (this.maxTailVal))
    );

    // FIXME: need to figure out what this.summary is
    // this.summary = {
    //   total: this.results.length,
    //   mean: this.MathUtil.roundToPlaces(this.MathUtil.mean(this.results), 4),
    //   stddev: this.MathUtil.roundToPlaces(this.MathUtil.stddev(this.results), 4),
    //   chosen: chosen.length,
    //   unchosen: unchosen.length,
    // };
    // this.summary.proportion = this.MathUtil.roundToPlaces(this.summary.chosen / this.summary.total, 4),
    // Summaries.updateSummaryElements(this.summaryElements, this.summary);
    this.updateChart();
  }

  setTailDirection(/*tailDirection*/includeMin: any, includeMax: any) {
    //this.tailDirection = tailDirection;
    if (includeMin && includeMax){
      this.tailDirection = 'closed';
    } else if (includeMin && !includeMax){
      this.tailDirection = 'left';
    } else if (!includeMin && includeMax){
      this.tailDirection = 'right';
    } else if (!includeMin && !includeMax){
      this.tailDirection = 'open';
    } else {
      return null;
    }
    this.updateSummary();
    return this.tailDirection;
  }

  setTailInput(/*tailInput*/min: any, max: any) {
    //this.tailInput = tailInput;
    if (!min && min!== 0) min = this.MathUtil.minInArray(this.results);
    if (!max && max!== 0) max = this.MathUtil.maxInArray(this.results);
    this.minTailVal = this.MathUtil.roundToPlaces(min, 4);
    this.maxTailVal = this.MathUtil.roundToPlaces(max, 4);
    this.updateSummary();
  }

  updateChartLabels(/*mean*/) {
    let word = this.whatAreWeRecording;
    //let roundedInput = MathUtil.roundToPlaces(this.tailInput, 4);
    if (this.tailDirection === "closed") {
      this.chart.updateLabelName(0,
        this.minTailVal+' ≤ '+word+' ≤ '+this.maxTailVal);
      this.chart.updateLabelName(1,
        word+' < '+this.minTailVal+'  ⋃  '+this.maxTailVal+' < '+word);
    } else if (this.tailDirection === "left") {
      this.chart.updateLabelName(0,
        this.minTailVal+' ≤ '+word+' < '+this.maxTailVal);
      this.chart.updateLabelName(1,
        word+' < '+this.minTailVal+'  ⋃  '+this.maxTailVal+' ≤ '+word);
    } else if (this.tailDirection === "right") {
      this.chart.updateLabelName(0,
        this.minTailVal+' < '+word+' ≤ '+this.maxTailVal);
      this.chart.updateLabelName(1,
        word+' ≤ '+this.minTailVal+'  ⋃  '+this.maxTailVal+' < '+word);
    } else if (this.tailDirection === "open"){
      this.chart.updateLabelName(0,
        this.minTailVal+' < '+word+' < '+this.maxTailVal);
      this.chart.updateLabelName(1,
        word+' ≤ '+this.minTailVal+'  ⋃  '+this.maxTailVal+' ≤ '+word);
    } else {
      this.chart.updateLabelName(0, word);
      this.chart.updateLabelName(1, "N/A");
    }
  }
    /*
    if (this.tailDirection == null || this.tailDirection == 'null') {
      this.chart.updateLabelName(0, word);
      this.chart.updateLabelName(1, "N/A");
    } else if (this.tailDirection === "oneTailRight") {
      this.chart.updateLabelName(0, `${word} < ${roundedInput}`);
      this.chart.updateLabelName(1, `${word} >= ${roundedInput}`);
    } else if (this.tailDirection === "oneTailLeft") {
      this.chart.updateLabelName(0, `${word} > ${roundedInput}`);
      this.chart.updateLabelName(1, `${word} <= ${roundedInput}`);
    } else {
      const distance = MathUtil.roundToPlaces(Math.abs(mean - this.tailInput), 2);
      const left = MathUtil.roundToPlaces(mean - distance, 4);
      const right = MathUtil.roundToPlaces(mean + distance, 4);
      if (mean === 0) {
        this.chart.updateLabelName(0, `|${word}| < ${Math.abs(right)}`);
        this.chart.updateLabelName(1, `|${word}| >= ${Math.abs(right)}`);
      }
      else {
        this.chart.updateLabelName(0, `${left} < ${word} < ${right}`);
        this.chart.updateLabelName(1, `${word} <= ${left} or ${word} >= ${right}`);
      }*/


  predicateForTail(left: any, right: any) {
    if (this.tailDirection == 'closed'){
      return function(x: any) {
        return x >= Number(left) && x <= Number(right);
      }
    } else if (this.tailDirection == 'left'){
      return function(x: any) {
        return x >= Number(left) && x < Number(right);
      }
    } else if (this.tailDirection == 'right'){
      return function(x: any) {
        return x > Number(left) && x <= Number(right);
      }
    } else if (this.tailDirection == 'open'){
      return function(x: any) {
        return x > Number(left) && x < Number(right);
      }
    } else return null;
  }
  
  
  
  /*(mean) {
    let tailInput = this.tailInput;
    if (this.tailDirection == null || this.tailDirection == 'null') {
      return null;
    } else if (this.tailDirection === "oneTailRight") {
      return x => x >= tailInput;
    } else if (this.tailDirection === "oneTailLeft") {
      return x => x <= tailInput;
    } else {
      const distance = MathUtil.roundToPlaces(Math.abs(mean - this.tailInput), 2);
      return x => x <= mean - distance || x >= mean + distance;
    }
  }*/

  updateChart() {
    //const mean = MathUtil.roundToPlaces(MathUtil.mean(this.results), 2);
    const { chosen, unchosen } = this.Sampling.splitByPredicate(
      this.results,
      this.predicateForTail(Number(this.minTailVal),Number(this.maxTailVal))
    );
    // todo(matthewmerrill): if used for onemean, this isn't 0
    this.updateChartLabels(/*0*/);
    /*this.chart.setScale(Math.min.apply(undefined, this.results),
      Math.max.apply(undefined, this.results)
    );*/
    this.chart.setScale(this.MathUtil.minInArray(this.results), this.MathUtil.maxInArray(this.results));
    this.chart.setDataFromRaw([chosen, unchosen]);
    this.chart.scaleToStackDots();
    // update(0) disables animations. This prevents dots moving around confusingly.
    this.chart.chart.update(0);
    //this.chart.setpointRadius = 2;
  }
}