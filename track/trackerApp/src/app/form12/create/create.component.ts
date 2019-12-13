import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import {CategorysService} from '../../service/categorys.service';
import { Category } from '../../model/category.model';
import { CategoryAdd } from '../../model/categoryAdd.model';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


  category: CategoryAdd;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private categoryId: string;

  constructor(public categorysService: CategorysService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('categoryId')){
        this.mode = 'edit';
        this.categoryId = paramMap.get('categoryId');
        this.isLoading  = true;

        this.categorysService.getCategory(this.categoryId).subscribe(categoryData => {
          this.isLoading = false;
          this.category = {
            id: categoryData._id,
            name:categoryData.name
          };
          this.form.setValue({
            name: this.category.name
          });
        });
      } else {
        this.mode = 'create';
        this.categoryId = null;
      }
    });
  }



  onSaveCategory() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.categorysService.addCategory(
        this.form.value.name
      );
    } else {
      this.categorysService.updateCategory(
        this.categoryId,
        this.form.value.name
      );
    }
    this.form.reset();
  }

}
