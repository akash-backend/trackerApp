import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JournalForm1RoutingModule } from './journalForm1-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { MatProgressSpinnerModule, MatPaginatorModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';
import {ModalModule} from 'ngx-bootstrap/modal';




@NgModule({
  imports: [
    CommonModule,
    JournalForm1RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ModalModule.forRoot()
  ],
  declarations: [CreateComponent, ListComponent, NavigationComponent],
  providers: [],
  exports: [],
})

export class JournalForm1Module { }
