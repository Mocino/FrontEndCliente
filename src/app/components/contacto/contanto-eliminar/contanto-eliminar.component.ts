import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contacto } from 'src/app/interfaces/Cliente';
import { ContantoListaComponent } from '../contanto-lista/contanto-lista.component';

@Component({
  selector: 'app-contanto-eliminar',
  templateUrl: './contanto-eliminar.component.html',
  styleUrls: ['./contanto-eliminar.component.css']
})
export class ContantoEliminarComponent {
  constructor(
    private dialogReferencia: MatDialogRef<ContantoListaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Contacto
  ){}

  /**
   * dialog para confirmar la eliminacion de Contacto.
   */
  confirmarEliminar(){
    if(this.dataCliente){
      this.dialogReferencia.close("Eliminar")
    }
  }
}
