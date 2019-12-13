import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import {PlansService} from '../../service/plan.service';
import { Plan } from '../../model/plan.model';
import { PlanAdd } from '../../model/planAdd.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {



  plan: PlanAdd;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private planId: string;

  constructor(public plansService: PlansService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
      section: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')]
      }),
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('planId')) {
        this.mode = 'edit';
        this.planId = paramMap.get('planId');
        this.isLoading  = true;

        this.plansService.getPlan(this.planId).subscribe(planData => {
          this.isLoading = false;
          this.plan = {
            id: planData._id,
            name: planData.name,
            section: planData.section
          };
          this.form.setValue({
            name: this.plan.name,
            section: this.plan.section
          });
        });
      } else {
        this.mode = 'create';
        this.planId = null;
      }
    });
  }

  onSavePlan() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.plansService.addPlan(
        this.form.value.name,
        this.form.value.section
      );
    } else {
      this.plansService.updatePlan(
        this.planId,
        this.form.value.name,
        this.form.value.section
      );
    }
    this.form.reset();
  }

}
