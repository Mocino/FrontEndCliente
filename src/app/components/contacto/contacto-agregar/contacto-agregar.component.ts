import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Cliente, Contacto, Option } from 'src/app/interfaces/Cliente';
import { ContactoService } from 'src/app/services/contacto.service';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mostrarAlerta } from 'src/app/utils/aler-utils';
import { emailValidator, telefonoValidator } from 'src/app/utils/validador-utils';

@Component({
  selector: 'app-contacto-agregar',
  templateUrl: './contacto-agregar.component.html',
  styleUrls: ['./contacto-agregar.component.css']
})
export class ContactoAgregarComponent implements OnInit {
  @Input() dataCliente!: Cliente;
  @Input() contactoEditar!: Contacto;
  @Output() formClosed = new EventEmitter<void>();
  @Output() contactSaved = new EventEmitter<void>();

  formContacto!: FormGroup;
  tiposContacto: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private _contactoService: ContactoService,
    private _snackBar: MatSnackBar,
  ) {
    this.formContacto = this.fb.group({
      idContacto: 0,
      idCliente: 0,
      tipoContacto: ["", Validators.required],
      valorContacto: this.fb.control('', [Validators.required], [this.emailValidator.bind(this)])
    });
  }

  ngOnInit(): void {
    this.obtenerTiposContacto();
    this.agregarValidadorValorContacto();

    if (this.contactoEditar) {
      this.formContacto.patchValue({
        idContacto: this.contactoEditar.idContacto,
        tipoContacto: this.contactoEditar.tipoContacto,
        valorContacto: this.contactoEditar.valorContacto
      });
      this.formContacto.get('tipoContacto')?.disable();
    }else {
      this.formContacto.get('tipoContacto')?.enable();
    }
  }

  /**
   * Obtiene los tipos de contacto disponibles del servicio de contacto.
   */
  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
  }

  /**
   * Agrega o edita un contacto según los datos ingresados en el formulario.
   */
  addEditContacto() {

    const modelo: Contacto = this.formContacto.getRawValue();
    modelo.idCliente = this.dataCliente?.idCliente || 0

    if (modelo.idContacto === 0) {
      this._contactoService.AgregarContacto(this.dataCliente?.idCliente!, modelo).subscribe({
        next: () => {
          this.mostrarAlerta("Contacto creado", "Listo");
          this.contactSaved.emit();
          this.formClosed.emit();
          this.resetForm();
        },
        error: () => {
          this.mostrarAlerta("No se pudo crear", "Error");
        }
      });
    } else {
      this._contactoService.EditarContacto(this.dataCliente.idCliente!, this.formContacto.value.idContacto, modelo).subscribe({
        next: () => {
          this.mostrarAlerta("Contacto editado", "Listo");
          this.contactSaved.emit();
          this.formClosed.emit();
          this.resetForm();
        },
        error: () => {
          this.mostrarAlerta("No se pudo editar", "Error");
        }
      });
    }
  }

  /**
   * Validador asincrónico para verificar la existencia de un correo electrónico en el backend.
   * @param control Control del formulario que contiene el correo electrónico.
   * @returns Un observable que emite un objeto de errores de validación si el correo electrónico ya existe.
   */
  emailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(300).pipe(
      switchMap(() => {
        if (!control.value) {
          return of(null);
        }
        if (control.value === this.contactoEditar.valorContacto) {
          return of(null);
        }
        return this._contactoService.getVerificarEmail(control.value, this.dataCliente?.idCliente!).pipe(
          map((res: any) => {
            return res.exists ? { emailValidar: true } : null;
          })
        );
      })
    );
  }

  /**
   * Agrega un validador dinámico al campo 'valorContacto' según el tipo de contacto seleccionado.
   */
  agregarValidadorValorContacto() {
    const validadorValorContacto = this.validarValorContacto.bind(this);
    this.formContacto.get('valorContacto')?.setValidators([Validators.required, validadorValorContacto]);
    this.formContacto.get('valorContacto')?.updateValueAndValidity();
  }

  /**
   * Validador personalizado para validar el campo 'valorContacto' según el tipo de contacto seleccionado.
   * @param control Control del formulario que contiene el valor del contacto.
   * @returns Un objeto de errores de validación si el valor del contacto no es válido, de lo contrario, null.
   */
  validarValorContacto(control: AbstractControl): ValidationErrors | null {
    const tipoContacto = this.formContacto.get('tipoContacto')?.value;

    if (tipoContacto === 'email') {
      return emailValidator()(control);
    } else if (tipoContacto === 'teléfono' || tipoContacto === 'celular') {
      return telefonoValidator()(control);
    }
    return null;
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
   * Formatea el formulario
   */
  resetForm() {
    this.formContacto.reset();
  }

 /**
  * Actualiza el formulario con los datos de un contacto especificado.
  * @param contacto Datos del contacto a cargar en el formulario.
  */
  updateForm(contacto: Contacto) {
    this.formContacto.patchValue({
      idContacto: contacto.idContacto,
      tipoContacto: contacto.tipoContacto,
      valorContacto: contacto.valorContacto
    });
  }
}
