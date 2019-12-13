import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Subscription} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ManageCategory } from '../../model/manageCategory.model';
import { ManageCategorysService } from '../../service/manageCategorys.service';

import { Category } from '../../model/category.model';
import {CategorysService} from '../../service/categorys.service';
import { SubCategory } from '../../model/subcategory.model';
import {SubCategorysService} from '../../service/subcategorys.service';
import { ManageCategoryAdd } from 'src/app/model/manageCategoryAdd.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  manageCategory: ManageCategoryAdd;
  categorys_list: Category[] = [];
  subCategorys_list = [];
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private manageCategoryId: string;


constructor(
  public manageCategorysService: ManageCategorysService,
  public categorysService: CategorysService,
  public subCategorysService: SubCategorysService,
  public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      category: new FormControl(null, { validators: [Validators.required] }),
      subCategory: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('manageCategoryId')) {
        this.mode = 'edit';
        this.manageCategoryId = paramMap.get('manageCategoryId');
        this.isLoading = true;
        this.manageCategorysService.getManageCategory(this.manageCategoryId).subscribe(manageCategoryData => {
          this.onChangeCategory(manageCategoryData.category);
          this.isLoading = false;
          this.manageCategory = {
            id: manageCategoryData._id,
            category: manageCategoryData.category,
            subCategory: manageCategoryData.subCategory
          };
          this.form.setValue({
            category: this.manageCategory.category,
            subCategory: this.manageCategory.subCategory
          });
        });
      } else {
        this.mode = 'create';
        this.manageCategoryId = null;
      }
    });


    this.categorysService.getCategorysList().subscribe(categoryData => {
      this.categorys_list = categoryData.categorys;
    });
  }


  onChangeCategory(categoryId: string) {
    if (categoryId) {
      this.subCategorysService.getSubCategoryByCategoryId(categoryId).subscribe(
        subCategorydata => {
          this.subCategorys_list = [];
          this.subCategorys_list = subCategorydata.subCategorys;
        }
      );
    } else {
      this.subCategorys_list = [];
    }
  }


  onSaveManageCategory() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.manageCategorysService.addManageCategory(
        this.form.value.category,
        this.form.value.subCategory
      );
    } else {
      this.manageCategorysService.updateManageCategory(
        this.manageCategoryId,
        this.form.value.category,
        this.form.value.subCategory
      );
    }
    this.form.reset();
  }





}
