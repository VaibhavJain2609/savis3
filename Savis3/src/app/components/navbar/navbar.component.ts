import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
  ) { }

  signOut(){
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login'])
    })
  }

}
