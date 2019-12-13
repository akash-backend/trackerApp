import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {SectionPlan} from '../model/sectionPlan.model';
import {SectionPlanAdd} from '../model/sectionPlanAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/sectionPlanApi';

@Injectable({providedIn: 'root'})

export class SectionPlansService {
    private sectionPlans: SectionPlan[] = [];
    private sectionPlansUpdated = new Subject<{sectionPlans: SectionPlan[]; sectionPlanCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}



    getSectionPlans(sectionPlansPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${sectionPlansPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; sectionPlans: any; maxSectionPlans: number}>(
            API_URL + '/sectionPlan_list' + queryParams
        )
        .pipe(map((sectionPlanData) => {
            return{
                sectionPlans: sectionPlanData.sectionPlans.map(sectionPlan =>{
                    return{
                        section: sectionPlan.section.name,
                        year: sectionPlan.year,
                        amount: sectionPlan.amount,
                        id: sectionPlan._id,
                    };
                }),
                maxSectionPlans: sectionPlanData.maxSectionPlans
            };
        })
        )
        .subscribe(transformedSectionPlanData => {

            this.sectionPlans = transformedSectionPlanData.sectionPlans;
            this.sectionPlansUpdated.next({
                sectionPlans: [...this.sectionPlans],
                sectionPlanCount: transformedSectionPlanData.maxSectionPlans
            });
        });
    }


    getSectionPlansUpdateListner(){
        return this.sectionPlansUpdated.asObservable();
    }

    getSectionPlan(id: string){
        return this.http.get<{_id: string, section:string , year:number , amount:number}>(
            API_URL + '/sectionPlan_detail/'+ id
        );
    }

    getSectionPlansList(){
        return this.http.get<{ message: string; sectionPlans: any; maxSectionPlans: number}>(
            API_URL + '/sectionPlan_list'
        );
    }

      addSectionPlan(section:string , year:number , amount:number) {
          const sectionPlan: SectionPlanAdd = {id: null, section:section, year: year, amount: amount};
          this.http
          .post<{message: string; sectionPlan:SectionPlan}>(
              API_URL + '/add_sectionPlan',
              sectionPlan
          )
          .subscribe(responseData => {
              this.router.navigate(['/form10/view']);
          })
      }


      updateSectionPlan(id: string, section:string , year:number , amount:number) {
        const sectionPlan: SectionPlanAdd = {id:id, section:section, year: year, amount: amount};
        this.http
        .put(API_URL + '/sectionPlan_edit/' + id, sectionPlan)
        .subscribe(response => {
            this.router.navigate(['/form10/view']);
        })
      }


      deleteSectionPlan(sectionPlanId: string) {
          return this.http
          .get(API_URL + '/sectionPlan_delete/' + sectionPlanId)
      }

}
