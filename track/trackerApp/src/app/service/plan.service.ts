import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Plan} from '../model/plan.model';
import {PlanAdd} from '../model/planAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/planApi';

@Injectable({providedIn: 'root'})

export class PlansService {
    private plans: Plan[] = [];
    private plansUpdated = new Subject<{plans: Plan[]; planCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}



    getPlans(plansPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${plansPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; plans: any; maxPlans: number}>(
            API_URL + '/plan_list' + queryParams
        )
        .pipe(map((planData) => {
            return{
                plans: planData.plans.map(plan =>{
                    return{
                        name: plan.name,
                        section: plan.section,
                        id: plan._id,
                        status: plan.status
                    };
                }),
                maxPlans: planData.maxPlans
            };
        })
        )
        .subscribe(transformedPlanData => {
            this.plans = transformedPlanData.plans;
            this.plansUpdated.next({
                plans:[...this.plans],
                planCount: transformedPlanData.maxPlans
            });
        });
    }


    getPlansUpdateListner(){
        return this.plansUpdated.asObservable();
    }

    getPlan(id: string){
        return this.http.get<{_id: string, name: string , section: number}>(
            API_URL + '/plan_detail/'+ id
        );
    }

    getPlansList(){
        return this.http.get<{ message: string; plans: any; maxPlans: number}>(
            API_URL + '/plan_list'
        );
    }

      addPlan(name:string , section:number) {
          const plan: PlanAdd = {id: null, name:name, section: section};
          this.http
          .post<{message: string; plan:Plan}>(
              API_URL + '/add_plan',
              plan
          )
          .subscribe(responseData => {
              this.router.navigate(['/form7/view']);
          })
      }


      updatePlan(id: string, name: string, section: number) {
        const plan: PlanAdd = {id:id, name:name , section: section};
        this.http
        .put(API_URL + '/plan_edit/' + id, plan)
        .subscribe(response => {
            this.router.navigate(['/form7/view']);
        })
      }


      deletePlan(planId: string) {
          return this.http
          .get(API_URL + '/plan_delete/' + planId)
      }

}
