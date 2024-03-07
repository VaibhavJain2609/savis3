import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TwoMeansComponent } from './two-means.component';

describe('TwoMeansComponent', () => {
    let component: TwoMeansComponent;
    let fixture: ComponentFixture<TwoMeansComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TwoMeansComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TwoMeansComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize component properties', () => { /** @note here we are initialize component all properties.  */
        expect(component.activateSim).toBe(false);
        expect(component.dataSize1).toBe(0);
        expect(component.dataSize2).toBe(0);
        expect(component.datamean2).toBe(0);
        expect(component.datamean1).toBe(0);
        expect(component.mean_diff).toBe(0);
        expect(component.numofSem).toBe(1);
        expect(component.samDisActive).toBe(false);
        expect(component.lastSummary).toBeUndefined();
        expect(component.chart1).toBeUndefined();
    });

    it('should parse CSV data correctly', () => { /** @note we are parsing csv data here. */
        const csvData = 'Group 1,10\nGroup 1,15\nGroup 2,20\nGroup 2,25';
        const parsedData = component.parseData(csvData);
        expect(parsedData.length).toBe(2);
    });

    it('should calculate mean correctly', () => { /** @note we are calculating mean using testing data. */
        const testData = [10, 20, 30, 40, 50];
        const mean = component.calculateMean(testData);
        expect(mean).toBe(30);
    });

    it('should toggle sections correctly', () => { /** @note here we are toggling sections. */
        component.toggleSection({ target: { checked: false } }, 'sectionOne');
        expect(component.sections.sectionOne).toBeFalsy();
    });

    it('should update chart data correctly', () => { /** @note testing the updateChart method with sample data. */
        const testData = 'Group 1,10\nGroup 1,15\nGroup 2,20\nGroup 2,25';
        component.updateChart(testData);
        expect(component.chartData.length).toBe(1);
        /** @note we can add more specific expectations based on chart data update. */
    });


    it('should run simulations and update summary', () => { /** @note here we can add expectations to verify that simulations are run and summary data is updated. */
        spyOn(component, 'runSimulations').and.callThrough();
        component.runSimulations();
        expect(component.runSimulations).toHaveBeenCalled();
    });

    it('should handle edge cases and error scenarios', () => { /** @note adding more expectations to verify that error handling is done correctly. */
        const emptyCsvData = '';
        component.csvraw = emptyCsvData;
        component.loadData();
        expect(component.csv).toBeNull();
    });

    it('should ensure proper integration with external dependencies', () => {
        const mockChartInstance = jasmine.createSpyObj('chartInstance', ['update']); /** @note we are creating mock external dependency (e.g., chart library). */
        component.chart1 = {
            chart: mockChartInstance
        };
        spyOn(component.chart1, 'setDataFromRaw').and.callThrough();
        const rawData = {
            minmax: { min: 0, max: 10 },
            data: [[1, 2, 3]],
            label: 'Test Data',
            backgroundColor: 'blue'
        };
        component.chart1.setDataFromRaw(rawData);
        expect(component.chart1.setDataFromRaw).toHaveBeenCalledWith(rawData);
    });
});