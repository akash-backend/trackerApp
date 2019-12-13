import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { User } from '../../model/user.model';
import { UsersService } from '../../service/users.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = false;
  totalUsers = 0;
  usersPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private usersSub: Subscription;

  public popoverTitle: string = 'User Delete';
  public popoverMessage: string = 'Diese Daten können nicht gelöscht werden, da sie noch in Verwendung sind.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;

  constructor(public usersService: UsersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers(this.usersPerPage, this.currentPage);
    this.usersSub = this.usersService.getUsersUpdateListener()
    .subscribe((userData: {users: User[], userCount: number})=>{
        this.isLoading = false;
        this.totalUsers = userData.userCount;
        this.users = userData.users;
        console.log(this.users);
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData.pageIndex);
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    console.log(this.currentPage);
    this.usersService.getUsers(this.usersPerPage, this.currentPage);
  }

  onDelete(userId: string) {
    this.isLoading = true;
    this.usersService.deleteUser(userId).subscribe(() => {
      this.usersService.getUsers(this.usersPerPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

}
