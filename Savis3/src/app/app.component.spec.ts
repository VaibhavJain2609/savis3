import { TestBed } from "@angular/core/testing"
import { AppComponent } from "./app.component"
import { AppRouterModule } from "./app-routing.module"
import { MathService } from "./Utils/math.service"
import { LoginComponent } from "./components/login/login.component"
import { SignupComponent } from "./components/signup/signup.component"
import { AboutComponent } from "./components/about/about.component"
import { CsvFileUploadComponent } from "./components/csv-file-upload/csv-file-upload.component"
import { ForgotpasswordComponent } from "./components/forgotpassword/forgotpassword.component"
import { HomepageComponent } from "./components/homepage/homepage.component"
import { BivariantComponent } from "./features/bivariant/bivariant.component"
import { ChartComponent } from "./features/correlation/chart/chart.component"
import { CorrelationComponent } from "./features/correlation/correlation.component"
import { InputComponent } from "./features/correlation/input/input.component"
import { LinearRegressionComponent } from "./features/linear-regression/linear-regression.component"
import { ScatterPlotComponent } from "./features/linear-regression/scatter-plot/scatter-plot.component"
import { OneMeanCIComponent } from "./features/one-mean-ci/one-mean-ci.component"
import { OneMeanComponent } from "./features/one-mean/one-mean.component"
import { OneProportionCIComponent } from "./features/one-proportion-ci/one-proportion-ci.component"
import { OneProportionComponent } from "./features/one-proportion/one-proportion.component"
import { TwoMeansCIComponent } from "./features/two-means-ci/two-means-ci.component"
import { TwoMeansComponent } from "./features/two-means/two-means.component"
import { TwoProportionsCIComponent } from "./features/two-proportions-ci/two-proportions-ci.component"
import { TwoProportionsComponent } from "./features/two-proportions/two-proportions.component"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ChartsModule } from "ng2-charts"
import { BrowserModule } from "@angular/platform-browser"
import { AppFirebaseModule } from "./app-firebase.module"
import { APP_BASE_HREF } from "@angular/common"

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        OneProportionComponent,
        LoginComponent,
        SignupComponent,
        TwoProportionsComponent,
        OneMeanComponent,
        TwoMeansComponent,
        OneMeanCIComponent,
        TwoMeansCIComponent,
        TwoProportionsCIComponent,
        OneProportionCIComponent,
        LinearRegressionComponent,
        BivariantComponent,
        CorrelationComponent,
        HomepageComponent,
        ScatterPlotComponent,
        CsvFileUploadComponent,
        AboutComponent,
        ForgotpasswordComponent,
        ChartComponent,
        InputComponent,
      ],
      imports: [
        BrowserModule,
        AppRouterModule,
        FormsModule,
        ReactiveFormsModule,
        AppFirebaseModule,
        ChartsModule
      ],
      providers:[
        MathService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
    expect(app.title).toEqual('Savis3')
  })

})