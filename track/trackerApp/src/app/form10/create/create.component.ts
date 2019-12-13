import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Subscription} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';


import { Plan } from '../../model/plan.model';
import { PlansService } from '../../service/plan.service';

import { SectionPlansService } from '../../service/sectionPlan.service';
import {SectionPlan} from '../../model/sectionPlan.model';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  years = [];
  yearCount: number;
  sectionPlan: SectionPlan;
  plans_list: Plan[] = [];
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private sectionPlanId: string;

  constructor(
    public plansService: PlansService,
    public sectionPlansService: SectionPlansService,
    public route: ActivatedRoute) {}

ngOnInit() {
  this.form = new FormGroup({
    section: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
    }),
    year: new FormControl(null, { validators: [Validators.required] }),
    amount: new FormControl(null, {
      validators: [Validators.required, Validators.pattern('^[0-9]*$')]
    }),
  });
  this.route.paramMap.subscribe((paramMap: ParamMap) => {
    if (paramMap.has('sectionPlanId')) {
      this.mode = 'edit';
      this.sectionPlanId = paramMap.get('sectionPlanId');
      this.isLoading = true;
      this.sectionPlansService.getSectionPlan(this.sectionPlanId).subscribe(sectionPlanData => {
        this.isLoading = false;

        this.sectionPlan = {
          id: sectionPlanData._id,
          section: sectionPlanData.section,
          year: sectionPlanData.year,
          amount: sectionPlanData.amount
        };
        this.form.setValue({
          section: this.sectionPlan.section,
          year: this.sectionPlan.year,
          amount: this.sectionPlan.amount
        });
      });
    } else {
      this.mode = 'create';
      this.sectionPlanId = null;
    }
  });



  this.plansService.getPlansList().subscribe(planData => {
    this.plans_list = planData.plans;
  });

  for (this.yearCount = 2018; this.yearCount <= 2038; this.yearCount++) {
    this.years.push(this.yearCount);
}

}

onSaveSectionPlan() {
  if (this.form.invalid) {
    return;
  }
  this.isLoading = true;
  if (this.mode === 'create') {
    this.sectionPlansService.addSectionPlan(
      this.form.value.section,
      this.form.value.year,
      this.form.value.amount

    );
  } else {
    this.sectionPlansService.updateSectionPlan(
      this.sectionPlanId,
      this.form.value.section,
      this.form.value.year,
      this.form.value.amount
    );
  }
  this.form.reset();
}

}
