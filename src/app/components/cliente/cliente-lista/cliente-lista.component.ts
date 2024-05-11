import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/interfaces/Cliente';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ClienteAgregarComponent } from '../cliente-agregar/cliente-agregar.component';
import { ClienteService } from 'src/app/services/Cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteEliminarComponent } from '../cliente-eliminar/cliente-eliminar.component';
import { ContantoListaComponent } from '../../contacto/contanto-lista/contanto-lista.component';
import { MetodoPagoListaComponent } from '../../metodoPago/metodo-pago-lista/metodo-pago-lista.component';



@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements AfterViewInit, OnInit {

  /** Referencia al paginador de la tabla. */
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /** Columnas que se mostrarán en la tabla. */
  displayedColumns: string[] = ['numero', 'nombres', 'apellidos', 'direccion', 'empresa', 'acciones'];
  /** Fuente de datos para la tabla. */
  dataSource = new MatTableDataSource<Cliente>();

  constructor(
    private _clienteService: ClienteService,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.mostrarCliente();
  }

  /**
   * Método del ciclo de vida AfterViewInit.
   * Se ejecuta después de que la vista y las vistas secundarias (como el paginador) se hayan inicializado.
   */
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Método para obtener y mostrar la lista de clientes.
   */
  mostrarCliente(){
    this._clienteService.getClientes().subscribe({
      next:(dataResponse)=>{
        console.log(dataResponse)
        this.dataSource.data = dataResponse;
      }, error:(e) => {}
    })
  }

  /**
   * Método para aplicar un filtro a la tabla basado en el valor del campo de búsqueda.
   * @param event Evento de cambio en el campo de búsqueda.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Método para abrir el diálogo de agregar cliente.
   */
  openDialogCrearCliente(){
    this._dialog.open(ClienteAgregarComponent,{
      disableClose: true,
      width:"330px"
    }).afterClosed().subscribe(resultado=>{
      if(resultado=="Creado"){
        this.mostrarCliente();
      }
    })
  }

  /**
   * Método para abrir el diálogo de editar cliente.
   */
  dialogoEditarCliente(dataCliente: Cliente){
    this._dialog.open(ClienteAgregarComponent,{
      disableClose: true,
      width:"330px",
      data:dataCliente
    }).afterClosed().subscribe(resultado=>{
      if(resultado=="Editado"){
        this.mostrarCliente();
      }
    })
  }

  /**
   * Método para abrir el diálogo de editar cliente.
   */
  dialogoEliminarCliente(dataCliente: Cliente){
    this._dialog.open(ClienteEliminarComponent,{
      disableClose: true,
      data:dataCliente
    }).afterClosed().subscribe(resultado=>{
      if(resultado === "Eliminar"){
        this._clienteService.deleteCliente(dataCliente.idCliente).subscribe({
          next:(data)=>{
            this.mostrarAlerta("Cliente eliminado", "Listo");
            this.mostrarCliente();
          }
        })
      }
    })
  }

  /**
   * Método para abrir el diálogo de ver contacto cliente.
   */
  dialogoVerContacto(dataCliente: Cliente){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = dataCliente;

    dialogConfig.position = {
      right: '0', // Ajusta la posición del modal a la derecha
      top: '0'   // Puedes ajustar la posición vertical si es necesario
    };
    dialogConfig.width = '70%'; // Establece el ancho del modal al 70% de la pantalla
    dialogConfig.height = '100%'; // Establece la altura del modal al 80% de la pantalla

    this._dialog.open(ContantoListaComponent, dialogConfig)
      .afterClosed()
      .subscribe(resultado => {
        if(resultado === "Contacto"){
          this._clienteService.deleteCliente(dataCliente.idCliente).subscribe({
            next:(data)=>{
              this.mostrarAlerta("Vista Contacto", "Listo");
              this.mostrarCliente();
            }
          })
        }
      });
  }

  /**
   * Método para abrir el diálogo de ver cliente.
   */
  dialogoVerMetodosPago(dataCliente: Cliente){
    this._dialog.open(MetodoPagoListaComponent,{
      disableClose: true,
      data:dataCliente
    }).afterClosed().subscribe(resultado=>{
      if(resultado === "metodoPago"){
        this._clienteService.deleteCliente(dataCliente.idCliente).subscribe({
          next:(data)=>{
            this.mostrarAlerta("Vista Contacto", "Listo");
            this.mostrarCliente();
          }
        })
      }
    })
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
}
