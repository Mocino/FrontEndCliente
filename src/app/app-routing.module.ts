import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';

const routes: Routes = [
  { path: '', redirectTo: 'listaClientes', pathMatch: 'full'},
  { path: 'listaClientes', component: ClientesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
