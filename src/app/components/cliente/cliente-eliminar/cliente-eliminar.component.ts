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
    @Inject(MAT_DIALOG_DATA) public data: { tipo: string, item: any }
  ){}


  /**
   * dialog para confirmar la eliminacion Cliente.
   */
  confirmarEliminar() {
    this.dialogReferencia.close("Eliminar");
  }
}
