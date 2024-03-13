import { createCanvas, CanvasRenderingContext2D } from 'canvas';
import 'jest-preset-angular/setup-jest';

declare global {
  interface HTMLCanvasElement {
    getContext(contextId: '2d', options?: any): CanvasRenderingContext2D | null;
  }
}

HTMLCanvasElement.prototype.getContext = function (contextId: string, options?: any): any {
  const canvas = createCanvas(0, 0);
  if (contextId === '2d') {
    return canvas.getContext('2d', options);
  }
  return null;
};