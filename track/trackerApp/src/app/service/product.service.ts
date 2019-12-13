import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Product} from '../model/product.model';
import {ProductAdd} from '../model/productAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/productApi';

@Injectable({providedIn: 'root'})

export class ProductsService {
    private products: Product[] = [];
    private productsUpdated = new Subject<{products: Product[]; productCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}



    getProducts(productsPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; products: any; maxProducts: number}>(
            API_URL + '/product_list' + queryParams
        )
        .pipe(map((productData) => {
            return{
                products: productData.products.map(product =>{
                    return{
                        name: product.name,
                        product_number: product.product_number,
                        id: product._id,
                        status: product.status
                    };
                }),
                maxProducts: productData.maxProducts
            };
        })
        )
        .subscribe(transformedProductData => {
            this.products = transformedProductData.products;
            this.productsUpdated.next({
                products:[...this.products],
                productCount: transformedProductData.maxProducts
            });
        });
    }


    getProductsUpdateListner(){
        return this.productsUpdated.asObservable();
    }

    getProduct(id: string){
        return this.http.get<{_id: string, name: string , product_number: number}>(
            API_URL + '/product_detail/'+ id
        );
    }

    getProductsList(){
        return this.http.get<{ message: string; products: any; maxProducts: number}>(
            API_URL + '/product_list'
        );
    }

      addProduct(name:string , product_number:number) {
          const product: ProductAdd = {id: null, name:name, product_number: product_number};
          this.http
          .post<{message: string; product:Product}>(
              API_URL + '/add_product',
              product
          )
          .subscribe(responseData => {
              this.router.navigate(['/form6/view']);
          })
      }


      updateProduct(id: string, name: string, product_number: number) {
        const product: ProductAdd = {id:id, name:name , product_number: product_number};
        this.http
        .put(API_URL + '/product_edit/' + id, product)
        .subscribe(response => {
            this.router.navigate(['/form6/view']);
        })
      }


      deleteProduct(productId: string) {
          return this.http
          .get(API_URL + '/product_delete/' + productId)
      }

}
