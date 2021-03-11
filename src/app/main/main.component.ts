import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  user: User;
  
  constructor() { }

  ngOnInit() {
  }
}
