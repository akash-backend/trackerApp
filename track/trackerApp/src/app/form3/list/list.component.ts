import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import {Subscription} from 'rxjs';
import {Ressort} from '../../model/ressort.model';
import {RessortsService} from '../../service/ressorts.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  ressorts: Ressort[] = [];
  isLoading = false;
  totalRessorts = 0;
  ressortsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private ressortsSub: Subscription;


  public popoverTitle: string = 'Ressort Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public ressortsService: RessortsService) {}

 ngOnInit(){
   this.isLoading = true;
   this.ressortsService.getRessorts(this.ressortsPerPage, this.currentPage);
   this.ressortsSub = this.ressortsService.getRessortsUpdateListner()
   .subscribe((ressortData: {ressorts: Ressort[], ressortCount: number})=>{
     this.isLoading = false;
     this.totalRessorts =ressortData.ressortCount;
     this.ressorts = ressortData.ressorts;

   });
 }

onChangedPage(pageData: PageEvent){
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.ressortsPerPage = pageData.pageSize;
  this.ressortsService.getRessorts(this.ressortsPerPage, this.currentPage);
}



onDelete(ressortId: string) {
  this.isLoading = true;
  this.ressortsService.deleteRessort(ressortId).subscribe(()=> {
    this.ressortsService.getRessorts(this.ressortsPerPage, this.currentPage);
  })
}
ngOnDestroy(){
  this.ressortsSub.unsubscribe();
}

}
