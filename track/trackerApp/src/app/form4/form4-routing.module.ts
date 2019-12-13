import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '',
    children: [
         {
            path: 'add',
            component: CreateComponent
         },
         {
          path: 'view',
          component: ListComponent,
         },
         {
          path: 'edit/:feedId',
          component: CreateComponent,
         }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Form4RoutingModule { }
