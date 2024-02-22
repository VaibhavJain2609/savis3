import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent{

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private translate: TranslateService
  ) { }

  signOut(){
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login'])
    })
  }

}
