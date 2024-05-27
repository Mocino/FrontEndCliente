import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente, Contacto, Option } from 'src/app/interfaces/Cliente';
import { ContactoService } from 'src/app/services/contacto.service';
import { ContantoEliminarComponent } from '../contanto-eliminar/contanto-eliminar.component';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject, map, of, switchMap, timer } from 'rxjs';
import { ContactoAgregarComponent } from '../contacto-agregar/contacto-agregar.component';
import { mostrarAlerta } from 'src/app/utils/aler-utils';

@Component({
  selector: 'app-contanto-lista',
  templateUrl: './contanto-lista.component.html',
  styleUrls: ['./contanto-lista.component.css']
})
export class ContantoListaComponent implements AfterViewInit, OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(ContactoAgregarComponent) contactoAgregarComponent!: ContactoAgregarComponent;

  contactoEditar!: Contacto;
  displayedColumns: string[] = ['tipoContacto', 'valorContacto', 'acciones'];
  tiposContacto: Option[] = [];
  dataSource = new MatTableDataSource<Contacto>();
  showForm: boolean = false;
  showEdit: boolean = false;


  constructor(
    private _contactoService: ContactoService,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente,
  ) {}

   ngOnInit(): void {
    this.obtenerContactosPorCliente(this.dataCliente.idCliente!);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Método para aplicar un filtro a la tabla basado en el valor del campo de búsqueda.
   * @param event Evento de cambio en el campo de búsqueda.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filterPredicate = (data: Contacto, filter: string) => {
      const valorContacto = data.valorContacto.toLowerCase();
      const tipoContacto = data.tipoContacto.toLowerCase();
      return valorContacto.includes(filter) || tipoContacto.includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  /**
   * Método para obtener la lista de contactos.
   * @param idCliente Datos del cliente.
   */
  obtenerContactosPorCliente(idCliente: number): void {
    this._contactoService.getContactosPorCliente(idCliente)
      .subscribe(contactos => {
        this.dataSource.data = contactos;
      });
  }

  /**
   * Método para mostrar una alerta utilizando MatSnackBar.
   * @param msg Mensaje a mostrar en la alerta.
   * @param accion Acción de la alerta.
   */
  mostrarAlerta(msg: string, accion: string): void {
    mostrarAlerta(this._snackBar, msg, accion);
  }



  /**
   * Alterna la visibilidad del formulario para agregar/editar un contacto.
   */
  toggleForm() {
    this.showForm = !this.showForm;
    this.showEdit = false;

    if (!this.showForm) {
      this.contactoEditar = undefined!;
    }
  }


  /**
   * Abre un diálogo para eliminar un contacto.
   * @param contacto Datos del contacto a eliminar.
   */
  dialogoEliminarContacto(dataCliente: Contacto){
    if (this.dataSource.data.length <= 1) {
      this.mostrarAlerta("No se puede eliminar el único contacto", "Error");
      return;
    }
    this._dialog.open(ContantoEliminarComponent,{
      disableClose: true,
      data:dataCliente
    }).afterClosed().subscribe(resultado=>{
      if(resultado === "Eliminar"){
        this._contactoService.deleteContacto(dataCliente.idCliente, dataCliente.idContacto).subscribe({
          next:()=>{
            this.mostrarAlerta("Contacto eliminado", "Listo");
            this.obtenerContactosPorCliente(this.dataCliente.idCliente!)
          }
        })
      }
    })
  }

  editarContacto(contacto: Contacto) {
    this.contactoEditar = contacto;
    this.showForm = true;
    this.showEdit = true;

    if (this.contactoAgregarComponent) {
      this.contactoAgregarComponent.updateForm(contacto);
    }
  }

  onContactSaved() {
    this._contactoService.getContactosPorCliente(this.dataCliente.idCliente!).subscribe(contactos => {
      this.dataSource.data = contactos;
    });
  }


}
