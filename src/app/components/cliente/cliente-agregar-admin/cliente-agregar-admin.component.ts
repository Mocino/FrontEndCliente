import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, of, switchMap, timer } from 'rxjs';
import { Cliente } from 'src/app/interfaces/Cliente';
import { ClienteService } from 'src/app/services/Cliente.service';
import { mostrarAlerta } from 'src/app/utils/aler-utils';
import { fechaNacimientoValidator } from 'src/app/utils/validador-utils';

@Component({
  selector: 'app-cliente-agregar-admin',
  templateUrl: './cliente-agregar-admin.component.html',
  styleUrls: ['./cliente-agregar-admin.component.css']
})
export class ClienteAgregarAdminComponent implements OnInit {

  formCliente!: FormGroup;

  constructor(
    private dialogReferencia: MatDialogRef<ClienteAgregarAdminComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _clienteServicio: ClienteService,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente
  ) {
    this.initializeForm();
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
        empresa: this.dataCliente.empresa
      });

      if (this.dataCliente.contactos) {
        this.dataCliente.contactos.forEach(contacto => {
          (this.formCliente.get('contactos') as FormArray).push(
            this.fb.group({
              tipoContacto: contacto.tipoContacto,
              valorContacto: contacto.valorContacto
            })
          );
        });
      }

      if (this.dataCliente.metodosDePago) {
        this.dataCliente.metodosDePago.forEach(metodo => {
          (this.formCliente.get('metodosDePago') as FormArray).push(
            this.fb.group({
              tipo: metodo.tipo,
              numero: metodo.numero,
              fechaVencimiento: metodo.fechaVencimiento,
              nombreTitular: metodo.nombreTitular
            })
          );
        });
      }
    }
  }

  private initializeForm(): void {
    this.formCliente = this.fb.group({
      nombres: ["", Validators.required],
      apellidos: ["", Validators.required],
      direccion: ["", Validators.required],
      fechaNacimiento: ["", [Validators.required, fechaNacimientoValidator]],
      dpi: ["", [Validators.pattern(/^\d{13}$/)], [this.dpiValidator.bind(this)]],
      nit: ["", [Validators.required, Validators.pattern(/^(\d{6}K|\d{7}|\d{8,10}\d)$/)]],
      empresa: ["", Validators.required],
      contactos: this.fb.array([]),
      metodosDePago: this.fb.array([])
    });
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

  addEditCliente(): void {
    const modelo: Cliente = this.formCliente.getRawValue();

    if (this.dataCliente == null) {
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
      });
    }
  }

  mostrarAlerta(msg: string, accion: string): void {
    mostrarAlerta(this._snackBar, msg, accion);
  }


}
