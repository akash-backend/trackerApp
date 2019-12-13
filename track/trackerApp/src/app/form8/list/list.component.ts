import { Component, OnInit, OnDestroy } from '@angular/core';
import {PageEvent} from '@angular/material';
import {Subscription} from 'rxjs';
import {Investment} from '../../model/investment.model';
import {InvestmentsService} from '../../service/investment.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  investments: Investment[] = [];
  isLoading = false;
  totalinvestments = 0;
  investmentsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private investmentsSub: Subscription;

  public popoverTitle: string = 'Investment Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public investmentsService: InvestmentsService) { }


  ngOnInit() {
      this.isLoading = true;
      this.investmentsService.getInvestments(this.investmentsPerPage, this.currentPage);
      this.investmentsSub = this.investmentsService.getInvestmentsUpdateListner()
      .subscribe((investmentData: {investments: Investment[], investmentCount: number}) => {
          this.isLoading = false;
          this.totalinvestments = investmentData.investmentCount;
          this.investments = investmentData.investments;

          const number = 123456.789;
          ;
      });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.investmentsPerPage = pageData.pageSize;
    this.investmentsService.getInvestments(this.investmentsPerPage, this.currentPage);
  }

  onDelete(investmentId: string) {
    this.isLoading = true;
    this.investmentsService.deleteInvestment(investmentId).subscribe(()=> {
      this.investmentsService.getInvestments(this.investmentsPerPage, this.currentPage);
    })
  }

  ngOnDestroy() {
    this.investmentsSub.unsubscribe();
  }


}
