import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import {ProductsService} from '../../service/product.service';
import { Product } from '../../model/product.model';
import { ProductAdd } from '../../model/productAdd.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


  product: ProductAdd;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private productId: string;

  constructor(public productsService: ProductsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
      product_number: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')]
      }),
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading  = true;

        this.productsService.getProduct(this.productId).subscribe(productData => {
          this.isLoading = false;
          this.product = {
            id: productData._id,
            name: productData.name,
            product_number: productData.product_number
          };
          this.form.setValue({
            name: this.product.name,
            product_number: this.product.product_number
          });
        });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onSaveProduct() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.name,
        this.form.value.product_number
      );
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.name,
        this.form.value.product_number
      );
    }
    this.form.reset();
  }

}
