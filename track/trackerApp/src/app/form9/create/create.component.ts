import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Subscription} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { User } from '../../model/user.model';
import { Investment } from '../../model/investment.model';

import { InvestmentsService } from '../../service/investment.service';
import { UsersService } from '../../service/users.service';

import { InvestmentProgramsService } from '../../service/investmentProgram.service';
import {InvestmentProgram} from '../../model/investmentProgram.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  investmentProgram: InvestmentProgram;
  users_list: User[] = [];
  investments_list: Investment[] = [];
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private investmentProgramId: string;



  constructor(
      public usersService: UsersService,
      public investmentsService: InvestmentsService,
      public investmentProgramsService: InvestmentProgramsService,
      public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      investment_program_name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
      user: new FormControl(null, { validators: [Validators.required] }),
      amount: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('^[0-9]*$')]
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('investmentProgramId')) {
        this.mode = 'edit';
        this.investmentProgramId = paramMap.get('investmentProgramId');
        this.isLoading = true;
        this.investmentProgramsService.getInvestmentProgram(this.investmentProgramId).subscribe(investmentProgramData => {
          this.isLoading = false;
          this.investmentProgram = {
            id: investmentProgramData._id,
            investment_program_name: investmentProgramData.investment_program_name,
            user: investmentProgramData.user,
            amount: investmentProgramData.amount
          };
          this.form.setValue({
            investment_program_name: this.investmentProgram.investment_program_name,
            user: this.investmentProgram.user,
            amount: this.investmentProgram.amount
          });
        });
      } else {
        this.mode = 'create';
        this.investmentProgramId = null;
      }
    });


    this.usersService.getUsersList().subscribe(userData => {
      this.users_list = userData.users;
    });


    this.investmentsService.getInvestmentsList().subscribe(investmentData => {
      this.investments_list = investmentData.investments;
    });

  }

  onSaveInvestmentProgram() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.investmentProgramsService.addInvestmentProgram(
        this.form.value.investment_program_name,
        this.form.value.user,
        this.form.value.amount

      );
    } else {
      this.investmentProgramsService.updateInvestmentProgram(
        this.investmentProgramId,
        this.form.value.investment_program_name,
        this.form.value.user,
        this.form.value.amount
      );
    }
    this.form.reset();
  }
}
