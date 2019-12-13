import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectForm1RoutingModule } from './projectForm1-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { MatProgressSpinnerModule, MatPaginatorModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewComponent } from './view/view.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';


@NgModule({
  imports: [
    CommonModule,
    ProjectForm1RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    NgMultiSelectDropDownModule.forRoot()

  ],
  declarations: [CreateComponent, ListComponent, NavigationComponent, ViewComponent],
  providers: [],
  exports: [],
})

export class ProjectForm1Module { }
