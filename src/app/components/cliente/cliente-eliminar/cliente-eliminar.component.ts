import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteAgregarComponent } from '../cliente-agregar/cliente-agregar.component';
import { Cliente } from 'src/app/interfaces/Cliente';

@Component({
  selector: 'app-cliente-eliminar',
  templateUrl: './cliente-eliminar.component.html',
  styleUrls: ['./cliente-eliminar.component.css']
})
export class ClienteEliminarComponent {

  constructor(
    private dialogReferencia: MatDialogRef<ClienteAgregarComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente
  ){}


  /**
   * dialog para confirmar la eliminacion Cliente.
   */
  confirmarEliminar(){
    if(this.dataCliente){
      this.dialogReferencia.close("Eliminar")
    }
  }
}
