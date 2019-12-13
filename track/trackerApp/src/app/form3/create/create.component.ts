import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import {RessortsService} from '../../service/ressorts.service';
import { Ressort } from '../../model/ressort.model';
import { RessortAdd } from '../../model/ressortAdd.model';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {


  ressort: RessortAdd;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private ressortId: string;

  constructor(public ressortsService: RessortsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('ressortId')){
        this.mode = 'edit';
        this.ressortId = paramMap.get('ressortId');
        this.isLoading  = true;

        this.ressortsService.getRessort(this.ressortId).subscribe(ressortData => {
          this.isLoading = false;
          this.ressort = {
            id: ressortData._id,
            name:ressortData.name
          };
          this.form.setValue({
            name: this.ressort.name
          });
        });
      } else {
        this.mode = 'create';
        this.ressortId = null;
      }
    });
  }



  onSaveRessort() {
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.ressortsService.addRessort(
        this.form.value.name
      );
    } else {
      this.ressortsService.updateRessort(
        this.ressortId,
        this.form.value.name
      );
    }
    this.form.reset();
  }

}
