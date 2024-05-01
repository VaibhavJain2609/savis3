# SAVIS3 Overview
SAVIS3 is a website built at the request of Prof. Rafael Diaz from Sac State. SAVIS3 aims to provide an open-source educational platform for students around the world to help them better understand statistics. 
This platform provides a myriad of visualization tools, allowing users to actively engage with various statistical concepts and enhance their comprehension. 
![savis_homepage](https://github.com/VaibhavJain2609/savis3/assets/50278167/67b7ceb6-73a3-452b-ae05-f727fab78dba)


<img width="1721" alt="savis_oneproportion" src="https://github.com/VaibhavJain2609/savis3/assets/50278167/f7aa263f-5749-4a19-8397-7f155d7dd0b4">
<img width="1728" alt="savis_regression" src="https://github.com/VaibhavJain2609/savis3/assets/50278167/8d038c7b-e301-4e88-b243-8b650c8ebd91">

### One Proportion Confidence Interval
<img width="1721" alt="savis_regression" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/OPCI.png">
This feature helps in estimating a range where the true population proportion lies based on a sample proportion. Here, we take in success and failure and show the proportion of success and the calculation involves the sample size with a chosen level of confidence (eg., 95%). We are able to see mean, standard deviation, lower and upper bounds of the intervals.


### One Mean Confidence Interval
<img width="1721" alt="savis_omci" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/OMCISS1.png">
<img width="1721" alt="savis_omci" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/OMCISS2.png">
<img width="1721" alt="savis_omci" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/OMCISS3.png">
<img width="1721" alt="savis_omci" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/OMCISS4.png">
One Mean Confidence Interval calculates the confidence interval for the entered data. The first component allows for the data
to be entered into the data. It also displays the count for each point as a scatter plot. The second part takes a sample and
runs the desired simulation. The third section allows for custom upper and lower bound to be added. The fourth section displays
graphs where it checks if it covers the mean of the actual in the sample collected when the bounds are added into consideration.

### Correlation Feature
<img width="1721" alt="savis_correlation" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/correlation.png">
This Correlation feature that allows users to analyze the relationship between two sets of data. It provides both manual and file upload options for inputting data and generates correlation coefficients along with visual charts for analysis.

### Two Proportion Hypothesis Testing
<img width="1721" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/Two Prop.png">
<img width="1721" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/Two Prop 2.png">
Two Proportion Hypothesis Testing feature first loads data and generates a graphical representation comparing two proportions. It then runs simulations to assess the significance of the observed difference, and finally, it analyzes the Sampling Distribution of Difference of Proportions to determine the likelihood of the observed results occurring by chance alone.

### Linear Regression Visualization
<img width="1721" src="https://github.com/VaibhavJain2609/savis3/blob/main/Savis3/src/assets/Linear.png">
"Linear regression is a statistical method used to model the relationship between two or more variables by fitting a linear equation to observed data. In our project, we employ linear regression to analyze the linear relationship between a dependent variable and one or more independent variables, enabling us to make predictions and understand the underlying patterns in the data."

# Timeline

# Testing 
## Unit Testing 

### Running unit tests
Run `ng test` to execute the unit tests via [Jest] https://github.com/jestjs/jest.

### Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Running all test 
Run `npm run test:coverage` to execute a test for all the features with a unit test. Once all the test has ran the results will show up in the terminal as well as in the file Savis3 -> coverage -> index.html.

## Functional Testing

### Running end-to-end functional test
Before running tests, the Angular project needs to be deployed into a local server using `ng serve`. This command compiles the application and starts a development server

Run `npm run cypress:open` to execute the automated tests via [Cypress] https://github.com/cypress-io/cypress

Once Cypress is open select "E2E testing" then select the preferred browser then Start. 

Every feature/component has its own spec, clicking on them will start the automated tests for that specific feature or component.


# Deployment 
# Developer Instructions 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.18.

### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference page](https://angular.io/cli).
