import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Option } from 'src/app/interfaces/Cliente';
import { MetodoPagoService } from 'src/app/services/metodo-pago.service';
import { fechaTarjetaValidator } from 'src/app/utils/validador-utils';
import { ClienteEliminarComponent } from '../../cliente-eliminar/cliente-eliminar.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.css']
})
export class MetodosPagoComponent implements OnInit {

  @Input() parentForm!: FormGroup;
  tiposMetodo: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private _metodoPagoService: MetodoPagoService,
    public _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerMetodosPagoSelect();
    if (!this.parentForm.get('metodosDePago')) {
      this.parentForm.addControl('metodosDePago', this.fb.array([]));
    } else if (this.metodosDePago.length === 0) {
      this.addMetodosPago(); // Añade un método de pago vacío si no hay ninguno
    }
  }

  obtenerMetodosPagoSelect(): void {
    this._metodoPagoService.obtenerMetodosPagoSelect().subscribe(tiposMetodo => {
      this.tiposMetodo = tiposMetodo;
    });
  }

  createMetodoPagoGroup(): FormGroup {
    return this.fb.group({
      tipo: ["", Validators.required],
      numero: ["", [Validators.required, Validators.pattern(/^\d{13}$|^\d{18}$/)]],
      fechaVencimiento: ["", [Validators.required, fechaTarjetaValidator]],
      nombreTitular: ["", Validators.required]
    });
  }

  get metodosDePago(): FormArray {
    return this.parentForm.get('metodosDePago') as FormArray;
  }

  addMetodosPago(): void {
    this.metodosDePago.push(this.createMetodoPagoGroup());
  }

  DialogRemoveMetodosPago(index: number): void {
    if (this.metodosDePago.length > 1) {
      const dialogRef = this._dialog.open(ClienteEliminarComponent, {
        width: '350px',
        data: {  }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Eliminar') {
          this.metodosDePago.removeAt(index);
        }
      });
    }
  }
}
