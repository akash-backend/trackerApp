import { Component, OnInit, OnDestroy } from '@angular/core';
import {PageEvent} from '@angular/material';
import {Subscription} from 'rxjs';
import {Product} from '../../model/product.model';
import {ProductsService} from '../../service/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  isLoading = false;
  totalProducts = 0;
  productsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  private productsSub: Subscription;

  public popoverTitle: string = 'Product Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public productsService: ProductsService) { }


  ngOnInit() {
      this.isLoading = true;
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
      this.productsSub = this.productsService.getProductsUpdateListner()
      .subscribe((productData: {products: Product[], productCount: number}) => {
          this.isLoading = false;
          this.totalProducts = productData.productCount;
          this.products = productData.products;
      });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productsService.getProducts(this.productsPerPage, this.currentPage);
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productsService.deleteProduct(productId).subscribe(()=> {
      this.productsService.getProducts(this.productsPerPage, this.currentPage);
    })
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }
}
