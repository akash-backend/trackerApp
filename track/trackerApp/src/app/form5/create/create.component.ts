import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import {TitlesService} from '../../service/titles.service';
import { Title } from '../../model/title.model';
import { TitleAdd} from '../../model/titleAdd.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  title: TitleAdd;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private titleId: string;

  constructor(public titlesService: TitlesService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)]
      }),
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('titleId')){
        this.mode = 'edit';
        this.titleId = paramMap.get('titleId');
        this.isLoading  = true;

        this.titlesService.getTitle(this.titleId).subscribe(titleData => {
          this.isLoading = false;
          this.title = {
            id: titleData._id,
            name: titleData.name
          };
          this.form.setValue({
            name: this.title.name
          });
        });
      } else {
        this.mode = 'create';
        this.titleId = null;
      }
    });
  }

  onSaveTitle() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.titlesService.addTitle(
        this.form.value.name
      );
    } else {
      this.titlesService.updateTitle(
        this.titleId,
        this.form.value.name
      );
    }
    this.form.reset();
  }

}
