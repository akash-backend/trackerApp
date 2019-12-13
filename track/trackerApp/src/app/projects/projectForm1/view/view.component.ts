import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap} from '@angular/router';
import {ConstructionsService} from '../../../service/constructions.service';
import {ConstructionView} from '../../../model/constructionView.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  id: string;
  name: string;
  street: string;
  azHMdFDeptIV: string;
  projectNrPartner: string;
  device: string;
  recordingDate: string;
  user: string;
  location: string;
  ressort: string;
  section: string;
  product: string;
  interiorRef: string;
  title: string;
  referenceToConstructionMeasure: string;
  relevantForMFP: boolean;
  selectedPrograms: string;
  selectedFeeds: string;
  constructionName: string;
  ActionCoordinator: string;


  constructionId: string;
  isLoading = false;
  constructor(
    public constructionsService: ConstructionsService,
    public route: ActivatedRoute,
    ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.constructionId = paramMap.get('constructionId');
      this.isLoading  = true;

      this.constructionsService.getConstructionView(this.constructionId).subscribe(constructionData => {
        this.isLoading = false;
        this.id = constructionData.construction_list._id;
        this.name = constructionData.construction_list.name;
        this.street = constructionData.construction_list.street;
        this.azHMdFDeptIV = constructionData.construction_list.azHMdFDeptIV;
        this.projectNrPartner = constructionData.construction_list.projectNrPartner;
        this.ActionCoordinator = constructionData.construction_list.ActionCoordinator;
        this.device = constructionData.construction_list.device;
        this.recordingDate = constructionData.construction_list.recordingDate;
        this.user = constructionData.construction_list.user.name;
        this.location = constructionData.construction_list.location.site_name;
        this.ressort = constructionData.construction_list.ressort.name;
        this.section = constructionData.construction_list.section.name;
        this.product = constructionData.construction_list.product.name;
        this.title = constructionData.construction_list.title.name;
        this.interiorRef = constructionData.construction_list.interiorRef;
        this.referenceToConstructionMeasure = constructionData.construction_list.referenceToConstructionMeasure;
        this.relevantForMFP = constructionData.construction_list.relevantForMFP;
        this.selectedPrograms = constructionData.program_list;
        this.selectedFeeds = constructionData.feed_list;

        if (constructionData.construction_list.device) {
          this.constructionName = constructionData.construction_list.constructionName.name;
        }
      });
    });
  }

}
