import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLoggedIn = false;
  isLoading = false;
  error: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  onSubmit(signInForm: NgForm) {
    if (!signInForm.valid) {
      return;
    }

    this.isLoading = true;
    this.authService.signIn(signInForm.value.username, signInForm.value.password).subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.router.navigate(['./']);
      },
      errorMessage => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
    signInForm.reset();
  }
}
