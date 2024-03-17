import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    private af: AngularFireAuth,
    private firestore: AngularFirestore
    ) { 
      this.files = data.files
      this.selectedFile = JSON.stringify(data.files, null, 2)
  }

  onNoClick(): void {
    this.dialog.closeAll()
  }

  loadFile(): void {
    const selectedData = this.selectedFile.data

    this.sharedService.changeData(selectedData)
  }

  editFile(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      const selectedData = this.selectedFile.data

      this.af.authState.pipe(take(1)).subscribe(user => {
        if (user) {
          const userId = user.uid
          this.firestore.collection(`users/${userId}/savedData`, ref => ref.where('fileName', '==', this.selectedFile.fileName))
            .get()
            .toPromise()
            .then(querySnapshot => {
              if(!querySnapshot.empty) {
                const doc = querySnapshot.docs[0]
                doc.ref.update({ data: selectedData })
              }
            })
            .catch(error => {
              console.error('Error updating document: ', error)
            })
        }
      })
    })
  }

  deleteFile(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe(result => {
      this.af.authState.pipe(take(1)).subscribe(user => {
        if (user) {
          const userId = user.uid
          this.firestore.collection(`users/${userId}/savedData`, ref => ref.where('fileName', '==', this.selectedFile.fileName))
            .get()
            .toPromise()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                doc.ref.delete()
              })
            })
        }
      })
    })
  }
}