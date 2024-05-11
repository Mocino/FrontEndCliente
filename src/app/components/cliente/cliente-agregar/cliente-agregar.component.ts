import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from 'src/app/interfaces/Cliente';
import { ClienteService } from 'src/app/services/Cliente.service';

export const MY_DATE_FORMS = {
  parse: {
    dateInput: 'DD/MM/YYY',
  },
  display:{
    dateInput: 'DD/MMM/YYYY',
    dateA11yLabel: 'LL',
    mounthYearA11yLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-cliente-agregar',
  templateUrl: './cliente-agregar.component.html',
  styleUrls: ['./cliente-agregar.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMS}
  ]
})
export class ClienteAgregarComponent implements OnInit{

  formCliente!: FormGroup;
  tituloaccion:string = "Nuevo";
  botonAccion:string = "Guardar";
  listaCliente: Cliente[]=[];

  constructor(
    private dialogReferencia: MatDialogRef<ClienteAgregarComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _clienteServicio: ClienteService,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente
  ) {
    this.formCliente = this.fb.group({
      nombres:["", Validators.required],
      apellidos:["", Validators.required],
      direccion:["", Validators.required],
      fechaNacimiento:["", Validators.required],
      dpi:["", Validators.required],
      nit:["", Validators.required],
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
      idCliente: 0,
      nombres: this.formCliente.value.nombres,
      apellidos: this.formCliente.value.apellidos,
      direccion: this.formCliente.value.direccion,
      fechaNacimiento: this.formCliente.value.fechaNacimiento,
      dpi: this.formCliente.value.dpi,
      nit: this.formCliente.value.nit,
      empresa: this.formCliente.value.empresa,
    }

    console.log("contenido de modelo cliente:"+modelo)

    if(this.dataCliente == null){
      this._clienteServicio.guardarCliente(modelo).subscribe({
        next:(data)=>{
          this.mostrarAlerta("Cliente Creado", "Listo");
          this.dialogReferencia.close("Creado")
        }, error:(e)=>{
          this.mostrarAlerta("No se pudo crear", "Error")
        }
      })
    } else {
      this._clienteServicio.updateCliente(this.dataCliente.idCliente, modelo).subscribe({
        next:(data)=>{
          this.mostrarAlerta("Cliente Editado", "Listo");
          this.dialogReferencia.close("Editado")
        }, error:(e)=>{
          this.mostrarAlerta("No se pudo Editado", "Error")
        }
      })
    }

  }

}
