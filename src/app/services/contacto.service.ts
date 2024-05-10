import { Injectable } from '@angular/core';
import { Contacto } from '../interfaces/Cliente';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor() { }

  getContactosPorCliente(idCliente: number): Observable<Contacto[]> {
    const contactosMockPorCliente: { [idCliente: number]: Contacto[] } = {
      1: [
        { tipoContacto: 'Email', valorContacto: 'juan@example.com' },
        { tipoContacto: 'Telefono', valorContacto: '123456789' },
        { tipoContacto: 'Celular', valorContacto: '987654321' }
      ],
      3: [
        { tipoContacto: 'Email', valorContacto: 'pedro@example.com' },
        { tipoContacto: 'Telefono', valorContacto: '987654321' }
      ]
    };

    const contactosCliente = contactosMockPorCliente[idCliente] || [];
    return of(contactosCliente);
  }
}
