import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { SaveDialogComponent } from './save-dialog/save-dialog.component';
import { LoadDialogComponent } from './load-dialog/load-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-save-load-buttons',
  templateUrl: './save-load-buttons.component.html',
  styleUrls: ['./save-load-buttons.component.scss'],
})
export class SaveLoadButtonsComponent {
  @Input() data: string
  @Input() feature: string
  fileName: string = ''
  loggedIn: boolean = false
  storedData: any[] = []
  

  constructor(
    private af: AngularFireAuth,
    private firestore: AngularFirestore,
    private translate: TranslateService,
    public dialog: MatDialog
  )
  {
    this.af.authState.subscribe(user => {
      this.loggedIn = !!user
    })
  }

  saveDialog() {
    console.log(this.feature)
    let dialogRef = this.dialog.open(SaveDialogComponent, {
      width: '400px',
      height: '600px',
      data: this.data
    })

    dialogRef.afterClosed().subscribe(result => {
      this.af.authState.pipe(take(1)).subscribe(user => {
        if (user) {
          const userId = user.uid
          this.firestore.collection(`users/${userId}/savedData`).add(result);
        }
      })
    })
  }

  loadDialog() {
    this.af.authState.pipe(take(1)).subscribe(user => {
      if (user) {
        const userId = user.uid
        this.firestore.collection(`users/${userId}/savedData`).valueChanges().subscribe(data => {
          let dialogRef = this.dialog.open(LoadDialogComponent, {
            width: '400px',
            height: '600px',
            data: { files: data }
          })
        })
      }
    })
  }
}
