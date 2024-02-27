import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorrelationComponent } from './correlation.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { ChartComponent } from './chart/chart.component';
import { InputComponent } from './input/input.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppFirebaseModule } from 'src/app/app-firebase.module';

describe('CorrelationComponent', () => {
  let component: CorrelationComponent;
  let fixture: ComponentFixture<CorrelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CorrelationComponent,
        NavbarComponent,
        ChartComponent,
        InputComponent,
        FooterComponent,
        LanguageSwitcherComponent,
      ],
      imports: [ReactiveFormsModule,
        AppFirebaseModule,
        RouterTestingModule,
        TranslateModule.forRoot(),]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handling emitted x and y value arrays', () => {
    it('should receive emitted x values array from input component', () => {
      // Find the child component instance
      const childComponentDE = fixture.debugElement.query(
        By.directive(InputComponent)
      );
      const childComponent = childComponentDE.componentInstance;

      // Spy on the parent component's handleEvent method
      jest.spyOn(component, 'handleInputX');

      // Trigger the event emission
      childComponent.xValuesArrayEmitter.emit('test value');

      // Assert that the parent component's handleEvent method was called with the correct value
      expect(component.handleInputX).toHaveBeenCalledWith('test value');
    });
  });

  it('should receive emitted y values array from input component', () => {
    // Find the child component instance
    const childComponentDE = fixture.debugElement.query(
      By.directive(InputComponent)
    );
    const childComponent = childComponentDE.componentInstance;

    // Spy on the parent component's handleEvent method
    jest.spyOn(component, 'handleInputY');

    // Trigger the event emission
    childComponent.yValuesArrayEmitter.emit('test value');

    // Assert that the parent component's handleEvent method was called with the correct value
    expect(component.handleInputY).toHaveBeenCalledWith('test value');
  });
});
