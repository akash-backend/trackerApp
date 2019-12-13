import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import {User} from '../model/user.model';
import {UserAdd} from '../model/userAdd.model';
import { environment } from '../../environments/environment';
const API_URL = environment.apiUrl + '/userApi';

@Injectable({providedIn: 'root'})
export class UsersService {
    private users: User[] = [];
    private usersUpdated = new Subject<{ users: User[]; userCount: number }>();

    constructor(private http: HttpClient, private router: Router) {}

    getUsers(usersPerPage: number, currentPage: number){
      const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
      this.http
        .get<{ message: string; users: any; maxUsers: number }>(
          API_URL + '/user_list' + queryParams
        )
      .pipe(map((userData) => {
        return{
          users: userData.users.map(user => {
          return {
            name: user.name,
            ressort: user.ressort.name,
            id: user._id,
            status: user.status
          };
        }),
        maxUsers: userData.maxUsers
      };
      })
      )
      .subscribe(transformedUserData => {
        this.users = transformedUserData.users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: transformedUserData.maxUsers
        });
      });
    }

    getUsersUpdateListener() {
        return this.usersUpdated.asObservable();
      }

      getUser(id: string) {
        return this.http.get<{ _id: string; name: string; ressort: string }>(
          API_URL + '/user_detail/' + id
        );
      }


      getUsersList(){
        return this.http.get<{ message: string; users: any; maxUsers: number}>(
            API_URL + '/user_list'
        );
    }

      addUser(name: string, ressort: string) {
        const userData: UserAdd = {id: null, name:name ,ressort:ressort };


        this.http
          .post<{ message: string; user: User }>(
            API_URL + '/add_user/',
            userData
          )
          .subscribe(responseData => {
            console.log(responseData);
            this.router.navigate(['/']);
          });
      }

      deleteUser(userId: string) {
        return this.http
        .get(API_URL + '/users/' + userId);
      }

      updateUser(id: string, name: string, ressort: string) {
        const user: UserAdd = { id: id, name: name, ressort: ressort };
        this.http
          .put(API_URL + '/user_edit/' + id, user)
          .subscribe(response => {
            this.router.navigate(['/']);
          });
      }
}
