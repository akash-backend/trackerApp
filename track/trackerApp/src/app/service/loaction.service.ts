import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {Location} from '../model/location.model';
import {LocationAdd} from '../model/locationAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/locationApi';

@Injectable({providedIn: 'root'})
export class LocationsService {
    private locations: Location[] = [];
    private locationsUpdated = new Subject<{ locations: Location[]; locationCount: number }>();

    constructor(private http: HttpClient, private router: Router) {}

    getLocations(locationsPerPage: number, currentPage: number){
      const queryParams = `?pagesize=${locationsPerPage}&page=${currentPage}`;
      this.http
        .get<{ message: string; locations: any; maxLocations: number }>(
          API_URL + '/location_list' + queryParams
        )
      .pipe(map((locationData) => {
        return{
          locations: locationData.locations.map(location => {
          return {
            user: location.user.name,
            site_name: location.site_name,
            place: location.place,
            id: location._id,
            status: location.status
          };
        }),
        maxLocations: locationData.maxLocations
      };
      })
      )
      .subscribe(transformedLocationData => {
        this.locations = transformedLocationData.locations;
        this.locationsUpdated.next({
          locations: [...this.locations],
          locationCount: transformedLocationData.maxLocations
        });
      });
    }


    getLocationsList() {
      return this.http.get<{ message: string; locations: any; maxLocations: number}>(
          API_URL + '/location_list'
      );
  }

    getLocationsUpdateListener() {
        return this.locationsUpdated.asObservable();
      }

      getLocation(id: string) {
        return this.http.get<{ _id: string; user: string; site_name: string; place: string; }>(
          API_URL + '/location_detail/' + id
        );
      }

      addLocation(user: string, site_name: string, place: string) {
        const locationData: LocationAdd = {id: null, user:user ,site_name:site_name,place:place };


        this.http
          .post<{ message: string; location: Location }>(
            API_URL + '/add_location/',
            locationData
          )
          .subscribe(responseData => {
            console.log(responseData);
            this.router.navigate(['/form2/view']);
          });
      }

      deleteLocation(locationId: string) {
        return this.http
        .get(API_URL + '/locations/' + locationId);
      }

      updateLocation(id: string, user: string, site_name: string, place: string) {
        const location: LocationAdd = { id: id, user:user ,site_name:site_name,place:place  };
        this.http
          .put(API_URL + '/location_edit/' + id, location)
          .subscribe(response => {
            this.router.navigate(['/form2/view']);
          });
      }
}
