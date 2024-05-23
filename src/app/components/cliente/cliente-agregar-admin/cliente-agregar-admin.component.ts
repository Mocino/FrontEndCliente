import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, of, switchMap, timer } from 'rxjs';
import { Cliente, Option } from 'src/app/interfaces/Cliente';
import { ClienteService } from 'src/app/services/Cliente.service';
import { ContactoService } from 'src/app/services/contacto.service';
import { MetodoPagoService } from 'src/app/services/metodo-pago.service';
import { ClienteEliminarComponent } from '../cliente-eliminar/cliente-eliminar.component';

@Component({
  selector: 'app-cliente-agregar-admin',
  templateUrl: './cliente-agregar-admin.component.html',
  styleUrls: ['./cliente-agregar-admin.component.css']
})
export class ClienteAgregarAdminComponent implements OnInit{

  formCliente!: FormGroup;
  tiposContacto: Option[] = [];
  tiposMetodo: Option[] = [];

  constructor(
    private dialogReferencia: MatDialogRef<ClienteAgregarAdminComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _clienteServicio: ClienteService,
    private _contactoService: ContactoService,
    private _metodoPagoService: MetodoPagoService,
    public _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente
  ) {
    this.formCliente = this.fb.group({
      nombres: ["", Validators.required],
      apellidos: ["", Validators.required],
      direccion: ["", Validators.required],
      fechaNacimiento: ["", [Validators.required, this.fechaNacimientoValidator]],
      dpi: ["", [Validators.pattern(/^\d{13}$/)], [this.dpiValidator.bind(this)]],
      nit: ["", [Validators.required, Validators.pattern(/^(\d{6}K|\d{7}|\d{8,10}\d)$/)]],
      empresa: ["", Validators.required],
      contactos: this.fb.array([this.createContactoGroup()]),
      metodosDePago: this.fb.array([this.createMetodoPagoGroup()])
    });
  }

  ngOnInit(): void {
    if (this.dataCliente) {
      this.formCliente.patchValue({
        nombres: this.dataCliente.nombres,
        apellidos: this.dataCliente.apellidos,
        direccion: this.dataCliente.direccion,
        fechaNacimiento: this.dataCliente.fechaNacimiento,
        dpi: this.dataCliente.dpi,
        nit: this.dataCliente.nit,
        empresa: this.dataCliente.empresa,
      });

      // Limpiar contactos y metodos de pago iniciales
      this.contactos.clear();
      this.metodosDePago.clear();

      // Asignar valores de contactos
      this.dataCliente.contactos?.forEach(contacto => {
        const contactoGroup = this.createContactoGroup();
        contactoGroup.patchValue(contacto);
        this.contactos.push(contactoGroup);
      });

      // Asignar valores de metodosDePago
      this.dataCliente.metodosDePago?.forEach(metodo => {
        const metodoGroup = this.createMetodoPagoGroup();
        metodoGroup.patchValue(metodo);
        this.metodosDePago.push(metodoGroup);
      });
    }

    this.obtenerTiposContacto();
    this.obtenerMetodosPagoSelect();
  }


  validarContactos() {
    // Iterar sobre los contactos y validar el valor de contacto para cada uno
    this.contactos.controls.forEach((control, index) => {
      const errors = this.validarValorContacto(index);
      control.get('valorContacto')?.setErrors(errors);
    });
  }

  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
  }

  /**
   * Método para obtener la tipos de metodos para select.
   */
  obtenerMetodosPagoSelect(): void {
    this._metodoPagoService.obtenerMetodosPagoSelect().subscribe(tiposMetodo => {
      this.tiposMetodo = tiposMetodo;
    });
  }


  createContactoGroup(): FormGroup {
    return this.fb.group({
      tipoContacto: ["", Validators.required],
      valorContacto: this.fb.control('', [Validators.required])
    });
  }

  createMetodoPagoGroup(): FormGroup {
    return this.fb.group({
      tipo: ["", Validators.required],
      numero: ["", [Validators.required, Validators.pattern(/^\d{13}$|^\d{18}$/)]],
      fechaVencimiento: ["", [Validators.required, this.fechaTarjetaValidator]],
      nombreTitular: ["", Validators.required]
    });
  }


  get contactos(): FormArray {
    return this.formCliente.get('contactos') as FormArray;
  }

  get metodosDePago(): FormArray {
    return this.formCliente.get('metodosDePago') as FormArray;
  }


  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  addEditCliente() {
    const modelo = {
      nombres: this.formCliente.value.nombres,
      apellidos: this.formCliente.value.apellidos,
      direccion: this.formCliente.value.direccion,
      fechaNacimiento: this.formCliente.value.fechaNacimiento,
      dpi: this.formCliente.value.dpi,
      nit: this.formCliente.value.nit,
      empresa: this.formCliente.value.empresa,
      contactos: this.formCliente.value.contactos,
      metodosPagos: this.formCliente.value.metodosDePago
    };


    if(this.dataCliente == null){
      this._clienteServicio.guardarAllDataClientes(modelo).subscribe({
        next: () => {
          this.mostrarAlerta("Cliente Creado", "Listo");
          this.dialogReferencia.close("Creado")
        }, error: () => {
          this.mostrarAlerta("No se pudo crear", "Error");
        }
      });
    } else {
      this._clienteServicio.editarAllDataClientes(this.dataCliente.idCliente!, modelo).subscribe({
        next: () => {
          this.mostrarAlerta("Cliente Editar", "Listo");
          this.dialogReferencia.close("Editado")
        }, error: (error) => {
          console.error('Error al editar el cliente:', error);
          this.mostrarAlerta("No se pudo Editar", "Error");
        }
      })

    }
  }

  fechaNacimientoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const fechaNacimiento = new Date(control.value);
    const edadMinima = 18;
    const fechaActual = new Date();
    const diferenciaFechas = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

    if (diferenciaFechas < edadMinima) {
      return { menorDeEdad: true };
    }

    return null;
  }

  /**
   * Valida si dpi ya existe.
   */
  dpiValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || this.dataCliente) {
        return of(null);
    }

    return timer(300).pipe(
        switchMap(() => {
            return this._clienteServicio.getVerificarDPI(control.value).pipe(
                map((res: any) => {
                    return res.exists ? { dpiExists: true } : null;
                })
            );
        })
    );
  }


  fechaTarjetaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const fechaTarjeta = new Date(control.value);
    const fechaActual = new Date();

    if (fechaTarjeta < fechaActual) { //comentario
      return { fechaAnterior: true };
    }

    return null;
  }

  // Nueva función para validar el valor de contacto según el tipo seleccionado
  validarValorContacto(index: number): ValidationErrors | null {
    const contactoGroup = this.contactos.at(index) as FormGroup;
    const tipoContacto = contactoGroup.get('tipoContacto')?.value;
    const valorContacto = contactoGroup.get('valorContacto')?.value;

    if (tipoContacto === 'teléfono' && !(/^\d{8}$/.test(valorContacto))) {
      return { telefonoInvalido: true };
    } else if (tipoContacto === 'email' && !(/\S+@\S+\.\S+/.test(valorContacto))) {
      return { emailInvalido: true };
    }

    return null;
  }


  addContacto(): void {
    this.contactos.push(this.createContactoGroup());
  }

  // Nueva función para eliminar un contacto
  removeContacto(index: number): void {
    if (this.contactos.length > 1) {
      this.contactos.removeAt(index);
    }
  }


  addMetodosPago(): void {
    this.metodosDePago.push(this.createMetodoPagoGroup());
  }

  removeMetodosPago(index: number): void {
    if (this.metodosDePago.length > 1) {
      this.metodosDePago.removeAt(index);
    }
  }


    /**
   * Abre un diálogo para eliminar un contacto.
   * @param contacto Datos del contacto a eliminar.
   */
    dialogoEliminarContacto(index: number): void {
      const dialogRef = this._dialog.open(ClienteEliminarComponent, {
        disableClose: true,
        data: { message: '¿Está seguro que desea eliminar este contacto?' }
      });

      dialogRef.afterClosed().subscribe(resultado => {
        if (resultado) {
          this.removeContacto(index);
        }
      });
    }


    /**
   * Abre un diálogo para eliminar un contacto.
   * @param contacto Datos del contacto a eliminar.
   */
    dialogoEliminarMetodo(index: number): void {
      const dialogRef = this._dialog.open(ClienteEliminarComponent, {
        disableClose: true,
        data: { message: '¿Está seguro que desea eliminar este contacto?' }
      });

      dialogRef.afterClosed().subscribe(resultado => {
        if (resultado) {
          this.removeMetodosPago(index);
        }
      });
    }

}
