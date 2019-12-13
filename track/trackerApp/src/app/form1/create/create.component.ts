import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Subscription} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { User } from '../../model/user.model';
import { UsersService } from '../../service/users.service';

import {RessortsService} from '../../service/ressorts.service';
import {Ressort} from '../../model/ressort.model';
import { UserAdd } from 'src/app/model/userAdd.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  user: UserAdd;
  ressorts_list: Ressort[] = [];
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private userId: string;



  constructor(public usersService: UsersService,public ressortsService: RessortsService,public route: ActivatedRoute){}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
      ressort: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("userId")) {
        this.mode = "edit";
        this.userId = paramMap.get("userId");
        this.isLoading = true;
        this.usersService.getUser(this.userId).subscribe(userData => {
          this.isLoading = false;
          this.user = {
            id: userData._id,
            name: userData.name,
            ressort: userData.ressort
          };
          this.form.setValue({
            name: this.user.name,
            ressort: this.user.ressort
          });
        });
      }
      else
      {
        this.mode = "create";
        this.userId = null;
      }
    });


    this.ressortsService.getRessortsList().subscribe(ressortData => {
      this.ressorts_list = ressortData.ressorts;
    });
  }

  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.usersService.addUser(
        this.form.value.name,
        this.form.value.ressort
      );
    } else {
      this.usersService.updateUser(
        this.userId,
        this.form.value.name,
        this.form.value.ressort
      );
    }
    this.form.reset();
  }





}
