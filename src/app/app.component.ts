import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment, Params, Data, Router, NavigationEnd, Routes } from '@angular/router';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      this.title = this.getTitle();
    });
  }

  getTitle() {
    let result = '..--Recipe Book--..';

    if (this.route.snapshot && this.route.snapshot.firstChild && this.route.snapshot.firstChild.data && this.route.snapshot.firstChild.data.title) {
      result = this.route.snapshot.firstChild.data.title;
    }

    return result;
  }
}
