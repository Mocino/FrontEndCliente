import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/interfaces/Cliente';
import { MatDialog } from '@angular/material/dialog';
import { ClienteAgregarComponent } from '../cliente-agregar/cliente-agregar.component';
import { ClienteService } from 'src/app/services/Cliente.service';



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
    public _dialog: MatDialog

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
  openDialog(){
    this._dialog.open(ClienteAgregarComponent,{
      disableClose: true,
      width:"330px"
    }).afterClosed().subscribe(resultado=>{
      if(resultado=="Creado"){
        this.mostrarCliente();
      }
    })
  }

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
}
