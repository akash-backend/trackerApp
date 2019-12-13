import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import {InvestmentsService} from '../../service/investment.service';
import { Investment } from '../../model/investment.model';
import { InvestmentAdd } from '../../model/investmentAdd.model';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  investment: InvestmentAdd;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private investmentId: string;

  constructor(public investmentsService: InvestmentsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
      total_budget: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')]
      }),
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('investmentId')) {
        this.mode = 'edit';
        this.investmentId = paramMap.get('investmentId');
        this.isLoading  = true;

        this.investmentsService.getInvestment(this.investmentId).subscribe(investmentData => {
          this.isLoading = false;
          this.investment = {
            id: investmentData._id,
            name: investmentData.name,
            total_budget: investmentData.total_budget
          };
          this.form.setValue({
            name: this.investment.name,
            total_budget: this.investment.total_budget
          });
        });
      } else {
        this.mode = 'create';
        this.investmentId = null;
      }
    });
  }

  onSaveInvestment() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.investmentsService.addInvestment(
        this.form.value.name,
        this.form.value.total_budget
      );
    } else {
      this.investmentsService.updateInvestment(
        this.investmentId,
        this.form.value.name,
        this.form.value.total_budget
      );
    }
    this.form.reset();
  }

}
