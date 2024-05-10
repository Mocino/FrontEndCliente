import { Injectable } from '@angular/core';
import { Cliente, TipoContacto, TipoPago } from '../interfaces/Cliente';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }

  getClientes(): Observable<Cliente[]> {
    const clientesMock: Cliente[] = [
      {
        id: 1,
        nombres: 'Juan',
        apellidos: 'Pérez',
        direccion: 'Calle 123, Ciudad',
        fechaNacimiento: new Date('1990-05-15'),
        dpi: '1234567890101',
        nit: 'C123456789',
        empresa: 'Empresa A',
        contactos: [
          { tipoContacto: TipoContacto.Email, valorContacto: 'juan@example.com' },
          { tipoContacto: TipoContacto.Telefono, valorContacto: '123456789' }
        ],
        metodosDePago: [
          { tipo: TipoPago.TarjetaDeCredito, numero: '1234 5678 9012 3456', fechaVencimiento: new Date('2026-12-01'), nombreTitular: 'Juan Pérez' }
        ]
      },
      {
        id: 2,
        nombres: 'María',
        apellidos: 'López',
        direccion: 'Avenida 456, Pueblo',
        fechaNacimiento: new Date('1985-08-20'),
        dpi: '9876543210101',
        nit: 'C987654321',
        empresa: 'Empresa B',
        contactos: [
          { tipoContacto: TipoContacto.Email, valorContacto: 'maria@example.com' },
          { tipoContacto: TipoContacto.Telefono, valorContacto: '987654321' }
        ],
        metodosDePago: [
          { tipo: TipoPago.PayPal, numero: 'maria@example.com', fechaVencimiento: new Date('2027-01-01'), nombreTitular: 'María López' }
        ]
      },
      {
        id: 3,
        nombres: 'Pedro',
        apellidos: 'García',
        direccion: 'Avenida 789, Pueblo',
        fechaNacimiento: new Date('1982-03-10'),
        dpi: '4567890120101',
        nit: 'C456789012',
        empresa: 'Empresa C',
        contactos: [
          { tipoContacto: TipoContacto.Telefono, valorContacto: '654321987' }
        ],
        metodosDePago: [
          { tipo: TipoPago.TarjetaDeCredito, numero: '9876 5432 1098 7654', fechaVencimiento: new Date('2025-11-01'), nombreTitular: 'Pedro García' }
        ]
      },
      {
        id: 4,
        nombres: 'Luisa',
        apellidos: 'Martínez',
        direccion: 'Calle 456, Ciudad',
        fechaNacimiento: new Date('1995-12-28'),
        dpi: '6543210980101',
        nit: 'C654321098',
        empresa: 'Empresa D',
        contactos: [
          { tipoContacto: TipoContacto.Telefono, valorContacto: '123987456' }
        ],
        metodosDePago: [
          { tipo: TipoPago.TarjetaDeCredito, numero: '5678 9012 3456 7890', fechaVencimiento: new Date('2024-10-01'), nombreTitular: 'Luisa Martínez' }
        ]
      },
      {
        id: 5,
        nombres: 'Carlos',
        apellidos: 'Rodríguez',
        direccion: 'Calle 789, Ciudad',
        fechaNacimiento: new Date('1988-07-15'),
        dpi: '7890123450101',
        nit: 'C789012345',
        empresa: 'Empresa E',
        contactos: [
          { tipoContacto: TipoContacto.Email, valorContacto: 'carlos@example.com' }
        ],
        metodosDePago: [
          { tipo: TipoPago.Otra, numero: '1234567890', fechaVencimiento: new Date('2023-06-01'), nombreTitular: 'Carlos Rodríguez' }
        ]
      },
      {
        id: 6,
        nombres: 'Pedro',
        apellidos: 'García',
        direccion: 'Avenida 789, Pueblo',
        fechaNacimiento: new Date('1982-03-10'),
        dpi: '4567890120101',
        nit: 'C456789012',
        empresa: 'Empresa C',
        contactos: [
          { tipoContacto: TipoContacto.Telefono, valorContacto: '654321987' }
        ],
        metodosDePago: [
          { tipo: TipoPago.TarjetaDeCredito, numero: '9876 5432 1098 7654', fechaVencimiento: new Date('2025-11-01'), nombreTitular: 'Pedro García' }
        ]
      }
    ];
    return of(clientesMock);
  }


  guardarCliente(nuevoCliente: Cliente): Observable<boolean> {
    console.log('Nuevo cliente guardado:', nuevoCliente);
    return of(true);
  }

  updateCliente(idEmpleado: number, modelo: Cliente): Observable<Cliente> {
    console.log(`Solicitud de actualización del empleado con ID ${idEmpleado} recibida.`);
    return of(modelo);
  }

  deleteCliente(idCliente: number): Observable<void> {
    console.log(`Solicitud de eliminación del cliente con ID ${idCliente} recibida`);
    return of();
  }
}
