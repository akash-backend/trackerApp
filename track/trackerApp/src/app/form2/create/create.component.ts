import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Subscription} from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { User } from '../../model/user.model';
import { UsersService } from '../../service/users.service';

import {LocationsService} from '../../service/loaction.service';
import {LocationAdd} from '../../model/locationAdd.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  location: LocationAdd;
  users_list: User[] = [];
  isLoading = false;
  form: FormGroup;
  private mode = "create";
  private locationId: string;



  constructor(public usersService: UsersService,public locationsService: LocationsService,public route: ActivatedRoute){}

  ngOnInit() {
    this.form = new FormGroup({
      place: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
      site_name: new FormControl(null, { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)] }),
      user: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('locationId')) {
        this.mode = "edit";
        this.locationId = paramMap.get("locationId");
        this.isLoading = true;
        this.locationsService.getLocation(this.locationId).subscribe(locationData => {
          this.isLoading = false;
          this.location = {
            id: locationData._id,
            user: locationData.user,
            site_name: locationData.site_name,
            place: locationData.place,
          };
          this.form.setValue({
            user: this.location.user,
            site_name: this.location.site_name,
            place: this.location.place
          });
        });
      } else {
        this.mode = 'create';
        this.locationId = null;
      }
    });


    this.usersService.getUsersList().subscribe(userData => {
      this.users_list = userData.users;
    });
  }

  onSaveLocation() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.locationsService.addLocation(
        this.form.value.user,
        this.form.value.site_name,
        this.form.value.place,

      );
    } else {
      this.locationsService.updateLocation(
        this.locationId,
        this.form.value.user,
        this.form.value.site_name,
        this.form.value.place
      );
    }
    this.form.reset();
  }
}
