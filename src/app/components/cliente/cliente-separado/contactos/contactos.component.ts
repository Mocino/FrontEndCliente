import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Option } from 'src/app/interfaces/Cliente';
import { ContactoService } from 'src/app/services/contacto.service';
import { emailValidator, telefonoValidator } from 'src/app/utils/validador-utils';
import { ClienteEliminarComponent } from '../../cliente-eliminar/cliente-eliminar.component';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {

  @Input() parentForm!: FormGroup;
  tiposContacto: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private _contactoService: ContactoService,
    public _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtenerTiposContacto();
    if (!this.parentForm.get('contactos')) {
      this.parentForm.addControl('contactos', this.fb.array([]));
    } else if (this.contactos.length === 0) {
      this.addContacto(); // Añade un contacto vacío si no hay ninguno
    }
  }

  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
  }

  createContactoGroup(): FormGroup {
    const group = this.fb.group({
      tipoContacto: ["", Validators.required],
      valorContacto: ["", Validators.required]
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

  get contactos(): FormArray {
    return this.parentForm.get('contactos') as FormArray;
  }

  addContacto(): void {
    this.contactos.push(this.createContactoGroup());
  }

  dialogRemoveContacto(index: number): void {
    if (this.contactos.length > 1) {
      const dialogRef = this._dialog.open(ClienteEliminarComponent, {
        width: '350px',
        data: { tipo: 'Contacto', item: this.contactos.at(index).value }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Eliminar') {
          this.contactos.removeAt(index);
        }
      });
    }
  }

}
