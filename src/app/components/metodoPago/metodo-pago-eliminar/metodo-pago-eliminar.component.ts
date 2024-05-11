import { Component, Inject } from '@angular/core';
import { MetodoPagoListaComponent } from '../metodo-pago-lista/metodo-pago-lista.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MetodoDePago } from 'src/app/interfaces/Cliente';

@Component({
  selector: 'app-metodo-pago-eliminar',
  templateUrl: './metodo-pago-eliminar.component.html',
  styleUrls: ['./metodo-pago-eliminar.component.css']
})
export class MetodoPagoEliminarComponent {
  constructor(
    private dialogReferencia: MatDialogRef<MetodoPagoListaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCliente: MetodoDePago
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
