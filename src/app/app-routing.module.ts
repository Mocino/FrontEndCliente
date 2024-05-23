import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteListaComponent } from './components/cliente/cliente-lista/cliente-lista.component';

//primero las rutas
//
const routes: Routes = [
  { path: 'listaClientes', component: ClienteListaComponent},
  { path: '', redirectTo: 'listaClientes', pathMatch: 'full'},
  { path: '**', redirectTo: 'listaClientes' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
