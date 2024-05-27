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
import { emailValidator, telefonoValidator } from 'src/app/utils/validador-utils';

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

  private initializeForm(): void {
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

  private clearContactos(): void {
    this.contactos.clear();
  }

  private clearMetodosDePago(): void {
    this.metodosDePago.clear();
  }


  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
  }

  obtenerMetodosPagoSelect(): void {
    this._metodoPagoService.obtenerMetodosPagoSelect().subscribe(tiposMetodo => {
      this.tiposMetodo = tiposMetodo;
    });
  }


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

    if (fechaTarjeta < fechaActual) {
      return { fechaAnterior: true };
    }
    return null;
  }

  addContacto(): void {
    this.contactos.push(this.createContactoGroup());
  }

  addMetodosPago(): void {
    this.metodosDePago.push(this.createMetodoPagoGroup());
  }

  removeContacto(index: number): void {
    if (this.contactos.length > 1) {
      this.contactos.removeAt(index);
    }
  }

  removeMetodosPago(index: number): void {
    if (this.metodosDePago.length > 1) {
      this.metodosDePago.removeAt(index);
    }
  }

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

  emailExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    const email = control.value;
    const emailOriginalIndex = this.contactos.controls.findIndex((controlGroup, index) => {
      return controlGroup.get('valorContacto')?.value === email && this.originalEmails[index] === email;
    });

    if (emailOriginalIndex !== -1) {
      return of(null);
    }

    return timer(300).pipe(
      switchMap(() => {
        return this._clienteServicio.getVerificarEmail(email).pipe(
          map((res: any) => {
            return res.exists ? { emailExists: true } : null;
          })
        );
      })
    );
  }
}
