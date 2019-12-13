import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import {FeedsService} from '../../service/feeds.service';
import { Feed } from '../../model/feed.model';
import { FeedAdd } from '../../model/feedAdd.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  feed: FeedAdd;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private feedId: string;

  constructor(public feedsService: FeedsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      donor: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('feedId')){
        this.mode = 'edit';
        this.feedId = paramMap.get('feedId');
        this.isLoading  = true;

        this.feedsService.getFeed(this.feedId).subscribe(feedData => {
          this.isLoading = false;
          this.feed = {
            id: feedData._id,
            donor: feedData.donor
          };
          this.form.setValue({
            donor: this.feed.donor
          });
        });
      } else {
        this.mode = 'create';
        this.feedId = null;
      }
    });
  }

  onSaveFeed() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.feedsService.addFeed(
        this.form.value.donor
      );
    } else {
      this.feedsService.updateFeed(
        this.feedId,
        this.form.value.donor
      );
    }
    this.form.reset();
  }


}
