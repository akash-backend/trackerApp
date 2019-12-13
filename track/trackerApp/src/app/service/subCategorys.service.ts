import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {SubCategory} from '../model/subCategory.model';
import {SubCategoryAdd} from '../model/subCategoryAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/subCategoryApi';

@Injectable({providedIn: 'root'})
export class SubCategorysService {
    private subCategorys: SubCategory[] = [];
    private subCategorysUpdated = new Subject<{ subCategorys: SubCategory[]; subCategoryCount: number }>();

    constructor(private http: HttpClient, private router: Router) {}

    getSubCategorys(subCategorysPerPage: number, currentPage: number){
      const queryParams = `?pagesize=${subCategorysPerPage}&page=${currentPage}`;
      this.http
        .get<{ message: string; subCategorys: any; maxSubCategorys: number }>(
          API_URL + '/subCategory_list' + queryParams
        )
      .pipe(map((subCategoryData) => {
        return{
          subCategorys: subCategoryData.subCategorys.map(subCategory => {
          return {
            name: subCategory.name,
            category: subCategory.category.name,
            id: subCategory._id,
            status: subCategory.status
          };
        }),
        maxSubCategorys: subCategoryData.maxSubCategorys
      };
      })
      )
      .subscribe(transformedSubCategoryData => {
        this.subCategorys = transformedSubCategoryData.subCategorys;
        this.subCategorysUpdated.next({
          subCategorys: [...this.subCategorys],
          subCategoryCount: transformedSubCategoryData.maxSubCategorys
        });
      });
    }

    getSubCategorysUpdateListener() {
        return this.subCategorysUpdated.asObservable();
      }

      getSubCategory(id: string) {
        return this.http.get<{ _id: string; name: string; category: string }>(
          API_URL + '/subCategory_detail/' + id
        );
      }


      getSubCategoryByCategoryId(id: string) {
        return this.http.get<{ message: string; subCategorys: any; }>(
          API_URL + '/get_subCategory_by_categoryId/' + id
        );
      }


      getSubCategorysList(){
        return this.http.get<{ message: string; subCategorys: any; maxSubCategorys: number}>(
            API_URL + '/subCategory_list'
        );
    }

      addSubCategory(name: string, category: string) {
        const subCategoryData: SubCategoryAdd = {id: null, name:name ,category:category };

        this.http
          .post<{ message: string; subCategory: SubCategory }>(
            API_URL + '/add_subCategory/',
            subCategoryData
          )
          .subscribe(responseData => {
            console.log(responseData);
            this.router.navigate(['/form13/view']);
          });
      }

      deleteSubCategory(subCategoryId: string) {
        return this.http
        .get(API_URL + '/subCategorys/' + subCategoryId);
      }

      updateSubCategory(id: string, name: string, category: string) {
        const subCategory: SubCategoryAdd = { id: id, name: name, category: category };
        this.http
          .put(API_URL + '/subCategory_edit/' + id, subCategory)
          .subscribe(response => {
            this.router.navigate(['/form13/view']);
          });
      }
}
