import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { InvestmentProgram } from '../../model/investmentProgram.model';
import { InvestmentProgramsService } from '../../service/investmentProgram.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  investmentPrograms: InvestmentProgram[] = [];
  isLoading = false;
  totalInvestmentPrograms = 0;
  investmentProgramsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private investmentProgramsSub: Subscription;

  constructor(public investmentProgramsService: InvestmentProgramsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.investmentProgramsService.getInvestmentPrograms(this.investmentProgramsPerPage, this.currentPage);
    this.investmentProgramsSub = this.investmentProgramsService.getInvestmentProgramsUpdateListner()
    .subscribe((investmentProgramData: {investmentPrograms: InvestmentProgram[], investmentProgramCount: number})=>{
        this.isLoading = false;
        this.totalInvestmentPrograms = investmentProgramData.investmentProgramCount;
        this.investmentPrograms = investmentProgramData.investmentPrograms;
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData.pageIndex);
    this.currentPage = pageData.pageIndex + 1;
    this.investmentProgramsPerPage = pageData.pageSize;
    console.log(this.currentPage);
    this.investmentProgramsService.getInvestmentPrograms(this.investmentProgramsPerPage, this.currentPage);
  }

  onDelete(investmentProgramId: string) {
    this.isLoading = true;
    this.investmentProgramsService.deleteInvestmentProgram(investmentProgramId).subscribe(() => {
      this.investmentProgramsService.getInvestmentPrograms(this.investmentProgramsPerPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.investmentProgramsSub.unsubscribe();
  }

}
