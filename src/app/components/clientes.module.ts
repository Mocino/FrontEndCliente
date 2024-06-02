import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClienteAgregarComponent } from './cliente/cliente-agregar/cliente-agregar.component';
import { ClienteListaComponent } from './cliente/cliente-lista/cliente-lista.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { ClienteEliminarComponent } from './cliente/cliente-eliminar/cliente-eliminar.component';
import { ContantoListaComponent } from './contacto/contanto-lista/contanto-lista.component';
import { MetodoPagoListaComponent } from './metodoPago/metodo-pago-lista/metodo-pago-lista.component';
import { ContantoEliminarComponent } from './contacto/contanto-eliminar/contanto-eliminar.component';
import { MetodoPagoEliminarComponent } from './metodoPago/metodo-pago-eliminar/metodo-pago-eliminar.component';
import { ClienteAgregarAdminComponent } from './cliente/cliente-agregar-admin/cliente-agregar-admin.component';
import { ContactoAgregarComponent } from './contacto/contacto-agregar/contacto-agregar.component';
import { MetodoPagoAgregarComponent } from './metodoPago/metodo-pago-agregar/metodo-pago-agregar.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ClienteComponent } from './cliente/cliente-separado/cliente/cliente.component';
import { ContactosComponent } from './cliente/cliente-separado/contactos/contactos.component';
import { MetodosPagoComponent } from './cliente/cliente-separado/metodos-pago/metodos-pago.component';


@NgModule({
  declarations: [
    ClienteAgregarComponent,
    ClienteListaComponent,
    ClienteEliminarComponent,
    ClienteAgregarAdminComponent,

    ContantoListaComponent,
    ContantoEliminarComponent,
    ContactoAgregarComponent,

    MetodoPagoListaComponent,
    MetodoPagoEliminarComponent,
    MetodoPagoAgregarComponent,
    ClienteComponent,
    ContactosComponent,
    MetodosPagoComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule
  ],
  exports:[
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule
  ]
})

export class ClientesModule { }
