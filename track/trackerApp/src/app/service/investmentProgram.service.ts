import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {InvestmentProgram} from '../model/investmentProgram.model';
import {InvestmentProgramAdd} from '../model/investmentProgramAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/investmentProgramApi';

@Injectable({providedIn: 'root'})

export class InvestmentProgramsService {
    private investmentPrograms: InvestmentProgram[] = [];
    private investmentProgramsUpdated = new Subject<{investmentPrograms: InvestmentProgram[]; investmentProgramCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}



    getInvestmentPrograms(investmentProgramsPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${investmentProgramsPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; investmentPrograms: any; maxInvestmentPrograms: number}>(
            API_URL + '/investmentProgram_list' + queryParams
        )
        .pipe(map((investmentProgramData) => {
            return{
                investmentPrograms: investmentProgramData.investmentPrograms.map(investmentProgram =>{
                    return{
                        investment_program_name: investmentProgram.investment_program_name.name,
                        user: investmentProgram.user.name,
                        amount: investmentProgram.amount,
                        id: investmentProgram._id
                    };
                }),
                maxInvestmentPrograms: investmentProgramData.maxInvestmentPrograms
            };
        })
        )
        .subscribe(transformedInvestmentProgramData => {

            this.investmentPrograms = transformedInvestmentProgramData.investmentPrograms;
            this.investmentProgramsUpdated.next({
                investmentPrograms: [...this.investmentPrograms],
                investmentProgramCount: transformedInvestmentProgramData.maxInvestmentPrograms
            });
        });
    }


    getInvestmentProgramsUpdateListner(){
        return this.investmentProgramsUpdated.asObservable();
    }

    getInvestmentProgram(id: string){
        return this.http.get<{_id: string, investment_program_name: string , user: string , amount: number}>(
            API_URL + '/investmentProgram_detail/'+ id
        );
    }

    getInvestmentProgramsList(){
        return this.http.get<{ message: string; investmentPrograms: any; maxInvestmentPrograms: number}>(
            API_URL + '/investmentProgram_list'
        );
    }

      addInvestmentProgram(investment_program_name : string , user:string , amount:number) {
          const investmentProgram: InvestmentProgramAdd = {id: null, investment_program_name:investment_program_name, user:user, amount: amount};
          this.http
          .post<{message: string; investmentProgram:InvestmentProgram}>(
              API_URL + '/add_investmentProgram',
              investmentProgram
          )
          .subscribe(responseData => {
              this.router.navigate(['/form9/view']);
          })
      }


      updateInvestmentProgram(id: string, investment_program_name:string , user:string , amount:number) {
        const investmentProgram: InvestmentProgramAdd = {id:id, investment_program_name:investment_program_name, user: user, amount: amount};
        this.http
        .put(API_URL + '/investmentProgram_edit/' + id, investmentProgram)
        .subscribe(response => {
            this.router.navigate(['/form9/view']);
        })
      }


      deleteInvestmentProgram(investmentProgramId: string) {
          return this.http
          .get(API_URL + '/investmentProgram_delete/' + investmentProgramId)
      }

}
