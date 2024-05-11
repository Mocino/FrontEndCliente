import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MetodoDePago } from 'src/app/interfaces/Cliente';
import { MetodoPagoService } from 'src/app/services/metodo-pago.service';
import { MetodoPagoEliminarComponent } from '../metodo-pago-eliminar/metodo-pago-eliminar.component';

@Component({
  selector: 'app-metodo-pago-lista',
  templateUrl: './metodo-pago-lista.component.html',
  styleUrls: ['./metodo-pago-lista.component.css']
})
export class MetodoPagoListaComponent implements OnInit{

  formMetodoPago!:  FormGroup;
  displayedColumns: string[] = ['tipo', 'numero', 'fechaVencimiento', 'nombreTitular', 'acciones'];




  dataSource = new MatTableDataSource<MetodoDePago>();
  showForm: boolean = false;
  metododePagoSeleccionado!: MetodoDePago;

  constructor(
    private dialogReferencia: MatDialogRef<MetodoPagoListaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCliente: MetodoDePago,
    private _metodoPagoService: MetodoPagoService,
    private fb: FormBuilder,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
    this.formMetodoPago = this.fb.group({
      tipo:["", Validators.required],
      numero:["", Validators.required],
      fechaVencimiento:["", Validators.required],
      nombreTitular: ["", Validators.required]
    })
   }

  ngOnInit(): void {
    this.obtenerTipoMetodo(this.dataCliente.idCliente);
  }

  /**
   * Método para obtener los tipos de método de pago del cliente.
   * @param idCliente ID del cliente.
   */
  obtenerTipoMetodo(idCliente: number): void {
    this._metodoPagoService.getMetodosDePagoPorCliente(idCliente)
      .subscribe(tipoMetodo => {
        this.dataSource.data = tipoMetodo;
      });
  }

  /**
   * Método para agregar o editar un método de pago.
   */
  addEditMetodoDePago(){

    const modelo: MetodoDePago = {
      idMetodoPago: 0,
      idCliente: this.dataCliente.idCliente,
      tipo: this.formMetodoPago.value.tipo,
      numero:           this.formMetodoPago.value.numero,
      fechaVencimiento: this.formMetodoPago.value.fechaVencimiento,
      nombreTitular:    this.formMetodoPago.value.nombreTitular,
    }

      if (!this.metododePagoSeleccionado) {

        this._metodoPagoService.AgregarMetodosDePago(this.dataCliente.idCliente, modelo).subscribe({
          next: () => {
            console.log("En crear")
            this.mostrarAlerta("Metodo Pago Creado", "Listo");
            this.dialogReferencia.close("Creado")
          },
          error: () => {
            this.mostrarAlerta("No se pudo crear", "Error")
          }
        });
      } else {
        this._metodoPagoService.EditarMetodosDePago(this.dataCliente.idCliente, this.metododePagoSeleccionado.idMetodoPago, modelo).subscribe({
          next: () => {
            console.log("En editar")
            this.mostrarAlerta("Metodo Pago Editado", "Listo");
            this.dialogReferencia.close("Editado")
          },
          error: () => {
            this.mostrarAlerta("No se pudo editar", "Error")
          }
        });
      }
  }

  /**
   * Abre un formulario para editar un método de pago.
   * @param metodoDePago Datos del método de pago a editar.
   */

  openEditForm(metodoDePago: MetodoDePago) {
    this.metododePagoSeleccionado = metodoDePago;

    console.log("openEditForm",metodoDePago)
    this.formMetodoPago.patchValue({
      tipo: metodoDePago.tipo,
      numero: metodoDePago.numero,
      fechaVencimiento: metodoDePago.fechaVencimiento,
      nombreTitular: metodoDePago.nombreTitular
    });

    console.log("metodo openEditForm idMetodosDePago:", metodoDePago.idMetodoPago)


    this.showForm = true;
  }

  /**
   * Método para mostrar una alerta utilizando MatSnackBar.
   * @param msg Mensaje a mostrar en la alerta.
   * @param accion Acción de la alerta.
   */
    mostrarAlerta(msg:string, accion: string){
      this._snackBar.open(msg, accion,{
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      });
    }

  /**
   * Alterna la visibilidad del formulario para agregar/editar un método de pago.
   */
    toggleForm() {
      this.showForm = !this.showForm;
          this.formMetodoPago.reset();
    }

  /**
   * Abre un diálogo para eliminar un método de pago.
   * @param dataCliente Datos del método de pago a eliminar.
   */
    dialogoEliminarMetodoPago(dataCliente: MetodoDePago){
      this._dialog.open(MetodoPagoEliminarComponent,{
        disableClose: true,
        data:dataCliente
      }).afterClosed().subscribe(resultado=>{
        if(resultado === "Eliminar"){
          this._metodoPagoService.deleteMetodosDePago(dataCliente.idCliente, dataCliente.idMetodoPago).subscribe({
            next:()=>{
              this.mostrarAlerta("Metodo De Pago eliminado", "Listo");
            }
          })
        }
      })
    }
}
