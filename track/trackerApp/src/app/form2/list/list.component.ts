import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Location } from '../../model/location.model';
import { LocationsService } from '../../service/loaction.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  locations: Location[] = [];
  isLoading = false;
  totalLocations = 0;
  locationsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private locationsSub: Subscription;

  public popoverTitle: string = 'Location Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public locationsService: LocationsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.locationsService.getLocations(this.locationsPerPage, this.currentPage);
    this.locationsSub = this.locationsService.getLocationsUpdateListener()
    .subscribe((locationData: {locations: Location[], locationCount: number})=>{
        this.isLoading = false;
        this.totalLocations = locationData.locationCount;
        this.locations = locationData.locations;
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData.pageIndex);
    this.currentPage = pageData.pageIndex + 1;
    this.locationsPerPage = pageData.pageSize;
    console.log(this.currentPage);
    this.locationsService.getLocations(this.locationsPerPage, this.currentPage);
  }

  onDelete(locationId: string) {
    this.isLoading = true;
    this.locationsService.deleteLocation(locationId).subscribe(() => {
      this.locationsService.getLocations(this.locationsPerPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.locationsSub.unsubscribe();
  }

}
