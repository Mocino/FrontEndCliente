import { Injectable } from '@angular/core';
import { Contacto, TipoContacto } from '../interfaces/Cliente';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ContactoService {



  constructor() { }

  getTiposContacto(): Observable<TipoContacto[]> {
    const tiposContactoMock: TipoContacto[] = [
      { valor: 'email', nombre: 'Correo electrónico' },
      { valor: 'telefono', nombre: 'Teléfono' },
      { valor: 'direccion', nombre: 'Dirección' }
    ];
    return of(tiposContactoMock);
  }

  getContactosPorCliente(idCliente: number): Observable<Contacto[]> {
    const contactosMockPorCliente: { [idCliente: number]: Contacto[] } = {
      1: [
        { idContacto: 1, idCliente: 1, tipoContacto: 'Email', valorContacto: 'juan@example.com' },
        { idContacto: 2, idCliente: 1, tipoContacto: 'Telefono', valorContacto: '123456789' },
        { idContacto: 3, idCliente: 1, tipoContacto: 'Celular', valorContacto: '987654321' }
      ],
      3: [
        { idContacto: 4, idCliente: 3, tipoContacto: 'Email', valorContacto: 'pedro@example.com' },
        { idContacto: 5, idCliente: 3, tipoContacto: 'Telefono', valorContacto: '987654321' }
      ],
      6: [
        { idContacto: 6, idCliente: 6, tipoContacto: 'Si', valorContacto: 'Funciona' },
        { idContacto: 7, idCliente: 6, tipoContacto: 'por', valorContacto: 'ID' }
      ]
    };

    const contactosCliente = contactosMockPorCliente[idCliente] || [];
    return of(contactosCliente);
  }

  AgregarContacto(idCliente: number, nuevoContacto: Contacto): Observable<Contacto[]> {
    console.log("idCliente:", idCliente);
    console.log("Nuevo Contacto:", nuevoContacto);

    const contactosActualizados = [nuevoContacto];
    return of(contactosActualizados);
  }

  EditarContacto(idCliente: number, idContacto: number, nuevoContacto: Contacto): Observable<Contacto[]> {
    console.log("idCliente:", idCliente);
    console.log("Contacto Editado:", nuevoContacto);

    const contactosActualizados = [nuevoContacto];
    return of(contactosActualizados);
  }

}
