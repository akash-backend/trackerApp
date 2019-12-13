import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { SubCategory } from '../../model/subCategory.model';
import { SubCategorysService } from '../../service/subCategorys.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  subCategorys: SubCategory[] = [];
  isLoading = false;
  totalSubCategorys = 0;
  subCategorysPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private subCategorysSub: Subscription;

  public popoverTitle: string = 'SubCategory Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public subCategorysService: SubCategorysService) {}

  ngOnInit() {
    this.isLoading = true;
    this.subCategorysService.getSubCategorys(this.subCategorysPerPage, this.currentPage);
    this.subCategorysSub = this.subCategorysService.getSubCategorysUpdateListener()
    .subscribe((subCategoryData: {subCategorys: SubCategory[], subCategoryCount: number})=>{
        this.isLoading = false;
        this.totalSubCategorys = subCategoryData.subCategoryCount;
        this.subCategorys = subCategoryData.subCategorys;
        console.log(this.subCategorys);
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData.pageIndex);
    this.currentPage = pageData.pageIndex + 1;
    this.subCategorysPerPage = pageData.pageSize;
    console.log(this.currentPage);
    this.subCategorysService.getSubCategorys(this.subCategorysPerPage, this.currentPage);
  }

  onDelete(subCategoryId: string) {
    this.isLoading = true;
    this.subCategorysService.deleteSubCategory(subCategoryId).subscribe(() => {
      this.subCategorysService.getSubCategorys(this.subCategorysPerPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.subCategorysSub.unsubscribe();
  }

}
