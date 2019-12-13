import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Construction} from '../model/construction.model';
import {ConstructionAdd} from '../model/constructionAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/constructionApi';

@Injectable({providedIn: 'root'})

export class ConstructionsService {
    private constructions: Construction[] = [];
    private constructionsUpdated = new Subject<{constructions: Construction[]; constructionCount: number}>();

    constructor(private http: HttpClient, private router: Router){}



    getConstructions(constructionsPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${constructionsPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; constructions: any; maxConstructions: number}>(
            API_URL + '/construction_list' + queryParams
        )
        .pipe(map((constructionData) => {
            return{
                constructions: constructionData.constructions.map(construction =>{
                    return{
                        name: construction.name,
                        id: construction._id,
                        street: construction.street,
                        azHMdFDeptIV: construction.azHMdFDeptIV,
                        projectNrPartner: construction.projectNrPartner,
                        device: construction.device,
                        ActionCoordinator: construction.ActionCoordinator,
                        recordingDate: construction.recordingDate,
                        user: construction.user,
                        location: construction.location,
                        ressort: construction.ressort,
                        section: construction.section,
                        product: construction.product,
                        interiorRef: construction.interiorRef,
                        title: construction.title,
                        programme: construction.programme,
                        feed: construction.feed,
                        relevantForMFP: construction.relevantForMFP,
                        constructionName: construction.constructionName,
                        status: construction.status,
                    };
                }),
                maxConstructions: constructionData.maxConstructions
            };
        })
        )
        .subscribe(transformedConstructionData => {
            this.constructions = transformedConstructionData.constructions;
            this.constructionsUpdated.next({
                constructions:[...this.constructions],
                constructionCount: transformedConstructionData.maxConstructions
            });
        });
    }


    getConstructionsUpdateListner(){
        return this.constructionsUpdated.asObservable();
    }

    getConstruction(id: string) {
        return this.http.get<{
          message: string,
          construction_list: any,
          feed_list: any,
          program_list: any
        }>(
            API_URL + '/construction_detail/'+ id
        );
    }



    getConstructionView(id: string) {
      return this.http.get<{
        message: string,
        construction_list: any,
        feed_list: any,
        program_list: any
      }>(
          API_URL + '/construction_view_detail/'+ id
      );
  }

    getConstructionsList(){
        return this.http.get<{ message: string; constructions: any; maxConstructions: number}>(
            API_URL + '/construction_list'
        );
    }


    getConstructionsListByID(id: string){
      return this.http.get<{ message: string; constructions: any; maxConstructions: number}>(
          API_URL + '/construction_list_by_id/' + id
      );
  }

      addConstruction(
        name: string,
        street: string,
        azHMdFDeptIV: string,
        projectNrPartner: string,
        device: string,
        ActionCoordinator: string,
        recordingDate: string,
        user: string,
        location: string,
        ressort: string,
        section: string,
        product: string,
        interiorRef: string,
        title: string,
        programme: string,
        feed: string,
        relevantForMFP: string,
        constructionName: string,
        ) {
          const construction: ConstructionAdd = {
            id: null,
            name: name,
            street: street,
            azHMdFDeptIV: azHMdFDeptIV,
            projectNrPartner: projectNrPartner,
            device: device,
            ActionCoordinator: ActionCoordinator,
            recordingDate: recordingDate,
            user: user,
            location: location,
            ressort: ressort,
            section: section,
            product: product,
            interiorRef: interiorRef,
            title: title,
            programme: programme,
            feed: feed,
            relevantForMFP: relevantForMFP,
            constructionName: constructionName
          };
          this.http
          .post<{message: string; construction: Construction}>(
              API_URL + '/add_construction',
              construction
          )
          .subscribe(responseData => {
              this.router.navigate(['/projectForm1/view']);
          })
      }


      updateConstruction(
        id: string,
        name: string,
        street: string,
        azHMdFDeptIV: string,
        projectNrPartner: string,
        device: string,
        ActionCoordinator: string,
        recordingDate: string,
        user: string,
        location: string,
        ressort: string,
        section: string,
        product: string,
        interiorRef: string,
        title: string,
        programme: string,
        feed: string,
        relevantForMFP: string,
        constructionName: string,
        ) {
        const construction: ConstructionAdd = {
          id: id,
          name: name,
          street: street,
          azHMdFDeptIV: azHMdFDeptIV,
          projectNrPartner: projectNrPartner,
          device: device,
          ActionCoordinator: ActionCoordinator,
          recordingDate: recordingDate,
          user: user,
          location: location,
          ressort: ressort,
          section: section,
          product: product,
          interiorRef: interiorRef,
          title: title,
          programme: programme,
          feed: feed,
          relevantForMFP: relevantForMFP,
          constructionName: constructionName
        };
        this.http
        .put(API_URL + '/construction_edit/' + id, construction)
        .subscribe(response => {
            this.router.navigate(['/projectForm1/view']);
        })
      }


      deleteConstruction(constructionId: string) {
          return this.http
          .get(API_URL + '/construction_delete/' + constructionId)
      }

}
