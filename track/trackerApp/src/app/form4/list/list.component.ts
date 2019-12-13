import { Component, OnInit, OnDestroy } from '@angular/core';
import {PageEvent} from '@angular/material';
import {Subscription} from 'rxjs';
import {Feed} from '../../model/feed.model';
import {FeedsService} from '../../service/feeds.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  feeds: Feed[] = [];
  isLoading = false;
  totalFeeds = 0;
  feedsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private feedsSub: Subscription;


  public popoverTitle: string = 'Feed Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public feedsService: FeedsService) { }


  ngOnInit() {
      this.isLoading = true;
      this.feedsService.getFeeds(this.feedsPerPage, this.currentPage);
      this.feedsSub = this.feedsService.getFeedUpdateListner()
      .subscribe((feedData: {feeds: Feed[], feedCount: number}) => {
          this.isLoading = false;
          this.totalFeeds = feedData.feedCount;
          this.feeds = feedData.feeds;
      });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.feedsPerPage = pageData.pageSize;
    this.feedsService.getFeeds(this.feedsPerPage, this.currentPage);
  }

  onDelete(feedId: string) {
    this.isLoading = true;
    this.feedsService.deleteFeed(feedId).subscribe(()=> {
      this.feedsService.getFeeds(this.feedsPerPage, this.currentPage);
    })
  }

  ngOnDestroy() {
    this.feedsSub.unsubscribe();
  }

}
