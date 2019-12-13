import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';

import {Feed} from '../model/feed.model';
import {FeedAdd} from '../model/feedAdd.model';
import {environment} from '../../environments/environment';

const API_URL = environment.apiUrl + '/feedApi';

@Injectable({providedIn: 'root'})

export class FeedsService {
  private feeds: Feed[] = [];
  private feedsUpdated = new Subject<{ feeds: Feed[]; feedCount: number}>();
  constructor(private http: HttpClient, private router: Router) {}

  getFeeds(feedsPerPage: number , currentPage: number) {
    const queryParams = `?pagesize=${feedsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string; feeds: any; maxFeeds: number }>(
        API_URL + '/feed_list' + queryParams
    )
    .pipe(map((feedData) => {
        return {
           feeds: feedData.feeds.map(feed => {
              return {
                donor: feed.donor,
                id: feed._id,
                status: feed.status
              };
           }),
           maxFeeds: feedData.maxFeeds
        };
    })
    )
    .subscribe(transFormedFeedData => {
      this.feeds = transFormedFeedData.feeds;
      this.feedsUpdated.next({
          feeds: [...this.feeds],
          feedCount: transFormedFeedData.maxFeeds
      });
    });
  }

  getFeedUpdateListner() {
      return this.feedsUpdated.asObservable();
  }

  getFeed(id: string){
    return this.http.get<{_id: string, donor: string}>(
        API_URL + '/feed_detail/'+ id
    );
  }

  getFeedsList(){
    return this.http.get<{ message: string; feeds: any; maxFeeds: number}>(
        API_URL + '/feed_list'
    );
  }

  addFeed(donor:string){
    const feed: FeedAdd = {id: null, donor:donor};
    this.http
    .post<{message: string; feed:Feed}>(
        API_URL + '/add_feed',
        feed
    )
    .subscribe(responseData => {
        this.router.navigate(['/form4/view']);
    })
}


updateFeed(id: string, donor: string){
  const feed: FeedAdd ={id:id, donor:donor};
  this.http
  .put(API_URL + '/feed_edit/' + id, feed)
  .subscribe(response => {
      this.router.navigate(['/form4/view']);
  })
}


deleteFeed(feedId: string) {
    return this.http
    .get(API_URL + '/feed_delete/' + feedId)
}

}
