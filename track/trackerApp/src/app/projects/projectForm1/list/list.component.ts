import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import {Subscription} from 'rxjs';
import {Construction} from '../../../model/construction.model';
import {ConstructionsService} from '../../../service/constructions.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  constructions: Construction[] = [];
  isLoading = false;
  totalConstructions = 0;
  constructionsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private constructionsSub: Subscription;



  public popoverTitle: string = 'Project Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;


  constructor(public constructionsService: ConstructionsService) {}

 ngOnInit(){
   this.isLoading = true;
   this.constructionsService.getConstructions(this.constructionsPerPage, this.currentPage);
   this.constructionsSub = this.constructionsService.getConstructionsUpdateListner()
   .subscribe((constructionData: {constructions: Construction[], constructionCount: number}) => {
     this.isLoading = false;
     this.totalConstructions = constructionData.constructionCount;
     this.constructions = constructionData.constructions;

   });
 }

onChangedPage(pageData: PageEvent){
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.constructionsPerPage = pageData.pageSize;
  this.constructionsService.getConstructions(this.constructionsPerPage, this.currentPage);
}



onDelete(constructionId: string) {
  this.isLoading = true;
  this.constructionsService.deleteConstruction(constructionId).subscribe(()=> {
    this.constructionsService.getConstructions(this.constructionsPerPage, this.currentPage);
  })
}
ngOnDestroy(){
  this.constructionsSub.unsubscribe();
}

}
