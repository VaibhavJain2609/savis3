import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.scss', './../scss/base.scss'],
})
export class CorrelationComponent implements OnInit {
  constructor() {}

  xValuesArray: number[] = [];
  yValuesArray: number[] = [];

  valuesCheck: boolean = false;

  handleInputX(event: number[]) {
    this.xValuesArray = event;
    this.valuesCheck = true;
    // console.log(this.xValuesArray);
  }

  handleInputY(event: number[]) {
    this.yValuesArray = event;
    this.valuesCheck = true;
    // console.log(this.yValuesArray);
  }

  ngOnInit(): void {}
}
