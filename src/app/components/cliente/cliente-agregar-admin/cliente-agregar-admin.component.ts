import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from 'src/app/services/Cliente.service';

@Component({
  selector: 'app-cliente-agregar-admin',
  templateUrl: './cliente-agregar-admin.component.html',
  styleUrls: ['./cliente-agregar-admin.component.css']
})
export class ClienteAgregarAdminComponent {

  currentSection: 'cliente' | 'contacto' | 'metodoPago' = 'cliente';
  formCliente!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _clienteServicio: ClienteService,
  ) {
    this.formCliente = this.fb.group({
      nombres: ["", Validators.required],
      apellidos: ["", Validators.required],
      direccion: ["", Validators.required],
      fechaNacimiento: ["", Validators.required],
      dpi: ["", [Validators.pattern(/^\d{13}$/)]],
      nit: ["", [Validators.required, Validators.pattern(/^\d{6,12}K$/)]],
      empresa: ["", Validators.required],
      contactos: this.fb.array([this.createContactoGroup()]),
      metodosDePago: this.fb.array([this.createMetodoPagoGroup()])
    });
  }

  createContactoGroup(): FormGroup {
    return this.fb.group({
      tipoContacto: ["", Validators.required],
      valorContacto: ["", Validators.required]
    });
  }

  createMetodoPagoGroup(): FormGroup {
    return this.fb.group({
      tipo: ["", Validators.required],
      numero: ["", Validators.required],
      fechaVencimiento: ["", Validators.required],
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

    this._clienteServicio.guardarAllDataClientes(modelo).subscribe({
      next: () => {
        this.mostrarAlerta("Cliente Creado", "Listo");
      }, error: () => {
        this.mostrarAlerta("No se pudo crear", "Error");
      }
    });
  }

  nextSection(section: 'cliente' | 'contacto' | 'metodoPago') {
    this.currentSection = section;
  }

  previousSection() {
    if (this.currentSection === 'contacto') {
      this.currentSection = 'cliente';
    } else if (this.currentSection === 'metodoPago') {
      this.currentSection = 'contacto';
    }
  }
}
