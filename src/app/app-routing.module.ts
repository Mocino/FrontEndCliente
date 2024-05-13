import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteListaComponent } from './components/cliente/cliente-lista/cliente-lista.component';

const routes: Routes = [
  { path: '', redirectTo: 'listaClientes', pathMatch: 'full'},
  { path: 'listaClientes', component: ClienteListaComponent},
  { path: '**', redirectTo: 'listaClientes' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
