import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouterModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneProportionComponent } from './features/one-proportion/one-proportion.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculationService } from './features/one-proportion/service/calculcation.service';
import { TwoProportionsComponent } from './features/two-proportions/two-proportions.component';
import { OneMeanComponent } from './features/one-mean/one-mean.component';
import { TwoMeansComponent } from './features/two-means/two-means.component';
import { OneMeanCIComponent } from './features/one-mean-ci/one-mean-ci.component';
import { TwoMeansCIComponent } from './features/two-means-ci/two-means-ci.component';
import { TwoProportionsCIComponent } from './features/two-proportions-ci/two-proportions-ci.component';
import { OneProportionCIComponent } from './features/one-proportion-ci/one-proportion-ci.component';
import { LinearRegressionComponent } from './features/linear-regression/linear-regression.component';
import { BivariantComponent } from './features/bivariant/bivariant.component';
import { CorrelationComponent } from './features/correlation/correlation.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ScatterPlotComponent } from './features/linear-regression/scatter-plot/scatter-plot.component';
import { ChartsModule } from 'ng2-charts';
import { CsvFileUploadComponent } from './components/csv-file-upload/csv-file-upload.component';
import { AboutComponent } from './components/about/about.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { InputComponent } from './features/correlation/input/input.component';
import { ChartComponent } from './features/correlation/chart/chart.component';
import { AppFirebaseModule } from './app-firebase.module';
import { MathService } from './Utils/math.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http)
}

export function setupTranslateFactory(service : TranslateService): Function {
  return () => new Promise((resolve, reject) => {
    const savedLang = localStorage.getItem('lang');
    const initialLang = savedLang ? savedLang : 'en';
    service.use(initialLang).subscribe(
      () => resolve(null),
      error => reject(error)
    );
  });
}

@NgModule({
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
    NavbarComponent,
    FooterComponent,
    LanguageSwitcherComponent,

  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppFirebaseModule,
    ChartsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    CalculationService,
    MathService,
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [TranslateService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
