import { Injectable } from '@angular/core';
import { Cliente} from '../interfaces/Cliente';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }

  /**
   * Obtiene la lista de clientes.
   * @returns Un Observable que emite un array de objetos de tipo Cliente.
   */
  getClientes(): Observable<Cliente[]> {
    const clientesMock: Cliente[] = [
      {
        idCliente: 1,
        nombres: 'Juan',
        apellidos: 'Pérez',
        direccion: 'Calle 123, Ciudad',
        fechaNacimiento: new Date('1990-05-15'),
        dpi: '1234567890101',
        nit: 'C123456789',
        empresa: 'Empresa A',
        contactos: [],
        metodosDePago: [
        ]
      },
      {
        idCliente: 2,
        nombres: 'María',
        apellidos: 'López',
        direccion: 'Avenida 456, Pueblo',
        fechaNacimiento: new Date('1985-08-20'),
        dpi: '9876543210101',
        nit: 'C987654321',
        empresa: 'Empresa B',
        contactos: [],
        metodosDePago: [
        ]
      },
      {
        idCliente: 3,
        nombres: 'Pedro',
        apellidos: 'García',
        direccion: 'Avenida 789, Pueblo',
        fechaNacimiento: new Date('1982-03-10'),
        dpi: '4567890120101',
        nit: 'C456789012',
        empresa: 'Empresa C',
        contactos: [],
        metodosDePago: [
        ]
      },
      {
        idCliente: 4,
        nombres: 'Luisa',
        apellidos: 'Martínez',
        direccion: 'Calle 456, Ciudad',
        fechaNacimiento: new Date('1995-12-28'),
        dpi: '6543210980101',
        nit: 'C654321098',
        empresa: 'Empresa D',
        contactos: [],
        metodosDePago: [
        ]
      },
      {
        idCliente: 5,
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        direccion: 'Calle 789, Ciudad',
        fechaNacimiento: new Date('1988-07-15'),
        dpi: '7890123450101',
        nit: 'C789012345',
        empresa: 'Empresa E',
        contactos: [],
        metodosDePago: [
        ]
      },
      {
        idCliente: 6,
        nombres: 'Pedro',
        apellidos: 'García',
        direccion: 'Avenida 789, Pueblo',
        fechaNacimiento: new Date('1982-03-10'),
        dpi: '4567890120101',
        nit: 'C456789012',
        empresa: 'Empresa C',
        contactos: [],
        metodosDePago: [
        ]
      }
    ];
    return of(clientesMock);
  }

  /**
   * Guarda un nuevo cliente.
   * @param nuevoCliente Objeto que representa el nuevo cliente a guardar.
   * @returns Un Observable que indica si el cliente se guardó correctamente.
   */
  guardarCliente(nuevoCliente: Cliente): Observable<boolean> {
    console.log('Nuevo cliente guardado:', nuevoCliente);
    return of(true);
  }

  /**
   * Actualiza un cliente existente.
   * @param idCliente ID del cliente a actualizar.
   * @param modelo Objeto que representa los datos actualizados del cliente.
   * @returns Un Observable que emite el objeto Cliente actualizado.
   */
  updateCliente(idCliente: number, modelo: Cliente): Observable<Cliente> {
    console.log("idCliente y idContacto en servicio metodo-pago:", idCliente, modelo);

    return of(modelo);
  }

  /**
   * Elimina un cliente.
   * @param idCliente ID del cliente a eliminar.
   * @returns Un Observable que indica si la eliminación del cliente fue exitosa.
   */
  deleteCliente(idCliente: number): Observable<void> {
    console.log(`Solicitud de eliminación del cliente con ID ${idCliente} recibida`);
    return of();
  }
}
