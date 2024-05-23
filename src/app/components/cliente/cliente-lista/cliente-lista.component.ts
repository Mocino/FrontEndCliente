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
import { ClienteAgregarAdminComponent } from '../cliente-agregar-admin/cliente-agregar-admin.component';
import { forkJoin } from 'rxjs';
import { ContactoService } from 'src/app/services/contacto.service';
import { MetodoPagoService } from 'src/app/services/metodo-pago.service';



@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['numero', 'nombres', 'apellidos', 'direccion', 'empresa', 'acciones'];
  dataSource = new MatTableDataSource<Cliente>();

  constructor(
    private _clienteService: ClienteService,
    private _contactoService: ContactoService,
    private _metodoPagoService: MetodoPagoService,
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
   * Método para aplicar un filtro a la tabla basado en el valor del campo de búsqueda.
   * @param event Evento de cambio en el campo de búsqueda.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Método para obtener y mostrar la lista de clientes.
   */
  mostrarCliente(){
    this._clienteService.getClientes().subscribe({
      next:(dataResponse)=>{
        console.log(dataResponse)
        this.dataSource.data = dataResponse;
      }, error:() => {}
    })
  }


  openDialogCrearCliente() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '40%';
    dialogConfig.height = '100%';
    dialogConfig.position = {
      right: '0',
      top: '0'
    };

    this._dialog.open(ClienteAgregarAdminComponent, dialogConfig)
      .afterClosed()
      .subscribe(resultado => {
        if (resultado === 'Creado') {
          this.mostrarCliente();
        }
      });
  }

  /**
   * Método para abrir el diálogo de editar cliente.
   */
  dialogoEditarAllCliente(dataCliente: Cliente) {
    console.log('datos de datacliente en dialogoEditarAllCliente', dataCliente);

    // Obtener los contactos y métodos de pago para este cliente
    forkJoin({
      contactos: this._contactoService.getContactosPorCliente(dataCliente.idCliente!),
      metodosDePago: this._metodoPagoService.getMetodosDePagoPorCliente(dataCliente.idCliente!)
    }).subscribe(datosCompletos => {
      // Combinar los datos básicos con los contactos y métodos de pago
      const clienteCompleto = {
        ...dataCliente,
        contactos: datosCompletos.contactos,
        metodosDePago: datosCompletos.metodosDePago
      };

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = clienteCompleto;
      dialogConfig.disableClose = true;
      dialogConfig.width = '40%';
      dialogConfig.height = '100%';
      dialogConfig.position = {
        right: '0',
        top: '0'
      };

      this._dialog.open(ClienteAgregarAdminComponent, dialogConfig)
        .afterClosed().subscribe(resultado => {
          if (resultado == "Editado") {
            this.mostrarCliente();
          }
        });
    });
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
        this._clienteService.deleteCliente(dataCliente.idCliente!).subscribe({
          next:()=>{
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
      right: '0',
      top: '0'
    };
    dialogConfig.width = '40%';
    dialogConfig.height = '100%';

    this._dialog.open(ContantoListaComponent, dialogConfig)
      .afterClosed()
      .subscribe(x => {x});
  }

  /**
   * Abre un diálogo para ver los métodos de pago de un cliente.
   * @param dataCliente Datos del cliente.
   */
  dialogoVerMetodosPago(dataCliente: Cliente): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = dataCliente;

    dialogConfig.position = {
      right: '0',
      top: '0'
    };

    dialogConfig.width = '80%';
    dialogConfig.height = '100%';

    this._dialog.open(MetodoPagoListaComponent, dialogConfig)
      .afterClosed()
      .subscribe(x => {x});
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
