import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Cliente, Contacto, Option } from 'src/app/interfaces/Cliente';
import { ContactoService } from 'src/app/services/contacto.service';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  esEditar: boolean = false;

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
      this.esEditar = true;
      this.formContacto.patchValue({
        idContacto: this.contactoEditar.idContacto,
        tipoContacto: this.contactoEditar.tipoContacto,
        valorContacto: this.contactoEditar.valorContacto
      });
    }
  }

  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
  }

  addEditContacto() {
    const modelo: Contacto = {
      idContacto: this.formContacto.value.idContacto || 0,
      idCliente: this.dataCliente.idCliente!,
      tipoContacto: this.formContacto.value.tipoContacto,
      valorContacto: this.formContacto.value.valorContacto,
    };
    if (modelo.idContacto === 0) {
      this._contactoService.AgregarContacto(this.dataCliente.idCliente!, modelo).subscribe({
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

  emailValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(300).pipe(
      switchMap(() => {
        if (!control.value) {
          return of(null);
        }
        if (this.esEditar && control.value === this.contactoEditar.valorContacto) {
          return of(null);
        }
        return this._contactoService.getVerificarEmail(control.value, this.dataCliente.idCliente!).pipe(
          map((res: any) => {
            return res.exists ? { emailValidar: true } : null;
          })
        );
      })
    );
  }

  agregarValidadorValorContacto() {
    const validadorValorContacto = this.validarValorContacto.bind(this);
    this.formContacto.get('valorContacto')?.setValidators([Validators.required, validadorValorContacto]);
    this.formContacto.get('valorContacto')?.updateValueAndValidity();
  }

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

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  resetForm() {
    this.formContacto.reset();
    this.esEditar = false;
  }

  updateForm(contacto: Contacto) {
    this.esEditar = true;
    this.formContacto.patchValue({
      idContacto: contacto.idContacto,
      tipoContacto: contacto.tipoContacto,
      valorContacto: contacto.valorContacto
    });
  }
}
