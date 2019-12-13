import { Component, OnInit, OnDestroy } from '@angular/core';
import {PageEvent} from '@angular/material';
import {Subscription} from 'rxjs';
import {Plan} from '../../model/plan.model';
import {PlansService} from '../../service/plan.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  plans: Plan[] = [];
  isLoading = false;
  totalPlans = 0;
  plansPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private plansSub: Subscription;

  public popoverTitle: string = 'Plan Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;


  constructor(public plansService: PlansService) { }


  ngOnInit() {
      this.isLoading = true;
      this.plansService.getPlans(this.plansPerPage, this.currentPage);
      this.plansSub = this.plansService.getPlansUpdateListner()
      .subscribe((planData: {plans: Plan[], planCount: number}) => {
          this.isLoading = false;
          this.totalPlans = planData.planCount;
          this.plans = planData.plans;
      });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.plansPerPage = pageData.pageSize;
    this.plansService.getPlans(this.plansPerPage, this.currentPage);
  }

  onDelete(planId: string) {
    this.isLoading = true;
    this.plansService.deletePlan(planId).subscribe(()=> {
      this.plansService.getPlans(this.plansPerPage, this.currentPage);
    })
  }

  ngOnDestroy() {
    this.plansSub.unsubscribe();
  }
}
