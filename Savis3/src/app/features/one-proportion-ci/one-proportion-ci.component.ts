import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-one-proportion-ci',
  templateUrl: './one-proportion-ci.component.html',
  styleUrls: ['./one-proportion-ci.component.scss']
})
export class OneProportionCIComponent implements OnInit {

  confidenceLevel: number = 95;
  constructor() { }
  ngOnInit(): void {
  }

}
