import { Component, OnInit } from '@angular/core';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm =this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]

    })
  }
  guestOnSubmit(){
    this.router.navigate(['/homepage']);
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Destructure email and password from the form value
      this.afAuth.signInWithEmailAndPassword(username, password)
        .then(userCredential => {
          console.log('Logged in successfully!', userCredential.user);
          this.router.navigate(['/homepage']);
        })
        .catch(error => {
          console.error('Login failed:', error);
          alert('Login failed. Please check your credentials.');
        });
    } else {
      this.validateAllFormFields(this.loginForm);
      alert('Your form is invalid');
    }
  }

validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl) {
        control?.markAsDirty({onlySelf:true})
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })
  }

}
