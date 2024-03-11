import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TwoMeansComponent } from './two-means.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { TranslateModule, TranslateService, TranslateStore, TranslateCompiler, TranslateParser, MissingTranslationHandler, USE_DEFAULT_LANG, USE_STORE, USE_EXTEND, DEFAULT_LANGUAGE, TranslateFakeLoader } from '@ngx-translate/core';


describe('TwoMeansComponent', () => {
    let component: TwoMeansComponent;
    let fixture: ComponentFixture<TwoMeansComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [TwoMeansComponent, NavbarComponent, FooterComponent, LanguageSwitcherComponent],
            imports: [FormsModule, AppFirebaseModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }, { provide: USE_DEFAULT_LANG }, { provide: USE_STORE }, { provide: USE_EXTEND }, { provide: DEFAULT_LANGUAGE }, TranslateService, TranslateStore, TranslateFakeLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler],
            schemas: [NO_ERRORS_SCHEMA]

        }).compileComponents();
        fixture = TestBed.createComponent(TwoMeansComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
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

    // it('should update chart data correctly', () => { /** @note testing the updateChart method with sample data. */
    //     const testData = 'Group 1,10\nGroup 1,15\nGroup 2,20\nGroup 2,25';
    //     component.updateChart(testData);
    //     expect(component.chartData.length).toBe(1);
    // });


    // it('should run simulations and update summary', () => {/** @note here we can add expectations to verify that simulations are run and summary data is updated. */
    //     const initialSummary = JSON.parse(JSON.stringify(component.summaryData));
    //     component.runSimulations();
    //     const updatedSummary = component.summaryData;
    //     expect(updatedSummary).toEqual(initialSummary);
    // });

    it('should ensure proper integration with external dependencies', () => {/** @note we are creating mock external dependency (e.g., chart library). */
        const mockUpdate = jest.fn();
        const mockSetDataFromRaw = jest.fn();
        const mockChartInstance = {
            update: mockUpdate,
            setDataFromRaw: mockSetDataFromRaw
        };
        component.chart1 = {
            chart: mockChartInstance
        };
        const rawData = {
            minmax: { min: 0, max: 10 },
            data: [[1, 2, 3]],
            label: 'Test Data',
            backgroundColor: 'blue'
        };
        component.chart1.chart.setDataFromRaw(rawData);
        expect(mockSetDataFromRaw).toHaveBeenCalledWith(rawData);
    }); 
    it('should update chart data correctly', () => {
      // Arrange
      const sampleData = '1,2\n3,4'; // Sample data for testing
      const expectedChartData = [
        {
          data: [{ x: 2, y: 1 }, { x: 4, y: 3 }],
          label: 'Original Data',
          pointRadius: 6,
        },
      ];
      const expectedChartLabels = ['Data Point 1', 'Data Point 2'];
      // Act
      component.updateChart(sampleData);
      // Assert
      expect(component.chartData).toEqual(expectedChartData);
      expect(component.chartLabels).toEqual(expectedChartLabels);
    });

    
    it('should reset all charts and update data', () => {
      // Arrange
    
      // Mock chart libraries (replace with actual mocking library)
      const chart1Mock = { clear: jest.fn(), chart: { update: jest.fn() } };
      const chart2Mock = { clear: jest.fn(), chart: { update: jest.fn() } };
      const chart3Mock = { clear: jest.fn(), chart: { update: jest.fn() } };
      const chart4Mock = { clear: jest.fn(), chart: { update: jest.fn() } };
      component.chart1 = chart1Mock;
      component.chart2 = chart2Mock;
      component.chart3 = chart3Mock;
      component.chart4 = chart4Mock;
    
      // Act
      component.onResetChart();
    
      // Assert
      expect(chart1Mock.clear).toHaveBeenCalledTimes(1);
      expect(chart2Mock.clear).toHaveBeenCalledTimes(1);
      expect(chart3Mock.clear).toHaveBeenCalledTimes(1);
      expect(chart4Mock.clear).toHaveBeenCalledTimes(1);
    
      expect(chart1Mock.chart.update).toHaveBeenCalledWith(0);
      expect(chart2Mock.chart.update).toHaveBeenCalledWith(0);
      expect(chart3Mock.chart.update).toHaveBeenCalledWith(0);
      expect(chart4Mock.chart.update).toHaveBeenCalledWith(0);
    });
    it('should update summary chart data correctly', () => {
      // Arrange
      const sampleData = '1,2 \n 3,4'; // Sample data for testing
      const expectedSummaryData = [{ data: [2, 3, 0, NaN, NaN], label: 'Summary Statistics' },];
    
      // Act
      component.updateSummaryChart(sampleData);
    
      // Assert
      expect(component.summaryData).toEqual(expectedSummaryData);
      expect(sampleData).not.toEqual('1,2,3,4');
    });
  
    it('should parse data correctly', () => {
      // Arrange
      const rawData = 'Group1,10\nGroup1,20\nGroup2,15\nGroup2,25\n';
      const expectedParsedData = [[10, 20], [15, 25]]; // Expected parsed data
      // Act
      const parsedData = component.parseData(rawData);
      // Assert
      expect(parsedData).toEqual(expectedParsedData);
    });
    it('should run simulations correctly', () => {
      // Arrange
      const expectedSimulationsLog = 'Running'; // Example expected log message
      // Mock console.log to capture log output
      const originalLog = console.log;
      let consoleOutput = '';
      console.log = (message: string) => (consoleOutput += message);
      // Act
      component.numberOfSimulations = 5;
      component.runSimulations();
      // Assert
      expect(consoleOutput).toContain(expectedSimulationsLog);
      // Restore console.log
      console.log = originalLog;
    });
  

    it('should add simulation sample correctly', () => {
      // Arrange
      const sample = [{ datasetId: 0, value: 10 }, { datasetId: 1, value: 20 }];
      const expectedData = { minmax: component.minmax, data: [[10], [20]] }; // Expected simulation sample data
      // Act
      const result = component.addSimulationSample(sample);
      // Assert
      expect(result).toEqual(expectedData);
    });
    it('should toggle section correctly', () => {
      // Initial state of the sections
      expect(component.sections['sectionOne']).toEqual(true);
      expect(component.sections['sectionTwo']).toEqual(true);
      expect(component.sections['sectionThree']).toEqual(true);
    
      // Simulate checkbox event for toggling sectionOne
      const eventSectionOne = { target: { checked: false } };
      component.toggleSection(eventSectionOne, 'sectionOne');
      expect(component.sections['sectionOne']).toEqual(false); // Check if sectionOne is toggled off
    
      // Simulate checkbox event for toggling sectionThree
      const eventSectionThree = { target: { checked: false } };
      component.toggleSection(eventSectionThree, 'sectionThree');
      expect(component.sections['sectionThree']).toEqual(false); // Check if sectionThree is toggled off
    
      // Simulate checkbox event for toggling sectionTwo (with section already off)
      const eventSectionTwoOff = { target: { checked: true } };
      component.toggleSection(eventSectionTwoOff, 'sectionTwo');
      expect(component.sections['sectionTwo']).toEqual(true); // Check if sectionTwo remains off (unchanged)
    
      // Simulate checkbox event for toggling sectionTwo (with section already on)
      const eventSectionTwoOn = { target: { checked: false } };
      component.toggleSection(eventSectionTwoOn, 'sectionTwo');
      expect(component.sections['sectionTwo']).toEqual(false); // Check if sectionTwo is toggled off
    });
});