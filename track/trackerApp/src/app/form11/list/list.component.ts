import { Component, OnInit, OnDestroy } from '@angular/core';
import {PageEvent} from '@angular/material';
import {Subscription} from 'rxjs';
import {ManageCategory} from '../../model/manageCategory.model';
import {ManageCategorysService} from '../../service/manageCategorys.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  manageCategorys: ManageCategory[] = [];
  isLoading = false;
  totalmanageCategorys = 0;
  manageCategorysPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private manageCategorysSub: Subscription;



  constructor(public manageCategorysService: ManageCategorysService) { }


  ngOnInit() {
      this.isLoading = true;
      this.manageCategorysService.getManageCategorys(this.manageCategorysPerPage, this.currentPage);
      this.manageCategorysSub = this.manageCategorysService.getManageCategorysUpdateListener()
      .subscribe((manageCategoryData: {manageCategorys: ManageCategory[], manageCategoryCount: number}) => {
          this.isLoading = false;
          this.totalmanageCategorys = manageCategoryData.manageCategoryCount;
          this.manageCategorys = manageCategoryData.manageCategorys;
      });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.manageCategorysPerPage = pageData.pageSize;
    this.manageCategorysService.getManageCategorys(this.manageCategorysPerPage, this.currentPage);
  }

  onDelete(manageCategoryId: string) {
    this.isLoading = true;
    this.manageCategorysService.deleteManageCategory(manageCategoryId).subscribe(()=> {
      this.manageCategorysService.getManageCategorys(this.manageCategorysPerPage, this.currentPage);
    })
  }

  ngOnDestroy() {
    this.manageCategorysSub.unsubscribe();
  }


}
