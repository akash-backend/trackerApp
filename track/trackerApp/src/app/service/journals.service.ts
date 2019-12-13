import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Journal} from '../model/journal.model';
import {JournalAdd} from '../model/journalAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/journalApi';

@Injectable({providedIn: 'root'})
export class JournalsService {
    private journals: Journal[] = [];
    private journalsUpdated = new Subject<{ journals: Journal[]; journalCount: number }>();

    constructor(private http: HttpClient, private router: Router) {}

    getJournals(journalsPerPage: number, currentPage: number){
      const queryParams = `?pagesize=${journalsPerPage}&page=${currentPage}`;
      this.http
        .get<{ message: string; journals: any; maxJournals: number }>(
          API_URL + '/journal_list' + queryParams
        )
      .pipe(map((journalData) => {
        return{
          journals: journalData.journals.map(journal => {
          return {
            id: journal._id,
            construction: journal.construction.name,
            explanation: journal.explanation,
            journaldDate: journal.journaldDate,
            plan: journal.plan.name,
            category: journal.category.name,
            subCategory: journal.subCategory.name,
            amount: journal.amount,
            actualCost: journal.actualCost,
            totlaAmount: journal.totlaAmount,
            amountType: journal.amountType,
            lastChange: journal.lastChange,
            created_at: journal.created_at,
          };
        }),
        maxJournals: journalData.maxJournals
      };
      })
      )
      .subscribe(transformedJournalData => {
        this.journals = transformedJournalData.journals;
        this.journalsUpdated.next({
          journals: [...this.journals],
          journalCount: transformedJournalData.maxJournals
        });
      });
    }

    getJournalsUpdateListener() {
        return this.journalsUpdated.asObservable();
      }

      getJournal(id: string) {
        return this.http.get<{
          _id: string;
          construction: string,
          explanation: string,
          journaldDate: string,
          plan: string,
          category: string,
          subCategory: string,
          amount: number,
          actualCost: number,
          totlaAmount: number,
          amountType: string,
          lastChange: string
        }>(
          API_URL + '/journal_detail/' + id
        );
      }


      getJournalsList(){
        return this.http.get<{ message: string; journals: any; maxJournals: number}>(
            API_URL + '/journal_list'
        );
    }

      addJournal(
        construction: string,
        explanation: string,
        journaldDate: string,
        plan: string,
        category: string,
        subCategory: string,
        amount: number,
        actualCost: number,
        totlaAmount: number,
        amountType: string,
        lastChange: string) {
        const journalData: JournalAdd = {
          id: null,
          construction: construction,
          explanation: explanation,
          journaldDate: journaldDate,
          plan: plan,
          category: category,
          subCategory: subCategory,
          amount: amount,
          actualCost: actualCost,
          totlaAmount: totlaAmount,
          amountType: amountType,
          lastChange: lastChange
        };

        this.http
          .post<{ message: string; journal: Journal }>(
            API_URL + '/add_journal/',
            journalData
          )
          .subscribe(responseData => {
            console.log(responseData);
            this.router.navigate(['/journalForm1/view']);
          });
      }

      deleteJournal(journalId: string) {
        return this.http
        .get(API_URL + '/journals/' + journalId);
      }

      updateJournal(id: string,
        construction: string,
        explanation: string,
        journaldDate: string,
        plan: string,
        category: string,
        subCategory: string,
        amount: number,
        actualCost: number,
        totlaAmount: number,
        amountType: string,
        lastChange: string) {
        const journal: JournalAdd = {
          id: id,
          construction: construction,
          explanation: explanation,
          journaldDate: journaldDate,
          plan: plan,
          category: category,
          subCategory: subCategory,
          amount: amount,
          actualCost: actualCost,
          totlaAmount: totlaAmount,
          amountType: amountType,
          lastChange: lastChange
        };
        this.http
          .put(API_URL + '/journal_edit/' + id, journal)
          .subscribe(response => {
            this.router.navigate(['/journalForm1/view']);
          });
      }
}
