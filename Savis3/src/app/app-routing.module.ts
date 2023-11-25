import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { OneProportionComponent } from './features/one-proportion/one-proportion.component';
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

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'oneproportion', component: OneProportionComponent },
  { path: 'twoproportions', component: TwoProportionsComponent },
  { path: 'onemean', component: OneMeanComponent },
  { path: 'twomeans', component: TwoMeansComponent },
  { path: 'onemeanCI', component: OneMeanCIComponent },
  { path: 'twomeansCI', component: TwoMeansCIComponent },
  { path: 'twoproportionsCI', component: TwoProportionsCIComponent },
  { path: 'oneproportionCI', component: OneProportionCIComponent },
  { path: 'linearRegression', component: LinearRegressionComponent },
  { path: 'bivariant', component: BivariantComponent },
  { path: 'correlation', component: CorrelationComponent },
  { path: 'homepage', component: HomepageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
