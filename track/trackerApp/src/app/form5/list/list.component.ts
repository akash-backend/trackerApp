import { Component, OnInit, OnDestroy } from '@angular/core';
import {PageEvent} from '@angular/material';
import {Subscription} from 'rxjs';
import {Title} from '../../model/title.model';
import {TitlesService} from '../../service/titles.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  titles: Title[] = [];
  isLoading = false;
  totalTitles = 0;
  titlesPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private titlesSub: Subscription;

  public popoverTitle: string = 'Title Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public titlesService: TitlesService) { }


  ngOnInit() {
      this.isLoading = true;
      this.titlesService.getTitles(this.titlesPerPage, this.currentPage);
      this.titlesSub = this.titlesService.getTitlesUpdateListner()
      .subscribe((titleData: {titles: Title[], titleCount: number}) => {
          this.isLoading = false;
          this.totalTitles = titleData.titleCount;
          this.titles = titleData.titles;
      });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.titlesPerPage = pageData.pageSize;
    this.titlesService.getTitles(this.titlesPerPage, this.currentPage);
  }

  onDelete(titleId: string) {
    this.isLoading = true;
    this.titlesService.deleteTitle(titleId).subscribe(()=> {
      this.titlesService.getTitles(this.titlesPerPage, this.currentPage);
    })
  }

  ngOnDestroy() {
    this.titlesSub.unsubscribe();
  }

}
