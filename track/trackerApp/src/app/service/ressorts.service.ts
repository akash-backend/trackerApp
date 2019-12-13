import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Ressort} from '../model/ressort.model';
import {RessortAdd} from '../model/ressortAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/ressortApi';

@Injectable({providedIn: 'root'})

export class RessortsService {
    private ressorts: Ressort[] = [];
    private ressortsUpdated = new Subject<{ressorts: Ressort[]; ressortCount: number}>();

    constructor(private http: HttpClient, private router: Router){}



    getRessorts(ressortsPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${ressortsPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; ressorts: any; maxRessorts: number}>(
            API_URL + '/ressort_list' + queryParams
        )
        .pipe(map((ressortData) => {
            return{
                ressorts: ressortData.ressorts.map(ressort =>{
                    return{
                        name: ressort.name,
                        id: ressort._id,
                        status: ressort.status
                    };
                }),
                maxRessorts: ressortData.maxRessorts
            };
        })
        )
        .subscribe(transformedRessortData => {
            this.ressorts = transformedRessortData.ressorts;
            this.ressortsUpdated.next({
                ressorts:[...this.ressorts],
                ressortCount: transformedRessortData.maxRessorts
            });
        });
    }


    getRessortsUpdateListner(){
        return this.ressortsUpdated.asObservable();
    }

    getRessort(id: string){
        return this.http.get<{_id: string, name: string}>(
            API_URL + '/ressort_detail/'+ id
        );
    }

    getRessortsList(){
        return this.http.get<{ message: string; ressorts: any; maxRessorts: number}>(
            API_URL + '/ressort_list'
        );
    }

      addRessort(name:string){
          const ressort: RessortAdd = {id: null, name:name};
          this.http
          .post<{message: string; ressort:Ressort}>(
              API_URL + '/add_ressort',
              ressort
          )
          .subscribe(responseData => {
              this.router.navigate(['/form3/view']);
          })
      }


      updateRessort(id: string, name: string){
        const ressort: RessortAdd ={id:id,name:name};
        this.http
        .put(API_URL + '/ressort_edit/' + id, ressort)
        .subscribe(response => {
            this.router.navigate(['/form3/view']);
        })
      }


      deleteRessort(ressortId: string) {
          return this.http
          .get(API_URL + '/ressort_delete/' + ressortId)
      }

}
