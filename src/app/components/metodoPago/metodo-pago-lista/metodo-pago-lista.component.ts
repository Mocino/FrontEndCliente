import { Cliente } from './../../../interfaces/Cliente';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MetodoDePago, Option } from 'src/app/interfaces/Cliente';
import { MetodoPagoService } from 'src/app/services/metodo-pago.service';
import { MetodoPagoEliminarComponent } from '../metodo-pago-eliminar/metodo-pago-eliminar.component';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject, map, of, switchMap, timer } from 'rxjs';
import { MetodoPagoAgregarComponent } from '../metodo-pago-agregar/metodo-pago-agregar.component';

@Component({
  selector: 'app-metodo-pago-lista',
  templateUrl: './metodo-pago-lista.component.html',
  styleUrls: ['./metodo-pago-lista.component.css']
})
export class MetodoPagoListaComponent implements AfterViewInit, OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MetodoPagoAgregarComponent) metodoDePagoAgregarComponent!: MetodoPagoAgregarComponent;

  metodoDePagoEditar!: MetodoDePago;
  displayedColumns: string[] = ['tipo', 'numero', 'fechaVencimiento', 'nombreTitular', 'acciones'];
  tiposMetodo: Option[] = [];
  showForm: boolean = false;
  dataSource = new MatTableDataSource<MetodoDePago>();
  showEdit: boolean = false;

  constructor(
    private _metodoPagoService: MetodoPagoService,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente,
  ) {}

  ngOnInit(): void {
    this.obtenerMetodosdePago(this.dataCliente.idCliente!);
  }

  /**
   * Método del ciclo de vida AfterViewInit.
   * Se ejecuta después de que la vista y las vistas secundarias (como el paginador) se hayan inicializado.
   */
    ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
      this.dataSource.filterPredicate = (data: MetodoDePago, filter: string) => {
        const tipo = data.tipo.toLowerCase(); // Filtrar por tipo de método de pago
        const numero = data.numero.toLowerCase();
        const fechaVencimiento = data.fechaVencimiento.toLocaleDateString().toLowerCase(); // Convertir la fecha de vencimiento a una cadena
        const nombreTitular = data.nombreTitular.toLowerCase();
        return tipo.includes(filterValue) || numero.includes(filterValue) || fechaVencimiento.includes(filterValue) || nombreTitular.includes(filterValue);
      };
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

  /**
   * Método para obtener los tipos de método de pago del cliente.
   * @param idCliente ID del cliente.
   */
  obtenerMetodosdePago(idCliente: number): void {
    this._metodoPagoService.getMetodosDePagoPorCliente(idCliente)
      .subscribe(tipoMetodo => {
        this.dataSource.data = tipoMetodo;
      });
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
    this.showEdit = false;
    if(!this.showForm){
      this.metodoDePagoEditar = {} as MetodoDePago;
    }
  }

  /**
   * Abre un formulario para editar un método de pago.
   * @param metodoDePago Datos del método de pago a editar.
   */

  openEditForm(metodoDePago: MetodoDePago) {
    this.metodoDePagoEditar = metodoDePago;
    this.showForm = true;
    this.showEdit = true;


    if(this.metodoDePagoAgregarComponent){
      this.metodoDePagoAgregarComponent.updateForm(metodoDePago)
    }
  }




  /**
   * Abre un diálogo para eliminar un método de pago.
   * @param dataCliente Datos del método de pago a eliminar.
   */
    dialogoEliminarMetodoPago(dataCliente: MetodoDePago){
      if (this.dataSource.data.length <= 1) {
        this.mostrarAlerta("No se puede eliminar el único metodo de Pago", "Error");
        return;
      }
      this._dialog.open(MetodoPagoEliminarComponent,{
        disableClose: true,
        data:dataCliente
      }).afterClosed().subscribe(resultado=>{
        if(resultado === "Eliminar"){
          this._metodoPagoService.deleteMetodosDePago(dataCliente.idCliente, dataCliente.idMetodoPago!).subscribe({
            next:()=>{
              this.mostrarAlerta("Metodo De Pago eliminado", "Listo");
              this.obtenerMetodosdePago(this.dataCliente.idCliente!);
            }
          })
        }
      })
    }

  /**
   * Función para ocultar los primeros cinco dígitos de un número.
   * @returns El número con los primeros cinco dígitos ocultos por asteriscos (*) si tiene más de cuatro dígitos, de lo contrario devuelve el mismo número sin cambios.
   */
  ocultarDigitos(numero: string): string {
    if (numero.length <= 8) {
      return numero; // No se ocultan dígitos si la longitud es menor o igual a 8
    } else {
      const primeraParte = numero.substring(0, 4); // Obtener los primeros cuatro dígitos
      const segundaParte = '****'; // Reemplazar los restantes con asteriscos
      return primeraParte + segundaParte;
    }
  }

  onContactSaved() {
    this._metodoPagoService.getMetodosDePagoPorCliente(this.dataCliente.idCliente!).subscribe(contactos => {
      this.dataSource.data = contactos;
    });
  }
}
