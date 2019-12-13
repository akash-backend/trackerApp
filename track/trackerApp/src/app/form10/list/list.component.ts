import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { SectionPlan } from '../../model/sectionPlan.model';
import { SectionPlansService } from '../../service/sectionPlan.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  sectionPlans: SectionPlan[] = [];
  isLoading = false;
  totalSectionPlans = 0;
  sectionPlansPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private sectionPlansSub: Subscription;

  constructor(public sectionPlansService: SectionPlansService) {}

  ngOnInit() {
    this.isLoading = true;
    this.sectionPlansService.getSectionPlans(this.sectionPlansPerPage, this.currentPage);
    this.sectionPlansSub = this.sectionPlansService.getSectionPlansUpdateListner()
    .subscribe((sectionPlanData: {sectionPlans: SectionPlan[], sectionPlanCount: number})=>{
        this.isLoading = false;
        this.totalSectionPlans = sectionPlanData.sectionPlanCount;
        this.sectionPlans = sectionPlanData.sectionPlans;
        console.log(this.sectionPlans);
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData.pageIndex);
    this.currentPage = pageData.pageIndex + 1;
    this.sectionPlansPerPage = pageData.pageSize;
    console.log(this.currentPage);
    this.sectionPlansService.getSectionPlans(this.sectionPlansPerPage, this.currentPage);
  }

  onDelete(sectionPlanId: string) {
    this.isLoading = true;
    this.sectionPlansService.deleteSectionPlan(sectionPlanId).subscribe(() => {
      this.sectionPlansService.getSectionPlans(this.sectionPlansPerPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.sectionPlansSub.unsubscribe();
  }

}
