import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';

import {ConstructionsService} from '../../../service/constructions.service';
import { Construction } from '../../../model/construction.model';
import { ConstructionAdd } from '../../../model/constructionAdd.model';

import { User } from '../../../model/user.model';
import { UsersService } from '../../../service/users.service';

import { Location } from '../../../model/location.model';
import { LocationsService } from '../../../service/loaction.service';

import { Ressort } from '../../../model/ressort.model';
import { RessortsService } from '../../../service/ressorts.service';

import { Plan } from '../../../model/plan.model';
import { PlansService } from '../../../service/plan.service';

import {Title} from '../../../model/title.model';
import {TitlesService} from '../../../service/titles.service';

import {Feed} from '../../../model/feed.model';
import {FeedsService} from '../../../service/feeds.service';

import {Product} from '../../../model/product.model';
import {ProductsService} from '../../../service/product.service';

import {Investment} from '../../../model/investment.model';
import {InvestmentsService} from '../../../service/investment.service';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../shared/format-datepicker';


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


  construction: ConstructionAdd;
  isLoading = false;
  form: FormGroup;
  users_list: User[] = [];
  feeds_list: Feed[] = [];
  locations_list: Location[] = [];
  ressorts_list: Ressort[] = [];
  plans_list: Plan[] = [];
  titles_list: Title[] = [];
  products_list: Product[] = [];
  investments_list: Investment[] = [];
  constructionShow_list: Investment[] = [];
  private mode = 'create';
  private constructionId: string;
  checkProject = 0;


  dropdownList = [];
  selectedItems = [];
  selectedPrograms = [];
  selectedFeeds = [];
  dropdownSettings = {};
  feedDropdownSettings = {};
  investmentDropdownSettings = {};

  constructor(
    public constructionsService: ConstructionsService,
    public route: ActivatedRoute,
    public locationsService: LocationsService,
    public usersService: UsersService,
    public ressortsService: RessortsService,
    public plansService: PlansService,
    public titlesService: TitlesService,
    public feedsService: FeedsService,
    public productsService: ProductsService,
    public investmentsService: InvestmentsService,
    ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      ActionCoordinator: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      projectNrPartner: new FormControl(null, {}),
      device: new FormControl(null, {}),
      azHMdFDeptIV: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      user: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      location: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      ressort: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      section: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      programme: new FormControl(null, {
        validators: [Validators.required]
      }),
      feed: new FormControl(null, {
        validators: [Validators.required]
      }),
      recordingDate: new FormControl(null, {}),
      product: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3) , Validators.maxLength(255)]
      }),
      interiorRef: new FormControl(null, { }),
      referenceToConstructionMeasure: new FormControl(null, {}),
      relevantForMFP: new FormControl(null, {}),
      street: new FormControl(null, {}),
      constructionName: new FormControl(null, {}),
    });

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


    this.feedDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'donor',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


    this.investmentDropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('constructionId')) {
        this.mode = 'edit';
        this.constructionId = paramMap.get('constructionId');
        this.isLoading  = true;

        this.constructionsService.getConstruction(this.constructionId).subscribe(constructionData => {
          this.isLoading = false;
          this.construction = {
            id: constructionData.construction_list._id,
            name: constructionData.construction_list.name,
            street: constructionData.construction_list.street,
            azHMdFDeptIV: constructionData.construction_list.azHMdFDeptIV,
            projectNrPartner: constructionData.construction_list.projectNrPartner,
            device: constructionData.construction_list.device,
            ActionCoordinator: constructionData.construction_list.ActionCoordinator,
            recordingDate: constructionData.construction_list.recordingDate,
            user: constructionData.construction_list.user,
            location: constructionData.construction_list.location,
            ressort: constructionData.construction_list.ressort,
            section: constructionData.construction_list.section,
            product: constructionData.construction_list.product,
            interiorRef: constructionData.construction_list.interiorRef,
            title: constructionData.construction_list.title,
            programme: constructionData.program_list.programme,
            feed: constructionData.construction_list.feed,
            relevantForMFP: constructionData.construction_list.relevantForMFP,
            constructionName: constructionData.construction_list.constructionName,


          };

          console.log(this.construction);

          this.selectedPrograms = constructionData.program_list;
          this.selectedFeeds = constructionData.feed_list;

          if (this.construction.device) {
            this.checkProject = 1;
          }



          this.form.patchValue({
            name: this.construction.name,
            street: this.construction.street,
            azHMdFDeptIV: this.construction.azHMdFDeptIV,
            projectNrPartner: this.construction.projectNrPartner,
            device: this.construction.device,
            ActionCoordinator: this.construction.ActionCoordinator,
            recordingDate: this.construction.recordingDate,
            user: this.construction.user,
            location: this.construction.location,
            ressort: this.construction.ressort,
            section: this.construction.section,
            product: this.construction.product,
            interiorRef: this.construction.interiorRef,
            title: this.construction.title,
            relevantForMFP: this.construction.relevantForMFP,
            constructionName: this.construction.constructionName,
          });
        });

        this.constructionsService.getConstructionsListByID(this.constructionId).subscribe(constructShowData => {
          this.constructionShow_list = constructShowData.constructions;
        });
      } else {
        this.mode = 'create';
        this.constructionId = null;
        this.constructionsService.getConstructionsList().subscribe(constructShowData => {
          this.constructionShow_list = constructShowData.constructions;
        });
      }
    });

    this.usersService.getUsersList().subscribe(userData => {
      this.users_list = userData.users;
    });


    this.locationsService.getLocationsList().subscribe(locationData => {
      this.locations_list = locationData.locations;
    });

    this.ressortsService.getRessortsList().subscribe(ressortData => {
      this.ressorts_list = ressortData.ressorts;
    });

    this.plansService.getPlansList().subscribe(planData => {
      this.plans_list = planData.plans;
    });


    this.titlesService.getTitlesList().subscribe(titleData => {
      this.titles_list = titleData.titles;
    });


    this.feedsService.getFeedsList().subscribe(feedData => {
      this.feeds_list = feedData.feeds;
    });

    this.productsService.getProductsList().subscribe(productData => {
      this.products_list = productData.products;
    });

    this.investmentsService.getInvestmentsList().subscribe(productData => {
      this.investments_list = productData.investments;
    });


  }


  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onInvestmentSelect(item: any) {
    console.log(item);
  }
  onInvestmentSelectAll(items: any) {
    console.log(items);
  }

  onCheck(ev) {
    if (ev.target.checked) {
      this.checkProject = 1;
    } else {
      this.checkProject = 0;
    }
  }



  onSaveConstruction() {
    if (this.form.invalid) {
      return;
    } else if (this.form.value.device) {
        if (!this.form.value.constructionName) {
          return;
        }
    }

    console.log("start");
    console.log(this.form.value);
    console.log("end");
    this.isLoading = true;
    if (this.mode === 'create') {
      this.constructionsService.addConstruction(
        this.form.value.name,
        this.form.value.street,
        this.form.value.azHMdFDeptIV,
        this.form.value.projectNrPartner,
        this.form.value.device,
        this.form.value.ActionCoordinator,
        this.form.value.recordingDate,
        this.form.value.user,
        this.form.value.location,
        this.form.value.ressort,
        this.form.value.section,
        this.form.value.product,
        this.form.value.interiorRef,
        this.form.value.title,
        this.form.value.programme,
        this.form.value.feed,
        this.form.value.relevantForMFP,
        this.form.value.constructionName
      );
    } else {
      this.constructionsService.updateConstruction(
        this.constructionId,
        this.form.value.name,
        this.form.value.street,
        this.form.value.azHMdFDeptIV,
        this.form.value.projectNrPartner,
        this.form.value.device,
        this.form.value.ActionCoordinator,
        this.form.value.recordingDate,
        this.form.value.user,
        this.form.value.location,
        this.form.value.ressort,
        this.form.value.section,
        this.form.value.product,
        this.form.value.interiorRef,
        this.form.value.title,
        this.form.value.programme,
        this.form.value.feed,
        this.form.value.relevantForMFP,
        this.form.value.constructionName
      );
    }
    this.form.reset();
  }

}
