import { Chart } from 'chart.js';

export const errorBarsPlugin = {
    afterDatasetsDraw: function(chart: any) {
      const ctx = chart.ctx;
      const yAxis = chart.scales['y-axis-0'];
      if (!yAxis) {
        console.error('Y-axis not found');
        return;
      }
  
      chart.data.datasets.forEach((dataset: any, i: any) => {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden && dataset.errorBarsY1) {
          dataset.data.forEach((datapoint: any, index: any) => {
            const element = meta.data[index];
            if (element && typeof element.getCenterPoint === 'function') {
              const { x } = element.getCenterPoint();
              const y = yAxis.getPixelForValue(datapoint.y);
              const y1 = yAxis.getPixelForValue(datapoint.y1);
  
              // Draw the error bar if y and y1 are different
              if (y !== y1) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y1);
                ctx.strokeStyle = dataset.borderColor;
                ctx.lineWidth = dataset.borderWidth;
                ctx.stroke();
                ctx.restore();
              }
            }
          });
        }
      });
    }
};

// Could be used to generate squares on linear regression chart in the future?
export const squareDemo = {
  afterDatasetsDraw: function(chartInstance: any) {
    const ctx = chartInstance.ctx;
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 50, 50); // This should draw a small red square at the top-left corner of the chart
    ctx.restore();
  }
};