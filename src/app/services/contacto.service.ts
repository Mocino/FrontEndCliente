import { Injectable } from '@angular/core';
import { Contacto, TipoContacto } from '../interfaces/Cliente';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ContactoService {



  constructor() { }

  /**
   * Obtiene los tipos de contacto disponibles.
   * @returns Un Observable que emite un array de objetos de tipo TipoContacto.
   */
  getTiposContacto(): Observable<TipoContacto[]> {
    const tiposContactoMock: TipoContacto[] = [
      { valor: 'email', nombre: 'Correo electrónico' },
      { valor: 'telefono', nombre: 'Teléfono' },
      { valor: 'direccion', nombre: 'Dirección' }
    ];
    return of(tiposContactoMock);
  }

  /**
   * Obtiene los contactos asociados a un cliente.
   * @param idContacto ID del cliente.
   * @returns Un Observable que emite un array de objetos de tipo Contacto.
   */
  getContactosPorCliente(idCliente: number): Observable<Contacto[]> {
    const contactosMockPorCliente: { [idCliente: number]: Contacto[] } = {
      1: [
        { idContacto: 1, idCliente: 1, tipoContacto: { valor: 'email', nombre: 'Correo electrónico' }, valorContacto: 'juan@example.com' },
        { idContacto: 2, idCliente: 1, tipoContacto: { valor: 'telefono', nombre: 'Teléfono' }, valorContacto: '123456789' },
        { idContacto: 3, idCliente: 1, tipoContacto: { valor: 'direccion', nombre: 'Direccion' }, valorContacto: '987654321' },
        { idContacto: 4, idCliente: 1, tipoContacto: { valor: 'email', nombre: 'Correo electrónico' }, valorContacto: 'juan@example.com' },
        { idContacto: 5, idCliente: 1, tipoContacto: { valor: 'telefono', nombre: 'Teléfono' }, valorContacto: '123456789' },
        { idContacto: 6, idCliente: 1, tipoContacto: { valor: 'direccion', nombre: 'Direccion' }, valorContacto: '987654321' },
        { idContacto: 7, idCliente: 1, tipoContacto: { valor: 'email', nombre: 'Correo electrónico' }, valorContacto: 'juan@example.com' },
        { idContacto: 8, idCliente: 1, tipoContacto: { valor: 'telefono', nombre: 'Teléfono' }, valorContacto: '123456789' },
        { idContacto: 9, idCliente: 1, tipoContacto: { valor: 'direccion', nombre: 'Direccion' }, valorContacto: '987654321' }
      ],
      3: [
        { idContacto: 4, idCliente: 3, tipoContacto: { valor: 'email', nombre: 'Correo electrónico' }, valorContacto: 'pedro@example.com' },
        { idContacto: 5, idCliente: 3, tipoContacto: { valor: 'telefono', nombre: 'Teléfono' }, valorContacto: '987654321' }
      ],
      6: [
        { idContacto: 6, idCliente: 6, tipoContacto: { valor: 'direccion', nombre: 'direccion' }, valorContacto: 'Funciona' },
        { idContacto: 7, idCliente: 6, tipoContacto: { valor: 'direccion', nombre: 'direccion' }, valorContacto: 'ID' }
      ]
    };

    const contactosCliente = contactosMockPorCliente[idCliente] || [];
    return of(contactosCliente);
  }

  /**
   * Agrega un nuevo contacto para un cliente.
   * @param idContacto ID del cliente.
   * @param nuevoContacto Objeto que representa el nuevo contacto.
   * @returns Un Observable que emite un array de objetos de tipo Contacto actualizados.
   */

  AgregarContacto(idContacto: number, nuevoContacto: Contacto): Observable<Contacto[]> {
    console.log("idCliente:", idContacto);
    console.log("Nuevo Contacto:", nuevoContacto);

    const contactosActualizados = [nuevoContacto];
    return of(contactosActualizados);
  }

  /**
   * Edita un contacto existente para un cliente.
   * @param idCliente ID del cliente.
   * @param idContacto ID del contacto a editar.
   * @param nuevoContacto Objeto que representa el contacto editado.
   * @returns Un Observable que emite un array de objetos de tipo Contacto actualizados.
   */
  EditarContacto(idCliente: number, idContacto: number, nuevoContacto: Contacto): Observable<Contacto[]> {
    console.log("idCliente y idContacto en servicio contacto:", idCliente, idContacto, nuevoContacto);

    const contactosActualizados = [nuevoContacto];
    return of(contactosActualizados);
  }

  /**
   * Elimina un contacto asociado a un cliente.
   * @param idCliente ID del cliente.
   * @param idContacto ID del contacto a eliminar.
   * @returns Un Observable que indica la realización de la operación de eliminación.
   */
  deleteContacto(idCliente: number, idContacto: number): Observable<void> {
    console.log(`Solicitud de eliminación del cliente con ID ${idCliente} ${idContacto} recibida`);
    return of();
  }

}
