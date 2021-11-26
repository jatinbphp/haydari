import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage {
  public show_in_view: any = 'list';
  constructor() {}
  showGridView()
  {
    this.show_in_view='grid';
  }

  showListView()
  {
    this.show_in_view='list';
  }
}
