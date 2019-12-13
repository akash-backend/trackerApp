import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Category} from '../model/category.model';
import {CategoryAdd} from '../model/categoryAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/categoryApi';

@Injectable({providedIn: 'root'})

export class CategorysService {
    private categorys: Category[] = [];
    private categorysUpdated = new Subject<{categorys: Category[]; categoryCount: number}>();

    constructor(private http: HttpClient, private router: Router){}



    getCategorys(categorysPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${categorysPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; categorys: any; maxCategorys: number}>(
            API_URL + '/category_list' + queryParams
        )
        .pipe(map((categoryData) => {
            return{
                categorys: categoryData.categorys.map(category =>{
                    return{
                        name: category.name,
                        id: category._id,
                        status: category.status
                    };
                }),
                maxCategorys: categoryData.maxCategorys
            };
        })
        )
        .subscribe(transformedCategoryData => {
            this.categorys = transformedCategoryData.categorys;
            this.categorysUpdated.next({
                categorys:[...this.categorys],
                categoryCount: transformedCategoryData.maxCategorys
            });
        });
    }


    getCategorysUpdateListner(){
        return this.categorysUpdated.asObservable();
    }

    getCategory(id: string){
        return this.http.get<{_id: string, name: string}>(
            API_URL + '/category_detail/'+ id
        );
    }

    getCategorysList(){
        return this.http.get<{ message: string; categorys: any; maxCategorys: number}>(
            API_URL + '/category_list'
        );
    }

      addCategory(name:string){
          const category: CategoryAdd = {id: null, name:name};
          this.http
          .post<{message: string; category:Category}>(
              API_URL + '/add_category',
              category
          )
          .subscribe(responseData => {
              this.router.navigate(['/form12/view']);
          })
      }


      updateCategory(id: string, name: string){
        const category: CategoryAdd ={id:id,name:name};
        this.http
        .put(API_URL + '/category_edit/' + id, category)
        .subscribe(response => {
            this.router.navigate(['/form12/view']);
        })
      }


      deleteCategory(categoryId: string) {
          return this.http
          .get(API_URL + '/category_delete/' + categoryId)
      }

}
