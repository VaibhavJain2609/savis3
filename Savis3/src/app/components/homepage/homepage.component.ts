import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent{

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  signOut(){
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login'])
    })
  }

}
