import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private afAuth: AngularFireAuth) { }

  title = 'Savis3'

  ngOnInit(): void {
    window.onbeforeunload = () => {
      this.afAuth.signOut()
    }
  }
}
