import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente, Contacto, TipoContacto } from 'src/app/interfaces/Cliente';
import { ContactoService } from 'src/app/services/contacto.service';
import { ContantoEliminarComponent } from '../contanto-eliminar/contanto-eliminar.component';

@Component({
  selector: 'app-contanto-lista',
  templateUrl: './contanto-lista.component.html',
  styleUrls: ['./contanto-lista.component.css']
})
export class ContantoListaComponent {

  formContacto!:  FormGroup;
  displayedColumns: string[] = ['tipoContacto', 'valorContacto', 'acciones'];
  tiposContacto: TipoContacto[] = [];
  dataSource = new MatTableDataSource<Contacto>();
  showForm: boolean = false;
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
      tipoContacto:["", Validators.required],
      valorContacto: this.fb.control('', Validators.required)
    })
   }

  ngOnInit(): void {
    this.obtenerContactosPorCliente(this.dataCliente.idCliente);
    this.agregarValidadorValorContacto();
    this.obtenerTiposContacto();
  }


  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
  }

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
      idContacto: this.formContacto.value.idContacto || 0, // Si es edición, utiliza el valor existente, de lo contrario, 0 para agregar.
      idCliente: this.dataCliente.idCliente,
      tipoContacto: this.formContacto.value.tipoContacto,
      valorContacto: this.formContacto.value.valorContacto,
    }


      if (!this.contactoSeleccionado) {
        // Agregar nuevo contacto
        this._contactoService.AgregarContacto(this.dataCliente.idCliente, modelo).subscribe({
          next: () => {
            this.mostrarAlerta("Cliente Creado", "Listo");
            this.dialogReferencia.close("Creado")
          },
          error: () => {
            this.mostrarAlerta("No se pudo crear", "Error")
          }
        });
      } else {
        // Editar contacto existente
        this._contactoService.EditarContacto(this.dataCliente.idCliente, modelo.idContacto, modelo).subscribe({
          next: () => {
            this.mostrarAlerta("Contacto Editado", "Listo");
            this.dialogReferencia.close("Editado")
          },
          error: () => {
            this.mostrarAlerta("No se pudo editar", "Error")
          }
        });
      }
  }

  openEditForm(contacto: Contacto) {
    // Asignar el contacto seleccionado a la variable de contactoSeleccionado
    this.contactoSeleccionado = contacto;

    // Rellenar los campos del formulario con los detalles del contacto seleccionado
    console.log("openEditForm",contacto)
    this.formContacto.patchValue({
      tipoContacto: contacto.tipoContacto,
      valorContacto: contacto.valorContacto
    });

    // Mostrar el formulario de edición
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

  validarValorContacto(control: AbstractControl): { [key: string]: boolean } | null {
    const tipoContacto = this.formContacto.get('tipoContacto')?.value;
    const valorContacto = control.value;

    if (tipoContacto === 'email') {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(valorContacto)) {
        return { emailInvalido: true };
      }
    } else if (tipoContacto === 'telefono') {
      const telefonoRegex = /^\d{8}$/;
      if (!telefonoRegex.test(valorContacto)) {
        return { telefonoInvalido: true };
      }
    }

    return null;
  }

  agregarValidadorValorContacto() {
    const validadorValorContacto = this.validarValorContacto.bind(this);
    this.formContacto.get('valorContacto')?.setValidators([Validators.required, validadorValorContacto]);
    this.formContacto.get('valorContacto')?.updateValueAndValidity();
  }

  toggleForm() {
    this.showForm = !this.showForm;
        this.formContacto.reset();
  }

  dialogoEliminarCuenta(dataCliente: Contacto){
    this._dialog.open(ContantoEliminarComponent,{
      disableClose: true,
      data:dataCliente
    }).afterClosed().subscribe(resultado=>{
      if(resultado === "Eliminar"){
        this._contactoService.deleteContacto(dataCliente.idCliente, dataCliente.idContacto).subscribe({
          next:()=>{
            this.mostrarAlerta("Empleado eliminado", "Listo");
          }
        })
      }
    })
  }
}
