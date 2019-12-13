import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Subscription} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { SubCategory } from '../../model/subCategory.model';
import { SubCategorysService } from '../../service/subCategorys.service';

import {CategorysService} from '../../service/categorys.service';
import {Category} from '../../model/category.model';
import { SubCategoryAdd } from 'src/app/model/subCategoryAdd.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  subCategory: SubCategoryAdd;
  categorys_list: Category[] = [];
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private subCategoryId: string;



  constructor(public subCategorysService: SubCategorysService,public categorysService: CategorysService,public route: ActivatedRoute){}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
      category: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('subCategoryId')) {
        this.mode = 'edit';
        this.subCategoryId = paramMap.get('subCategoryId');
        this.isLoading = true;
        this.subCategorysService.getSubCategory(this.subCategoryId).subscribe(subCategoryData => {
          this.isLoading = false;
          this.subCategory = {
            id: subCategoryData._id,
            name: subCategoryData.name,
            category: subCategoryData.category
          };
          this.form.setValue({
            name: this.subCategory.name,
            category: this.subCategory.category
          });
        });
      } else {
        this.mode = 'create';
        this.subCategoryId = null;
      }
    });


    this.categorysService.getCategorysList().subscribe(categoryData => {
      this.categorys_list = categoryData.categorys;
    });
  }

  onSaveSubCategory() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.subCategorysService.addSubCategory(
        this.form.value.name,
        this.form.value.category
      );
    } else {
      this.subCategorysService.updateSubCategory(
        this.subCategoryId,
        this.form.value.name,
        this.form.value.category
      );
    }
    this.form.reset();
  }





}

