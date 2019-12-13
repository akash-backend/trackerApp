import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {ManageCategory} from '../model/manageCategory.model';
import {ManageCategoryAdd} from '../model/manageCategoryAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/manageCategoryApi';

@Injectable({providedIn: 'root'})
export class ManageCategorysService {
    private manageCategorys: ManageCategory[] = [];
    private manageCategorysUpdated = new Subject<{ manageCategorys: ManageCategory[]; manageCategoryCount: number }>();

    constructor(private http: HttpClient, private router: Router) {}

    getManageCategorys(manageCategorysPerPage: number, currentPage: number){
      const queryParams = `?pagesize=${manageCategorysPerPage}&page=${currentPage}`;
      this.http
        .get<{ message: string; manageCategorys: any; maxManageCategorys: number }>(
          API_URL + '/manageCategory_list' + queryParams
        )
      .pipe(map((manageCategoryData) => {
        return{
          manageCategorys: manageCategoryData.manageCategorys.map(manageCategory => {
          return {
            category: manageCategory.category.name,
            subCategory: manageCategory.subCategory.name,
            id: manageCategory._id,
          };
        }),
        maxManageCategorys: manageCategoryData.maxManageCategorys
      };
      })
      )
      .subscribe(transformedManageCategoryData => {
        this.manageCategorys = transformedManageCategoryData.manageCategorys;
        this.manageCategorysUpdated.next({
          manageCategorys: [...this.manageCategorys],
          manageCategoryCount: transformedManageCategoryData.maxManageCategorys
        });
      });
    }

    getManageCategorysUpdateListener() {
        return this.manageCategorysUpdated.asObservable();
      }

      getManageCategory(id: string) {
        return this.http.get<{ _id: string; category: string; subCategory: string }>(
          API_URL + '/manageCategory_detail/' + id
        );
      }


      getManageCategorysList(){
        return this.http.get<{ message: string; manageCategorys: any; maxManageCategorys: number}>(
            API_URL + '/manageCategory_list'
        );
    }

      addManageCategory(category: string, subCategory: string) {
        const manageCategoryData: ManageCategoryAdd = {id: null,category: category ,subCategory: subCategory };


        this.http
          .post<{ message: string; manageCategory: ManageCategory }>(
            API_URL + '/add_manageCategory/',
            manageCategoryData
          )
          .subscribe(responseData => {
            console.log(responseData);
            this.router.navigate(['/form11/view']);
          });
      }

      deleteManageCategory(manageCategoryId: string) {
        return this.http
        .get(API_URL + '/manageCategorys/' + manageCategoryId);
      }

      updateManageCategory(id: string, category: string, subCategory: string) {
        const manageCategory: ManageCategoryAdd = { id: id, category: category, subCategory: subCategory };
        this.http
          .put(API_URL + '/manageCategory_edit/' + id, manageCategory)
          .subscribe(response => {
            this.router.navigate(['/form11/view']);
          });
      }
}
