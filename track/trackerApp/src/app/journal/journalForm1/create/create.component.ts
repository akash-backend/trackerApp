import { Component, OnInit ,TemplateRef} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Subscription} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Journal } from '../../../model/journal.model';
import { JournalsService } from '../../../service/journals.service';

import {ConstructionsService} from '../../../service/constructions.service';
import { Construction } from '../../../model/construction.model';

import { Category } from '../../../model/category.model';
import {CategorysService} from '../../../service/categorys.service';

import { SubCategory } from '../../../model/subcategory.model';
import {SubCategorysService} from '../../../service/subcategorys.service';

import { Plan } from '../../../model/plan.model';
import { PlansService } from '../../../service/plan.service';


import { JournalAdd } from 'src/app/model/journalAdd.model';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../projects/shared/format-datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class CreateComponent implements OnInit {
  journal: JournalAdd;
  constructions_list: Construction[] = [];
  categorys_list: Category[] = [];
  subCategorys_list = [];
  plans_list: Plan[] = [];
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private journalId: string;
  projectName: string;
  interiorRef: string;
  amountValue = 0;
  actulalAmount = 0;
  totlaAmount = 0;
  incrementYearCount = 3;
  modalRef: BsModalRef;
  modalRef1: BsModalRef;
  cashOutflowArray = [];
  public today: number = Date.now();





  constructor(
    public journalsService: JournalsService,
    public constructionsService: ConstructionsService,
    public categorysService: CategorysService,
    public subCategorysService: SubCategorysService,
    public plansService: PlansService,
    private modalService: BsModalService,
    public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      explanation: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(600)]
      }),
      lastChange: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
      construction: new FormControl(null, { validators: [Validators.required] }),
      journaldDate: new FormControl(null, { validators: [Validators.required] }),
      category: new FormControl(null, { validators: [Validators.required] }),
      subCategory: new FormControl(null, { validators: [Validators.required] }),
      plan: new FormControl(null, { validators: [Validators.required] }),
      amountType: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')]
      }),
      actualCost: new FormControl(null, {
        validators: [Validators.pattern('^[0-9]*$')]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('journalId')) {
        this.mode = 'edit';
        this.journalId = paramMap.get('journalId');
        this.isLoading = true;
        this.journalsService.getJournal(this.journalId).subscribe(journalData => {
          this.onChangeCategory(journalData.category);
          this.isLoading = false;
          this.journal = {
            id: journalData._id,
            construction: journalData.construction,
            explanation: journalData.explanation,
            journaldDate: journalData.journaldDate,
            plan: journalData.plan,
            category: journalData.category,
            subCategory: journalData.subCategory,
            amount: journalData.amount,
            actualCost: journalData.actualCost,
            totlaAmount: journalData.totlaAmount,
            amountType: journalData.amountType,
            lastChange: journalData.lastChange,
          };
          this.form.patchValue({
            construction: this.journal.construction,
            explanation: this.journal.explanation,
            journaldDate: this.journal.journaldDate,
            plan: this.journal.plan,
            category: this.journal.category,
            subCategory: this.journal.subCategory,
            amount: this.journal.amount,
            actualCost: this.journal.actualCost,
            totlaAmount: this.journal.totlaAmount,
            amountType: this.journal.amountType,
            lastChange: this.journal.lastChange,
          });

          this.amountValue = this.journal.amount;
          this.actulalAmount = this.journal.actualCost;
          this.totlaAmount  = this.journal.totlaAmount;
        });
      } else {
        this.mode = 'create';
        this.journalId = null;

        this.form.patchValue({
          sum: this.amountValue * 1  + this.actulalAmount * 1
        });
      }
    });





    this.constructionsService.getConstructionsList().subscribe(constructionData => {
      this.constructions_list = constructionData.constructions;
    });

    this.categorysService.getCategorysList().subscribe(categoryData => {
      this.categorys_list = categoryData.categorys;
    });

    this.plansService.getPlansList().subscribe(planData => {
      this.plans_list = planData.plans;
      console.log(this.plans_list);
    });




    this.cashOutflowArray = [
      { item_id: 'previousYear', item_text: 'bis einschl. Vorjahr', value: 0},
      { item_id: 'currentYear', item_text: 'akt. HH-Jahr', value: 0},
      { item_id: 'year1', item_text: '+1', value: 0},
      { item_id: 'year2', item_text: '+2', value: 0},
      { item_id: 'year3', item_text: '+3', value: 0}
    ];

  }


  getTotal() {
    let total = 0;
    for (const cashValue of this.cashOutflowArray) {
      total += parseInt (cashValue.value);
     }
    return total;
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

  onChangeConstruction(constructionId: string) {
    if (constructionId) {
      this.constructionsService.getConstruction(constructionId).subscribe(
        constructionData => {
          this.projectName = constructionData.construction_list.name;
          this.interiorRef = constructionData.construction_list.interiorRef;

        }
      );
    } else {
      this.projectName = '';
    }
  }


  onAddYear() {
    this.incrementYearCount = this.incrementYearCount + 1;
    let increment = this.incrementYearCount;
    this.cashOutflowArray.push({ item_id: 'year' + increment, item_text: '+' + increment, value: 0});
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  public openModal1(template1: TemplateRef<any>) {
    this.modalRef1 = this.modalService.show(template1);
  }

  onSaveJournal() {

    this.totlaAmount = this.amountValue * 1  + this.actulalAmount * 1;
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.journalsService.addJournal(
        this.form.value.construction,
        this.form.value.explanation,
        this.form.value.journaldDate,
        this.form.value.plan,
        this.form.value.category,
        this.form.value.subCategory,
        this.form.value.amount,
        this.form.value.actualCost,
        this.totlaAmount,
        this.form.value.amountType,
        this.form.value.lastChange,
      );
    } else {
      this.journalsService.updateJournal(
        this.journalId,
        this.form.value.construction,
        this.form.value.explanation,
        this.form.value.journaldDate,
        this.form.value.plan,
        this.form.value.category,
        this.form.value.subCategory,
        this.form.value.amount,
        this.form.value.actualCost,
        this.totlaAmount,
        this.form.value.amountType,
        this.form.value.lastChange,
      );
    }
    this.form.reset();
  }





}
