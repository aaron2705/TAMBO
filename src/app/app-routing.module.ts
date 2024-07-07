import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CompraComponent } from './compra/compra.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'compra', component: CompraComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
