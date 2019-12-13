import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JournalForm3RoutingModule } from './journalForm3-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { MatProgressSpinnerModule, MatPaginatorModule } from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';




@NgModule({
  imports: [
    CommonModule,
    JournalForm3RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  declarations: [CreateComponent, ListComponent, NavigationComponent],
  providers: [],
  exports: [],
})

export class JournalForm3Module { }
