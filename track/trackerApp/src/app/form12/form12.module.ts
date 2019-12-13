import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Form12RoutingModule } from './form12-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { MatProgressSpinnerModule, MatPaginatorModule } from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';




@NgModule({
  imports: [
    CommonModule,
    Form12RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [CreateComponent, ListComponent, NavigationComponent],
  providers: [],
  exports: [],
})


export class Form12Module { }
