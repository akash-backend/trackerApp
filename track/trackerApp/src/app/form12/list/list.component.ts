import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import {Subscription} from 'rxjs';
import {Category} from '../../model/category.model';
import {CategorysService} from '../../service/categorys.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  categorys: Category[] = [];
  isLoading = false;
  totalCategorys = 0;
  categorysPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private categorysSub: Subscription;


  public popoverTitle: string = 'Category Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public categorysService: CategorysService) {}

 ngOnInit(){
   this.isLoading = true;
   this.categorysService.getCategorys(this.categorysPerPage, this.currentPage);
   this.categorysSub = this.categorysService.getCategorysUpdateListner()
   .subscribe((categoryData: {categorys: Category[], categoryCount: number})=>{
     this.isLoading = false;
     this.totalCategorys =categoryData.categoryCount;
     this.categorys = categoryData.categorys;

   });
 }

onChangedPage(pageData: PageEvent){
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.categorysPerPage = pageData.pageSize;
  this.categorysService.getCategorys(this.categorysPerPage, this.currentPage);
}



onDelete(categoryId: string) {
  this.isLoading = true;
  this.categorysService.deleteCategory(categoryId).subscribe(()=> {
    this.categorysService.getCategorys(this.categorysPerPage, this.currentPage);
  })
}
ngOnDestroy(){
  this.categorysSub.unsubscribe();
}

}
