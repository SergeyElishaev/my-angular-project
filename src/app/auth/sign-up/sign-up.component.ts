import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  isLoading = false;
  error: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

  }

  onSubmit(signUpForm: NgForm) {
    if (!signUpForm.valid) {
      return false;
    }

    this.isLoading = true;

    this.authService.signUp(signUpForm.value.username, signUpForm.value.password).subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.router.navigate(['./sign-in']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      });

    signUpForm.reset();
  }

}
