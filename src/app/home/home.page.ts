import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(private router: Router) { }

  library() {
  	this.router.navigateByUrl('/library');
  }
  subList() {
  	this.router.navigateByUrl('/sub-list-page');
  }

}
