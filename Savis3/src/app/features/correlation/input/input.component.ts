import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { sampleCorrelation } from 'simple-statistics';
import { EventEmitter } from '@angular/core';
import { read } from 'xlsx';
import * as XLSX from 'xlsx';
import Papa, { ParseResult } from 'papaparse';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  constructor() {}

  @Output() xValuesArrayEmitter: EventEmitter<number[]> = new EventEmitter<
    number[]
  >();
  @Output() yValuesArrayEmitter: EventEmitter<number[]> = new EventEmitter<
    number[]
  >();

  isFileData: boolean = false;
  fileContent: string | null = null;
  headers: string[] | undefined = [];
  fileData: any[] = [];
  select1 = new FormControl();
  select2 = new FormControl();

  correlationValue: string | null = null;

  formGroupValues: FormGroup = new FormGroup({
    xValues: new FormControl(),
    yValues: new FormControl(),
  });

  get xValues() {
    return this.formGroupValues.get('xValues');
  }

  get yValues() {
    return this.formGroupValues.get('yValues');
  }

  getFormValues() {
    if (this.xValues?.value == null || this.yValues?.value == null)
      return [[], []];
    let xValuesArray = this.xValues?.value.split(',');
    let yValuesArray = this.yValues?.value.split(',');
    // convert array values to ints
    xValuesArray = xValuesArray.map((x: string) => parseInt(x));
    yValuesArray = yValuesArray.map((x: string) => parseInt(x));
    return [xValuesArray, yValuesArray];
  }

  emitArrayValues(xValues: number[], yValues: number[]) {
    this.xValuesArrayEmitter.emit(xValues);
    this.yValuesArrayEmitter.emit(yValues);
  }

  calculate() {
    let [xValuesArray, yValuesArray] = this.getFormValues();
    console.log(xValuesArray.length);

    if (xValuesArray.length != yValuesArray.length || xValuesArray < 2) {
      alert('Incorrect Inputs');
      this.xValues?.setErrors({ notEqual: true });
      this.yValues?.setErrors({ notEqual: true });
      return;
    }
    this.emitArrayValues(xValuesArray, yValuesArray);
    // console.log(xValuesArray, yValuesArray);
    this.correlationValue = sampleCorrelation(
      xValuesArray,
      yValuesArray
    ).toFixed(2);
    // Disable file input
    this.isFileData = false;
    // console.log(this.correlationValue);
  }

  calculateFile() {
    // console.log(this.select1.value, this.select2.value);
    let selected1 = this.select1.value;
    let selected2 = this.select2.value;
    let xValuesArray: number[] = [];
    let yValuesArray: number[] = [];
    for (let i = 0; i < this.fileData.length; i++) {
      let data = this.fileData[i];
      xValuesArray.push(data[selected1]);
      yValuesArray.push(data[selected2]);
    }
    this.emitArrayValues(xValuesArray, yValuesArray);
    // console.log(xValuesArray, yValuesArray);
    this.correlationValue = sampleCorrelation(
      xValuesArray,
      yValuesArray
    ).toFixed(2);
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file.size < 0) {
      alert('Incompatible File');
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = () => {
      this.fileContent = reader.result as string;

      // Check the file extension
      const extension = file.name.split('.').pop()?.toLowerCase();

      switch (extension) {
        case 'csv':
          // console.log('CSV File Content (input):', this.fileContent);
          this.isFileData = true;
          this.parseCsv();
          break;
        case 'xlsx':
          // For XLSX files, use the read function from xlsx library
          const workbook = read(this.fileContent, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          this.fileContent = XLSX.utils.sheet_to_csv(sheet);
          // console.log('XLSX File Content (input):', this.fileContent);
          this.isFileData = true;
          this.parseCsv();
          break;

        default:
          alert(
            '❌ ERROR: Unsupported file type. Please upload a CSV or XLSX file.'
          );
          this.isFileData = false;
          break;
      }
    };
    reader.readAsBinaryString(file); // Read the file as binary
  }

  parseCsv(): void {
    // console.log(this.fileContent);
    // parse this.fileContent into rows and columns and separate headers
    var result: ParseResult<any> = Papa.parse(this.fileContent!, {
      header: true,
      dynamicTyping: true,
    });
    console.log(result);
    if (result.data.length < 2) {
      alert('File should have at least two points');
      this.fileContent = null;
      this.isFileData = false;
      return;
    }

    this.headers = result.meta.fields;
    this.fileData = result.data;
  }

  ngOnInit(): void {
    this.xValues?.valueChanges.subscribe({
      next: (e) => {
        this.xValues?.clearValidators();
      },
    });
    this.yValues?.valueChanges.subscribe({
      next: (e) => {
        this.yValues?.clearValidators();
      },
    });
  }
}
