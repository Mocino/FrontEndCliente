import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteAgregarComponent } from '../cliente-agregar/cliente-agregar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from 'src/app/services/Cliente.service';
import { Cliente } from 'src/app/interfaces/Cliente';

@Component({
  selector: 'app-cliente-eliminar',
  templateUrl: './cliente-eliminar.component.html',
  styleUrls: ['./cliente-eliminar.component.css']
})
export class ClienteEliminarComponent {

  constructor(
    private dialogReferencia: MatDialogRef<ClienteAgregarComponent>,
    private _snackBar: MatSnackBar,
    private _clienteServicio: ClienteService,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente
  ){}

  confirmarEliminar(){
    if(this.dataCliente){
      this.dialogReferencia.close("Eliminar")
    }
  }
}
