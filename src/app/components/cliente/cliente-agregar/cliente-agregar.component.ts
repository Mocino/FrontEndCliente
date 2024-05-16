import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, of, switchMap, timer } from 'rxjs';
import { Cliente } from 'src/app/interfaces/Cliente';
import { ClienteService } from 'src/app/services/Cliente.service';


@Component({
  selector: 'app-cliente-agregar',
  templateUrl: './cliente-agregar.component.html',
  styleUrls: ['./cliente-agregar.component.css'],

})
export class ClienteAgregarComponent implements OnInit{

  formCliente!: FormGroup;
  tituloaccion:string = "Nuevo";
  botonAccion:string = "Nuevo";
  listaCliente: Cliente[]=[];

  constructor(
    private dialogReferencia: MatDialogRef<ClienteAgregarComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _clienteServicio: ClienteService,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente
  ) {
    this.formCliente = this.fb.group({
      idCliente: 0,
      nombres:["", Validators.required],
      apellidos:["", Validators.required],
      direccion:["", Validators.required],
      fechaNacimiento: ["", [Validators.required, this.fechaNacimientoValidator]],
      dpi: ["", [Validators.required, Validators.pattern(/^\d{13}$/)], [this.dpiValidator.bind(this)]],
      nit: ["", [Validators.required, Validators.pattern(/^\d{6,12}K$/)]],
      empresa:["", Validators.required],
    })


    this._clienteServicio.getClientes().subscribe({
      next:(data)=>{
        this.listaCliente = data;
      }, error:(e)=>{}
    })
  }

  ngOnInit(): void {
    if(this.dataCliente){
      this.formCliente.patchValue({
        idCliente: this.dataCliente.idCliente,
        nombres: this.dataCliente.nombres,
        apellidos: this.dataCliente.apellidos,
        direccion: this.dataCliente.direccion,
        fechaNacimiento: this.dataCliente.fechaNacimiento,
        dpi: this.dataCliente.dpi,
        nit: this.dataCliente.nit,
        empresa: this.dataCliente.empresa})

        this.tituloaccion = "Editar";
        this.botonAccion = "Actualizar";
    }
  }

  /**
   * Método para mostrar una alerta utilizando MatSnackBar.
   * @param msg Mensaje a mostrar en la alerta.
   * @param accion Acción de la alerta.
   */
  mostrarAlerta(msg:string, accion: string){
    this._snackBar.open(msg, accion,{
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  /**
   * Método para agregar o editar un cliente.
   */
  addEditCliente(){
    console.log(this.botonAccion, this.formCliente.value)
    const modelo: Cliente = {
      idCliente: this.formCliente.value.idCliente!,
      nombres: this.formCliente.value.nombres,
      apellidos: this.formCliente.value.apellidos,
      direccion: this.formCliente.value.direccion,
      fechaNacimiento: this.formCliente.value.fechaNacimiento,
      dpi: this.formCliente.value.dpi,
      nit: this.formCliente.value.nit,
      empresa: this.formCliente.value.empresa,
    }

    console.log("contenido de idCliente", this.dataCliente?.idCliente)
    console.log("contenido de modelo cliente:", modelo)

    if(this.dataCliente == null){
      this._clienteServicio.guardarCliente(modelo).subscribe({
        next:()=>{
          this.mostrarAlerta("Cliente Creado", "Listo");
          this.dialogReferencia.close("Creado")
        }, error:()=>{
          this.mostrarAlerta("No se pudo crear", "Error")
        }
      })
    } else {
      this._clienteServicio.updateCliente(this.dataCliente.idCliente!, modelo).subscribe({
        next:()=>{
          this.mostrarAlerta("Cliente Editado", "Listo");
          this.dialogReferencia.close("Editado")
        }, error:()=>{
          this.mostrarAlerta("No se pudo Editado", "Error")
        }
      })
    }

  }

  /**
   * Valida si dpi ya existe.
   */
  dpiValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return timer(300).pipe(
        switchMap(() => {
            if (!control.value) {
                return of(null);
            }

            if (this.tituloaccion == 'Editar' && control.value == this.dataCliente.dpi){
              return of(null);
            }
            return this._clienteServicio.getVerificarDPI(control.value).pipe(
                map((res: any) => {
                    return res.exists ? { dpiExists: true } : null;
                })
            );
        })
    );
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


}
