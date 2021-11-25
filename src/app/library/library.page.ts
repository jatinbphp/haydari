import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  typeViews() {
  	this.router.navigateByUrl('/type-views');
  }

}
