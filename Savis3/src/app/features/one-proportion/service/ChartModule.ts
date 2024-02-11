import { Chart } from "chart.js";

export class ChartModule {
    private chart!: Chart
    private context: CanvasRenderingContext2D
    private translationData: any

    constructor( private canvas: HTMLCanvasElement, translationData: any ) {
        this.context = canvas.getContext('2d')
        this.translationData = translationData
        this.initializeChart()
    }

    private initializeChart(): void {
        this.chart = new Chart(this.context, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [],
            },
            options: {}
        })
    }

    public updateChartData(sampleData: any): void {
        this.chart.data.labels = sampleData.labels
        this.chart.data.datasets = [
            {
                label: this.translationData.Samples,
                data: sampleData.samples,
            }
        ]

        this.chart.update()
    }

    
}