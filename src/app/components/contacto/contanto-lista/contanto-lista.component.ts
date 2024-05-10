import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente, Contacto, TipoContacto } from 'src/app/interfaces/Cliente';
import { ContactoService } from 'src/app/services/contacto.service';

@Component({
  selector: 'app-contanto-lista',
  templateUrl: './contanto-lista.component.html',
  styleUrls: ['./contanto-lista.component.css']
})
export class ContantoListaComponent {

  formContacto!:  FormGroup;
  displayedColumns: string[] = ['tipoContacto', 'valorContacto'];
  tiposContacto: TipoContacto[] = [];
  dataSource = new MatTableDataSource<Contacto>();
  showForm: boolean = false;

  constructor(
    private dialogReferencia: MatDialogRef<ContantoListaComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCliente: Cliente,
    private _contactoService: ContactoService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
  ) {
    this.formContacto = this.fb.group({
      tipoContacto:["", Validators.required],
      valorContacto: this.fb.control('', Validators.required)
    })
   }

  ngOnInit(): void {
    this.obtenerContactosPorCliente(this.dataCliente.idCliente);
    this.agregarValidadorValorContacto();
    this.obtenerTiposContacto();

  }


  obtenerTiposContacto(): void {
    this._contactoService.getTiposContacto().subscribe(tiposContacto => {
      this.tiposContacto = tiposContacto;
    });
  }


  obtenerContactosPorCliente(idCliente: number): void {
    this._contactoService.getContactosPorCliente(idCliente)
      .subscribe(contactos => {
        this.dataSource.data = contactos;
      });
  }

  /**
   * Método para agregar o editar un Contacto.
   */
  addEditContacto(){
    const modelo: Contacto = {
      idContacto: 0,
      idCliente: this.dataCliente.idCliente,
      tipoContacto: this.formContacto.value.tipoContacto,
      valorContacto: this.formContacto.value.valorContacto,
    }

      this._contactoService.AgregarContacto(this.dataCliente.idCliente, modelo).subscribe({
        next:(data)=>{
          this.mostrarAlerta("Cliente Creado", "Listo");
          this.dialogReferencia.close("Creado")
        }, error:(e)=>{
          this.mostrarAlerta("No se pudo crear", "Error")
        }
      })

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

  validarValorContacto(control: AbstractControl): { [key: string]: boolean } | null {
    const tipoContacto = this.formContacto.get('tipoContacto')?.value;
    const valorContacto = control.value;

    if (tipoContacto === 'email') {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(valorContacto)) {
        return { emailInvalido: true };
      }
    } else if (tipoContacto === 'telefono') {
      const telefonoRegex = /^\d{8}$/;
      if (!telefonoRegex.test(valorContacto)) {
        return { telefonoInvalido: true };
      }
    }

    return null;
  }

  agregarValidadorValorContacto() {
    const validadorValorContacto = this.validarValorContacto.bind(this);
    this.formContacto.get('valorContacto')?.setValidators([Validators.required, validadorValorContacto]);
    this.formContacto.get('valorContacto')?.updateValueAndValidity();
  }

  toggleForm() {
    this.showForm = !this.showForm; // Cambiar el valor de la variable para mostrar u ocultar el formulario
  }
}
