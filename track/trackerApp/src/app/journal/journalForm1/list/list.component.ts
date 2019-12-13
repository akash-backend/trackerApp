import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Journal } from '../../../model/journal.model';
import { JournalsService } from '../../../service/journals.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  journals: Journal[] = [];
  isLoading = false;
  totalJournals = 0;
  journalsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private journalsSub: Subscription;



  constructor(public journalsService: JournalsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.journalsService.getJournals(this.journalsPerPage, this.currentPage);
    this.journalsSub = this.journalsService.getJournalsUpdateListener()
    .subscribe((journalData: {journals: Journal[], journalCount: number})=>{
        this.isLoading = false;
        this.totalJournals = journalData.journalCount;
        this.journals = journalData.journals;
        console.log(this.journals);
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData.pageIndex);
    this.currentPage = pageData.pageIndex + 1;
    this.journalsPerPage = pageData.pageSize;
    console.log(this.currentPage);
    this.journalsService.getJournals(this.journalsPerPage, this.currentPage);
  }

  onDelete(journalId: string) {
    this.isLoading = true;
    this.journalsService.deleteJournal(journalId).subscribe(() => {
      this.journalsService.getJournals(this.journalsPerPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.journalsSub.unsubscribe();
  }

}
