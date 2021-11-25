import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-type-views',
  templateUrl: './type-views.page.html',
  styleUrls: ['./type-views.page.scss'],
})
export class TypeViewsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  home() {
  	this.router.navigateByUrl('/tabs/home');
  }

}
