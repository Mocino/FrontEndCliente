import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente, Contacto, Option } from 'src/app/interfaces/Cliente';
import { ContactoService } from 'src/app/services/contacto.service';
import { ContantoEliminarComponent } from '../contanto-eliminar/contanto-eliminar.component';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject, map, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-contanto-lista',
  templateUrl: './contanto-lista.component.html',
  styleUrls: ['./contanto-lista.component.css']
})
export class ContantoListaComponent implements AfterViewInit, OnInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  formContacto!: FormGroup;
  displayedColumns: string[] = ['tipoContacto', 'valorContacto', 'acciones'];
  tiposContacto: Option[] = [];
  dataSource = new MatTableDataSource<Contacto>();
  showForm: boolean = false;
  showEdit: boolean = false;
  contactoSeleccionado!: Contacto;

  constructor(
    private dialogReferencia: MatDialogRef<ContantoListaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente,
    private _contactoService: ContactoService,
    private fb: FormBuilder,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
    this.formContacto = this.fb.group({
      idContacto: 0,
      idCliente: 0,
      tipoContacto:["", Validators.required],
      valorContacto: this.fb.control('', [Validators.required], [this.emailValidator.bind(this)])
    })
   }

   ngOnInit(): void {
    this.obtenerContactosPorCliente(this.dataCliente.idCliente!);
    this.agregarValidadorValorContacto();
    this.obtenerTiposContacto();
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
   * Método para obtener la tipos de contactos para select.
   */
  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
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
   * Método para agregar o editar un Contacto.
   */
  addEditContacto(){
    const modelo: Contacto = {
      idContacto:  this.formContacto.value.idContacto || 0,
      idCliente: this.dataCliente.idCliente!,
      tipoContacto: this.formContacto.value.tipoContacto,
      valorContacto: this.formContacto.value.valorContacto,
    }

      if (modelo.idContacto === 0) {
        this._contactoService.AgregarContacto(this.dataCliente.idCliente!, modelo).subscribe({
          next: () => {
            this.mostrarAlerta("Cliente Creado", "Listo");
            this.obtenerContactosPorCliente(this.dataCliente.idCliente!)
          },
          error: () => {
            this.mostrarAlerta("No se pudo crear", "Error")
          }
        });
      } else {
        this._contactoService.EditarContacto(this.dataCliente.idCliente!, this.contactoSeleccionado.idContacto, modelo).subscribe({
          next: () => {
            this.mostrarAlerta("Contacto Editado", "Listo");
            this.obtenerContactosPorCliente(this.dataCliente.idCliente!)
          },
          error: () => {
            this.mostrarAlerta("No se pudo editar", "Error")
          }
        });
      }
  }

 /**
  * Abre un diálogo para ver los contactos de un cliente.
  * @param contacto datos de contacto.
  */
 openEditForm(contacto: Contacto) {
  console.log("openEdit de Contacto: ", contacto)
  this.contactoSeleccionado = contacto;

  this.formContacto.patchValue({
    idContacto: contacto.idContacto,
    idCliente: contacto.idCliente,
    tipoContacto: contacto.tipoContacto,
    valorContacto: contacto.valorContacto
  });

  this.showForm = true;
  this.showEdit = true;
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
   * Validacion dependiendo el tipo de Contacto.
   * @param control tipo de dato seleccionado.
   */
  validarValorContacto(control: AbstractControl): { [key: string]: boolean } | null {
    const tipoContacto = this.formContacto.get('tipoContacto')?.value;
    const valorContacto = control.value;

    if (tipoContacto === 'email') {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(valorContacto)) {
        return { emailInvalido: true };
      }
    } else if (tipoContacto === 'teléfono' || tipoContacto === 'celular') {
      const telefonoRegex = /^\d{8}$/;
      if (!telefonoRegex.test(valorContacto)) {
        return { telefonoInvalido: true };
      }
    }

    return null;
  }

  /**
   * Agrega el validador dinámico al campo de valor del contacto.
   */
  agregarValidadorValorContacto() {
    const validadorValorContacto = this.validarValorContacto.bind(this);
    this.formContacto.get('valorContacto')?.setValidators([Validators.required, validadorValorContacto]);
    this.formContacto.get('valorContacto')?.updateValueAndValidity();
  }

  /**
   * Alterna la visibilidad del formulario para agregar/editar un contacto.
   */
  toggleForm() {
    this.showForm = !this.showForm;
    this.showEdit = false;
    this.formContacto.reset();
  }


  /**
   * Abre un diálogo para eliminar un contacto.
   * @param contacto Datos del contacto a eliminar.
   */
  dialogoEliminarCuenta(dataCliente: Contacto){
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

    /**
   * Valida si dpi ya existe.
   */
    emailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
      return timer(300).pipe(
          switchMap(() => {
              if (!control.value) {
                  return of(null);
              }
              if (this.showEdit == true && control.value === this.contactoSeleccionado.valorContacto){
                return of(null)
              }
              return this._contactoService.getVerificarEmail(control.value, this.dataCliente.idCliente!).pipe(
                  map((res: any) => {
                      return res.exists ? { emailValidar: true } : null;
                  })
              );
          })
      );
  }

}
