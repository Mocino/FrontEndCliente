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
import { map, switchMap } from 'rxjs';
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Método para obtener y mostrar la lista de clientes.
   */
  mostrarCliente(){
    this._clienteService.getClientes().subscribe({
      next: (dataResponse) => {
        console.log(dataResponse)
        this.dataSource.data = dataResponse;
      },
      error: () => {}
    });
  }

  /**
   * Método para abrir el diálogo de creación de cliente.
   * @return {void}
   */
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
 * Método para abrir el diálogo de edición completa de cliente.
 * Incluye la obtención de contactos y métodos de pago del cliente.
 * @param dataCliente Datos del cliente a editar.
 */
dialogoEditarAllCliente(dataCliente: Cliente) {
  console.log('datos de datacliente en dialogoEditarAllCliente', dataCliente);

  this._contactoService.getContactosPorCliente(dataCliente.idCliente!).pipe(
    switchMap(contactos => {
      return this._metodoPagoService.getMetodosDePagoPorCliente(dataCliente.idCliente!).pipe(
        map(metodosDePago => {

          return {
            ...dataCliente,
            contactos: contactos,
            metodosDePago: metodosDePago
          };
        })
      );
    })
  ).subscribe(clienteCompleto => {
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
        if (resultado === 'Editado') {
          this.mostrarCliente();
        }
      });
    });
  }


  /**
   * Método para abrir el diálogo de edición de cliente.
   * @param dataCliente Datos del cliente a editar.
   */
  dialogoEditarCliente(dataCliente: Cliente){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dataCliente;
    dialogConfig.disableClose = true;
    dialogConfig.width = '330px';

    this._dialog.open(ClienteAgregarComponent, dialogConfig)
      .afterClosed().subscribe(resultado => {
        if (resultado == "Editado") {
          this.mostrarCliente();
        }
      });
  }

  /**
   * Método para abrir el diálogo de eliminación de cliente.
   * @param dataCliente Datos del cliente a eliminar.
   */
  dialogoEliminarCliente(dataCliente: Cliente){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = dataCliente;
    dialogConfig.disableClose = true;

    this._dialog.open(ClienteEliminarComponent, dialogConfig)
      .afterClosed().subscribe(resultado => {
        if (resultado === "Eliminar") {
          this._clienteService.deleteCliente(dataCliente.idCliente!).subscribe({
            next: () => {
              this.mostrarAlerta("Cliente eliminado", "Listo");
              this.mostrarCliente();
            }
          });
        }
      });
  }

  /**
   * Método para abrir el diálogo de ver contacto cliente.
   * @param dataCliente Datos del cliente.
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
   * Método para abrir el diálogo de ver métodos de pago del cliente.
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
  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
}
