import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor() { }

  generateLabels(noOfCoin: number): number[] {
    const labels = new Array(noOfCoin + 1);
    for (let i = 0; i <= noOfCoin; i++) {
      labels[i] = i;
    }
    return labels;
  }

  calculateBinomial(noOfCoin: number, probability: number, totalSamples: number): number[] {
    const coeff = new Array(noOfCoin + 1).fill(0);
    coeff[0] = 1;
    const binomialBase = new Array(noOfCoin + 1);

    binomialBase[0] = Math.pow(1 - probability, noOfCoin);

    for (let i = 1; i <= noOfCoin; i++) {
      coeff[i] = (coeff[i - 1] * (noOfCoin + 1 - i)) / i;
      binomialBase[i] = coeff[i] * Math.pow(1 - probability, noOfCoin - i) * Math.pow(probability, i);
    }

    return binomialBase.map(x => x * totalSamples);
  }

  drawSamples(probability: number, noOfCoin: number, noOfDraw: number): number[][] {
    const drawResults = new Array(noOfDraw);

    for (let i = 0; i < noOfDraw; i++) {
      drawResults[i] = new Array(noOfCoin).fill(NaN).map(() => Math.random() < probability ? 1 : 0);
    }

    return drawResults;
  }

  calculateMean(sampleData: number[]): number {
    const total = sampleData.reduce((acc, x) => acc + x, 0);
    return sampleData.reduce((acc, x, i) => acc + x * i, 0) / total;
  }

  calculateStd(sampleData: number[]): number {
    const mean = this.calculateMean(sampleData);
    const variance = sampleData.reduce((acc, x, i) => acc + (i - mean) ** 2 * x, 0) / (sampleData.reduce((acc, x) => acc + x, 0) - 1);
    return Math.sqrt(variance);
  }

  calculateSamplesSelected(lower: number, upper: number, samples: number[]): number {
    lower = Math.max(lower, 0);
    upper = Math.min(upper, samples.length);

    return samples.reduce((acc, x, i) => {
      if (i >= lower && i <= upper) {
        return acc + x;
      }
      return acc;
    }, 0);
  }

  generateSelectedArray(lower: number, upper: number, noOfCoin: number): (number | typeof NaN)[] {
    lower = Math.max(lower, 0);
    upper = Math.min(upper, noOfCoin + 2);
    const selected = new Array(noOfCoin + 2).fill(NaN);

    return selected.map((_, i) => {
      if (i >= lower && i <= upper + 1) {
        return 0;
      }
      return NaN;
    });
  }

  addSamples(originalSamples: number[], drawResults: number[][]): number[] {
    const summary: { [key: number]:number } = drawResults.reduce((acc: { [key:number]: number }, eachDraw) => {
      const noOfHead = eachDraw.reduce((accHeads, head) => accHeads + head, 0);
      acc[noOfHead] = (acc[noOfHead] || 0) + 1;
      return acc;
    }, {});

    return originalSamples.map((x, i) => x + (summary[i] || 0));
  }

  calculateSelectedProportion(selected: number, total: number): number {
    return selected / total;
  }
}
