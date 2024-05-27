import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, of, switchMap, timer } from 'rxjs';
import { Cliente, MetodoDePago, Option } from 'src/app/interfaces/Cliente';
import { MetodoPagoService } from 'src/app/services/metodo-pago.service';
import { mostrarAlerta } from 'src/app/utils/aler-utils';
import { fechaTarjetaValidator } from 'src/app/utils/validador-utils';

@Component({
  selector: 'app-metodo-pago-agregar',
  templateUrl: './metodo-pago-agregar.component.html',
  styleUrls: ['./metodo-pago-agregar.component.css']
})
export class MetodoPagoAgregarComponent implements OnInit {

  @Input() dataCliente!: Cliente;
  @Input() metodoDePagoEditar!: MetodoDePago;
  @Output() formClosed = new EventEmitter<void>();
  @Output() contactSaved = new EventEmitter<void>();

  formMetodoPago!:  FormGroup;
  tiposMetodo: Option[] = [];
  esEditar: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _metodoPagoService: MetodoPagoService,
    private _snackBar: MatSnackBar,
  ){
    this.formMetodoPago = this.fb.group({
      idMetodoPago: 0,
      idCliente: 0,
      tipo:["", Validators.required],
      numero: ["", [Validators.required, Validators.pattern(/^\d{18}$/)], [this.numeroTarjetaValidator.bind(this)]],
      fechaVencimiento: ["", [Validators.required, fechaTarjetaValidator]],
      nombreTitular: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    this.obtenerMetodosPagoSelect();

    if(this.metodoDePagoEditar){
      this.esEditar = true;
      this.formMetodoPago.patchValue({
        idMetodoPago: this.metodoDePagoEditar.idMetodoPago,
        idCliente: this.metodoDePagoEditar.idCliente,
        tipo: this.metodoDePagoEditar.tipo,
        numero: this.metodoDePagoEditar.numero,
        fechaVencimiento: this.metodoDePagoEditar.fechaVencimiento,
        nombreTitular: this.metodoDePagoEditar.nombreTitular,
      });
    }
  }

  /**
   * Método para agregar o editar un método de pago.
   */
  addEditMetodoDePago(){
    const modelo: MetodoDePago = this.formMetodoPago.getRawValue();
    modelo.idCliente = this.dataCliente?.idCliente || 0;

    if (modelo.idMetodoPago === 0) {
      this._metodoPagoService.AgregarMetodosDePago(this.dataCliente?.idCliente!, modelo).subscribe({
        next: () => {
          this.mostrarAlerta("Metodo Pago Creado", "Listo");
          this.contactSaved.emit();
          this.formClosed.emit();
        },
        error: () => {
          this.mostrarAlerta("No se pudo crear", "Error")
        }
      });
    } else {
        this._metodoPagoService.EditarMetodosDePago(this.dataCliente?.idCliente!, this.formMetodoPago.value.idMetodoPago!, modelo).subscribe({
          next: () => {
          this.mostrarAlerta("Metodo Pago Editado", "Listo");
          this.contactSaved.emit();
          this.formClosed.emit();
        },
        error: () => {
          this.mostrarAlerta("No se pudo editar", "Error")
        }
      });
    }
  }

  /**
   * Método para obtener la tipos de metodos para select.
   */
  obtenerMetodosPagoSelect(): void {
    this._metodoPagoService.obtenerMetodosPagoSelect().subscribe(tiposMetodo => {
      this.tiposMetodo = tiposMetodo;
    });
  }

  /**
   * Valida si dpi ya existe.
   */
  numeroTarjetaValidator(control: AbstractControl): Observable<ValidationErrors | null> {
      return timer(300).pipe(
          switchMap(() => {
              if (!control.value) {
                  return of(null);
              }
              if (control.value === this.formMetodoPago.value.numero) {
                return of(null);
              }
              return this._metodoPagoService.getVerificarnumerotarjeta(control.value, this.formMetodoPago.value.idCliente).pipe(
                  map((res: any) => {
                      return res.exists ? { numExists: true } : null;
                  })
              );
          })
      );
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
   * Método para obtener los tipos de método de pago del cliente.
   * @param idCliente ID del cliente.
   */
  obtenerTipoMetodo(idCliente: number): void {
    this._metodoPagoService.getMetodosDePagoPorCliente(idCliente)
      .subscribe(tipoMetodo => {
      });
  }

  /**
   * Formatea el formulario
   */
  resetForm() {
    this.formMetodoPago.reset();
    this.esEditar = false;
  }

 /**
  * Actualiza el formulario con los datos de un contacto especificado.
  * @param metodo Datos del contacto a cargar en el formulario.
  */
  updateForm(metodo: MetodoDePago) {
    this.esEditar = true;
    this.formMetodoPago.patchValue({

      idMetodoPago: metodo.idMetodoPago,
      idCliente: metodo.idCliente,
      tipo: metodo.tipo,
      numero: metodo.numero,
      fechaVencimiento: metodo.fechaVencimiento,
      nombreTitular: metodo.nombreTitular,
    });
  }
}
