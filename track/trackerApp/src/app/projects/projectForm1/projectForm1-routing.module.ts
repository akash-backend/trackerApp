import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';


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
          path: 'edit/:constructionId',
          component: CreateComponent,
         },
         {
          path: 'view/:constructionId',
          component: ViewComponent,
         }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectForm1RoutingModule { }
