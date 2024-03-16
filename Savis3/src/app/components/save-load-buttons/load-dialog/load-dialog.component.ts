import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-load-dialog',
  templateUrl: './load-dialog.component.html',
  styleUrls: ['./load-dialog.component.scss'],
})
export class LoadDialogComponent {
  files: any[] = []
  selectedFile: any
  
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      this.files = data.files
      console.log(this.files)
      this.selectedFile = JSON.stringify(data.files, null, 2)
  }

  onNoClick(): void {
    this.dialog.closeAll()
  }
}