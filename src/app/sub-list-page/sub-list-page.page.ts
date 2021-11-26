import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-list-page',
  templateUrl: './sub-list-page.page.html',
  styleUrls: ['./sub-list-page.page.scss'],
})
export class SubListPagePage implements OnInit {
  public show_in_view: any = 'list';
  constructor() { }

  ngOnInit() {
  }
  showGridView()
  {
    this.show_in_view='grid';
  }

  showListView()
  {
    this.show_in_view='list';
  }
}
