import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Investment} from '../model/investment.model';
import {InvestmentAdd} from '../model/investmentAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/investmentApi';

@Injectable({providedIn: 'root'})

export class InvestmentsService {
    private investments: Investment[] = [];
    private investmentsUpdated = new Subject<{investments: Investment[]; investmentCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}



    getInvestments(investmentsPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${investmentsPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; investments: any; maxInvestments: number}>(
            API_URL + '/investment_list' + queryParams
        )
        .pipe(map((investmentData) => {
            return{
                investments: investmentData.investments.map(investment =>{
                    return{
                        name: investment.name,
                        total_budget: investment.total_budget,
                        id: investment._id,
                        status: investment.status
                    };
                }),
                maxInvestments: investmentData.maxInvestments
            };
        })
        )
        .subscribe(transformedInvestmentData => {

            this.investments = transformedInvestmentData.investments;
            this.investmentsUpdated.next({
                investments: [...this.investments],
                investmentCount: transformedInvestmentData.maxInvestments
            });
        });
    }


    getInvestmentsUpdateListner(){
        return this.investmentsUpdated.asObservable();
    }

    getInvestment(id: string){
        return this.http.get<{_id: string, name: string , total_budget: number}>(
            API_URL + '/investment_detail/'+ id
        );
    }

    getInvestmentsList(){
        return this.http.get<{ message: string; investments: any; maxInvestments: number}>(
            API_URL + '/investment_list'
        );
    }

      addInvestment(name:string , total_budget:number) {
          const investment: InvestmentAdd = {id: null, name:name, total_budget: total_budget};
          this.http
          .post<{message: string; investment:Investment}>(
              API_URL + '/add_investment',
              investment
          )
          .subscribe(responseData => {
              this.router.navigate(['/form8/view']);
          })
      }


      updateInvestment(id: string, name: string, total_budget: number) {
        const investment: InvestmentAdd = {id:id, name:name , total_budget: total_budget};
        this.http
        .put(API_URL + '/investment_edit/' + id, investment)
        .subscribe(response => {
            this.router.navigate(['/form8/view']);
        })
      }


      deleteInvestment(investmentId: string) {
          return this.http
          .get(API_URL + '/investment_delete/' + investmentId)
      }

}
