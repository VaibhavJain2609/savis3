// import translation from "{{base}}../util/translate.js";
// import {roundToPlaces} from "{{base}}../util/math.js";

// export default class OnePropChart {
  
//   constructor(canvas) {
//     this.dom = {canvas};
//     if (!canvas) {
//       throw new Error('canvas is undefined!');
//     }
//     // TODO(matthewmerrill): better tooltips
//     // TODO(matthewmerrill): make the red/green more intuitive with how data is entered
//     //  Note: This might require ChartJS v3.0.0 https://github.com/mendix/ChartJS/issues/31
//     this.chart = new Chart(canvas, {
//       type: 'bar',
//       data: {
//         labels: [translation.oneProportion.data],
//         datasets: [
//           {
//             label: '% ' + translation.twoProportions.successes,
//             backgroundColor: 'green',
//             data: [0],
//           },
//           {
//             label: '% ' + translation.twoProportions.failures,
//             backgroundColor: 'red',
//             data: [0],
//           },
//         ],
//       },
//       options: {
//         scales: {
//           xAxes: [
//             {
//               //stacked: true,
//               ticks: {
//                 max: 100,
//               },
//             }
//           ],
//           yAxes: [
//             {
//               id: 'groupAAxis',
//               //stacked: true,
//               ticks: {
//                 min:0,
//                 max: 100
//               },
//               scaleLabel: {
//                 display: true,
//                 labelString: translation.oneProportion.yAxisTitle1
//               }
//             },
//           ],
//         }, 
//         responsive: true,
//         maintainAspectRatio: false,
//       },
//     });
//   }

//   setProportions({ numsuccess, numfailure}) {
//     let totalInA = numsuccess + numfailure;
//     this.chart.data.datasets[0].data[0] = roundToPlaces(100 * numsuccess / totalInA, 2);
//     this.chart.data.datasets[1].data[0] = roundToPlaces(100 * numfailure / totalInA, 2)
//   }
  
//   update() {
//     this.chart.update();
//   }

// }

// import translation from "{{base}}../util/translate.js";
// import { roundToPlaces } from "{{base}}../util/math.js";
import Chart from 'chart.js';
 
export function roundToPlaces(value: number, places: number): number {
  const pow10: number = Math.pow(10, places);
  return Math.round(value * pow10) / pow10;
}

export default class OnePropChart {
  private dom: { canvas: HTMLCanvasElement };
  private chart: Chart;

  constructor(canvas: HTMLCanvasElement) {
    this.dom = { canvas };
    if (!canvas) {
      throw new Error('canvas is undefined!');
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [translation.oneProportion.data],
        datasets: [
          {
            label: '% ' + translation.twoProportions.successes,
            backgroundColor: 'green',
            data: [0],
          },
          {
            label: '% ' + translation.twoProportions.failures,
            backgroundColor: 'red',
            data: [0],
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              ticks: {
                max: 100,
              },
            },
          ],
          yAxes: [
            {
              id: 'groupAAxis',
              ticks: {
                min: 0,
                max: 100,
              },
              scaleLabel: {
                display: true,
                labelString: translation.oneProportion.yAxisTitle1,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  setProportions({ numsuccess, numfailure }: { numsuccess: number; numfailure: number }) {
    let totalInA = numsuccess + numfailure;
    this.chart.data.datasets[0].data[0] = roundToPlaces((100 * numsuccess) / totalInA, 2);
    this.chart.data.datasets[1].data[0] = roundToPlaces((100 * numfailure) / totalInA, 2);
  }

  update() {
    this.chart.update();
  }
}
