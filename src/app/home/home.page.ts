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
  	this.router.navigateByUrl('/tabs/type-views');
  }
  subList() {
  	this.router.navigateByUrl('/tabs/sub-list-page');
  }

}
