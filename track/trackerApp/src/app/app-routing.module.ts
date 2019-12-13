import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




const routes: Routes = [
  {
    path: '',
    loadChildren: './form1/form1.module#Form1Module'
  },
  {
    path: 'form2',
    loadChildren: './form2/form2.module#Form2Module'
  },
  {
    path: 'form3',
    loadChildren: './form3/form3.module#Form3Module'
  },
  {
    path: 'form4',
    loadChildren: './form4/form4.module#Form4Module'
  },
  {
    path: 'form5',
    loadChildren: './form5/form5.module#Form5Module'
  },
  {
    path: 'form6',
    loadChildren: './form6/form6.module#Form6Module'
  },
  {
    path: 'form7',
    loadChildren: './form7/form7.module#Form7Module'
  },
  {
    path: 'form8',
    loadChildren: './form8/form8.module#Form8Module'
  },
  {
    path: 'form9',
    loadChildren: './form9/form9.module#Form9Module'
  },
  {
    path: 'form10',
    loadChildren: './form10/form10.module#Form10Module'
  },
  {
    path: 'form11',
    loadChildren: './form11/form11.module#Form11Module'
  },
  {
    path: 'form12',
    loadChildren: './form12/form12.module#Form12Module'
  },
  {
    path: 'form13',
    loadChildren: './form13/form13.module#Form13Module'
  },
  {
    path: 'projectForm1',
    loadChildren: './projects/projectForm1/projectForm1.module#ProjectForm1Module'
  },
  {
    path: 'journalForm1',
    loadChildren: './journal/journalForm1/journalForm1.module#JournalForm1Module'
  },
  {
    path: 'journalForm2',
    loadChildren: './journal/journalForm2/journalForm2.module#JournalForm2Module'
  },
  {
    path: 'journalForm3',
    loadChildren: './journal/journalForm3/journalForm3.module#JournalForm3Module'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
