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
import { emailExistsValidator, emailValidator, fechaNacimientoValidator, fechaTarjetaValidator, telefonoValidator } from 'src/app/utils/validador-utils';
import { mostrarAlerta } from 'src/app/utils/aler-utils';

@Component({
  selector: 'app-cliente-agregar-admin',
  templateUrl: './cliente-agregar-admin.component.html',
  styleUrls: ['./cliente-agregar-admin.component.css']
})
export class ClienteAgregarAdminComponent implements OnInit{

  formCliente!: FormGroup;
  tiposContacto: Option[] = [];
  tiposMetodo: Option[] = [];
  private originalEmails: string[] = [];

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
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeData();
  }

  /**
   * Inicializa el formulario de cliente con sus controles y validaciones.
   */
  private initializeForm(): void {
    this.formCliente = this.fb.group({
      nombres: ["", Validators.required],
      apellidos: ["", Validators.required],
      direccion: ["", Validators.required],
      fechaNacimiento: ["", [Validators.required, fechaNacimientoValidator]],
      dpi: ["", [Validators.pattern(/^\d{13}$/)], [this.dpiValidator.bind(this)]],
      nit: ["", [Validators.required, Validators.pattern(/^(\d{6}K|\d{7}|\d{8,10}\d)$/)]],
      empresa: ["", Validators.required],
      contactos: this.fb.array([this.createContactoGroup()]),
      metodosDePago: this.fb.array([this.createMetodoPagoGroup()])
    });
  }

  /**
   * Inicializa los datos del formulario con los datos del cliente proporcionados.
   * Si se proporcionan datos del cliente, se carga para su edición.
   */
  private initializeData(): void {
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

      // Limpiar contactos y métodos de pago iniciales
      this.clearContactos();
      this.clearMetodosDePago();

      // Asignar valores de contactos
      this.dataCliente.contactos?.forEach(contacto => {
        const contactoGroup = this.createContactoGroup();
        contactoGroup.patchValue(contacto);
        contactoGroup.get('tipoContacto')?.disable();
        this.originalEmails.push(contacto.valorContacto);
        this.contactos.push(contactoGroup);
      });

      // Asignar valores de métodos de pago
      this.dataCliente.metodosDePago?.forEach(metodo => {
        const metodoGroup = this.createMetodoPagoGroup();
        metodoGroup.patchValue(metodo);
        metodoGroup.get('tipo')?.disable();
        this.metodosDePago.push(metodoGroup);
      });
    }

    this.obtenerTiposContacto();
    this.obtenerMetodosPagoSelect();
  }

  /**
   * Limpia los controles del formulario de contactos.
   */
  private clearContactos(): void {
    this.contactos.clear();
  }

  /**
   * Limpia los controles del formulario de métodos de pago.
   */
  private clearMetodosDePago(): void {
    this.metodosDePago.clear();
  }

  /**
   * Obtiene los tipos de contacto disponibles desde el servicio.
   */
  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
  }

  /**
   * Obtiene los tipos de método de pago disponibles desde el servicio.
   */
  obtenerMetodosPagoSelect(): void {
    this._metodoPagoService.obtenerMetodosPagoSelect().subscribe(tiposMetodo => {
      this.tiposMetodo = tiposMetodo;
    });
  }

  /**
   * Crea un nuevo FormGroup para un contacto.
   * @returns FormGroup para un contacto.
   */
  createContactoGroup(): FormGroup {
    const group = this.fb.group({
      tipoContacto: ["", Validators.required],
      valorContacto: ["", [Validators.required], [this.emailExistsValidator.bind(this)]]
    });

    group.get('tipoContacto')?.valueChanges.subscribe(tipoContacto => {
      const valorContactoControl = group.get('valorContacto');
      if (tipoContacto === 'email') {
        valorContactoControl?.setValidators([Validators.required, emailValidator()]);
      } else if (tipoContacto === 'teléfono') {
        valorContactoControl?.setValidators([Validators.required, telefonoValidator()]);
      } else {
        valorContactoControl?.setValidators([Validators.required]);
      }
      valorContactoControl?.updateValueAndValidity();
    });

    return group;
  }

  /**
   * Crea un nuevo FormGroup para un método de pago.
   * @returns FormGroup para un método de pago.
   */
  createMetodoPagoGroup(): FormGroup {
    return this.fb.group({
      tipo: ["", Validators.required],
      numero: ["", [Validators.required, Validators.pattern(/^\d{13}$|^\d{18}$/)]],
      fechaVencimiento: ["", [Validators.required, fechaTarjetaValidator]],
      nombreTitular: ["", Validators.required]
    });
  }

  /**
   * Accesor para obtener los controles de contactos del formulario.
   * @returns FormArray de controles de contactos.
   */
  get contactos(): FormArray {
    return this.formCliente.get('contactos') as FormArray;
  }

  /**
   * Accesor para obtener los controles de métodos de pago del formulario.
   * @returns FormArray de controles de métodos de pago.
   */
  get metodosDePago(): FormArray {
    return this.formCliente.get('metodosDePago') as FormArray;
  }

  /**
   * Muestra una alerta utilizando el servicio MatSnackBar.
   * @param msg Mensaje para mostrar en la alerta.
   */
  mostrarAlerta(msg: string, accion: string): void {
    mostrarAlerta(this._snackBar, msg, accion);
  }

  /**
   * Agrega o edita un cliente según los datos ingresados en el formulario.
   * Si no hay datos de cliente, se crea uno nuevo. En caso contrario, se edita
   * el cliente existente.
   */
  addEditCliente() {

    const modelo: Cliente = this.formCliente.getRawValue();

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
          this.mostrarAlerta("Cliente Editado", "Listo");
          this.dialogReferencia.close("Editado")
        }, error: (error) => {
          console.error('Error al editar el cliente:', error);
          this.mostrarAlerta("No se pudo Editar", "Error");
        }
      })

    }
  }

  /**
   * Validador asincrónico para verificar la existencia de un DPI en el backend.
   * @param control Control del formulario que contiene el DPI.
   * @returns Un observable que emite un objeto de errores de validación si el DPI ya existe.
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

  /**
   * Agrega un nuevo campo de contacto al formulario.
   */
  addContacto(): void {
    this.contactos.push(this.createContactoGroup());
  }

  /**
   * Agrega un nuevo campo de método de pago al formulario.
   */
  addMetodosPago(): void {
    this.metodosDePago.push(this.createMetodoPagoGroup());
  }

  /**
   * Elimina un campo de contacto del formulario.
   * @param index Índice del campo de contacto a eliminar.
   */
  removeContacto(index: number): void {
    if (this.contactos.length > 1) {
      this.contactos.removeAt(index);
    }
  }

  /**
   * Elimina un campo de método de pago del formulario.
   * @param index Índice del campo de método de pago a eliminar.
   */
  removeMetodosPago(index: number): void {
    if (this.metodosDePago.length > 1) {
      this.metodosDePago.removeAt(index);
    }
  }

  /**
   * Abre un diálogo para confirmar la eliminación de un contacto.
   * @param index Índice del contacto a eliminar.
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
   * Abre un diálogo para confirmar la eliminación de un método de pago.
   * @param index Índice del método de pago a eliminar.
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

  /**
   * Validador asincrónico para verificar la existencia de un correo electrónico en el backend.
   * @param control Control del formulario que contiene el correo electrónico.
   * @returns Un observable que emite un objeto de errores de validación si el correo electrónico ya existe.
   */
  emailExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return emailExistsValidator(control, this.contactos.controls, this.originalEmails, this._clienteServicio);
  }

}
