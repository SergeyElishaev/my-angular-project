import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //TODO: Init the form
  }

  onSubmit(){
    console.log('SignIn form submitted');
    //TODO: check username & password => generate token / show error
  }
}
