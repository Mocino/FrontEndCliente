import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MetodoDePago, Option } from '../interfaces/Cliente';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  constructor() { }

  /**
   * Obtiene los tipos de metodos disponibles.
   * @returns Un Observable que emite un array de objetos de metodos.
   */
  obtenerMetodosPagoSelect(): Observable<Option[]> {
    const tiposContactoMock: Option[] = [
      { valor: 'tarjetaCredito', nombre: 'Tarjeta de Crédito' },
      { valor: 'cuentaBancaria', nombre: 'Cuenta Bancaria' },
      { valor: 'payPal', nombre: 'PayPal' },
      { valor: 'otro', nombre: 'Otro' }
    ];
    return of(tiposContactoMock);
  }

  /**
   * Obtiene los métodos de pago asociados a un cliente.
   * @param idCliente ID del cliente.
   * @returns Un Observable que emite un array de objetos de tipo MetodoDePago.
   */
  getMetodosDePagoPorCliente(idCliente: number): Observable<MetodoDePago[]> {
    const metodosPagoMockPorCliente: { [idCliente: number]: MetodoDePago[] } = {
      1: [
        { idMetodoPago: 1, idCliente: 1, tipo: { valor: 'tarjetaCredito', nombre: 'Tarjeta de Crédito' }, numero: '1234567890123456', fechaVencimiento: new Date('2024-12-31'), nombreTitular: 'Juan Pérez' },
        { idMetodoPago: 2, idCliente: 1, tipo: { valor: 'payPal', nombre: 'PayPal' }, numero: '987654321', fechaVencimiento: new Date('2025-01-01'), nombreTitular: 'Juan Pérez' },
        { idMetodoPago: 3, idCliente: 1, tipo: { valor: 'tarjetaCredito', nombre: 'Tarjeta de Crédito' }, numero: '9876543210987654', fechaVencimiento: new Date('2023-06-30'), nombreTitular: 'María García' },
        { idMetodoPago: 4, idCliente: 1, tipo: { valor: 'payPal', nombre: 'PayPal' }, numero: 'juan@example.com', fechaVencimiento: new Date('2023-12-31'), nombreTitular: 'Pedro Martínez' },
        { idMetodoPago: 5, idCliente: 1, tipo: { valor: 'tarjetaCredito', nombre: 'Tarjeta de Crédito' }, numero: '987654321', fechaVencimiento: new Date('2024-01-01'), nombreTitular: 'A' },
        { idMetodoPago: 6, idCliente: 1, tipo: { valor: 'cuentaBancaria', nombre: 'Cuenta Bancaria' }, numero: '987654321', fechaVencimiento: new Date('2024-01-01'), nombreTitular: 'B' },
        { idMetodoPago: 7, idCliente: 1, tipo: { valor: 'cuentaBancaria', nombre: 'Cuenta Bancaria' }, numero: '987654321', fechaVencimiento: new Date('2024-01-01'), nombreTitular: 'C' },
        { idMetodoPago: 8, idCliente: 1, tipo: { valor: 'tarjetaCredito', nombre: 'Tarjeta de Crédito' }, numero: '987654321', fechaVencimiento: new Date('2024-01-01'), nombreTitular: 'D' }
      ],
      2: [
      ],
      3: [
      ]
    };

    const metodosPagoCliente = metodosPagoMockPorCliente[idCliente] || [];
    return of(metodosPagoCliente);
  }

  /**
   * Agrega un nuevo método de pago para un cliente.
   * @param idMetodosDePago ID del cliente.
   * @param nuevoMetodosDePago Objeto que representa el nuevo método de pago.
   * @returns Un Observable que emite un array de objetos de tipo MetodoDePago actualizados.
   */
  AgregarMetodosDePago(idMetodosDePago: number, nuevoMetodosDePago: MetodoDePago): Observable<MetodoDePago[]> {
    console.log("idCliente:", idMetodosDePago);
    console.log("Nuevo MetodosDePago:", nuevoMetodosDePago);

    const MetodosDePagosActualizados = [nuevoMetodosDePago];
    return of(MetodosDePagosActualizados);
  }

  /**
   * Edita un método de pago existente para un cliente.
   * @param idCliente ID del cliente.
   * @param idMetodosDePago ID del método de pago a editar.
   * @param nuevoMetodosDePago Objeto que representa el método de pago editado.
   * @returns Un Observable que emite un array de objetos de tipo MetodoDePago actualizados.
   */
  EditarMetodosDePago(idCliente: number, idMetodosDePago: number, nuevoMetodosDePago: MetodoDePago): Observable<MetodoDePago[]> {
    console.log("idCliente y idContacto en servicio metodo-pago:", idCliente, idMetodosDePago, nuevoMetodosDePago);

    const MetodosDePagosActualizados = [nuevoMetodosDePago];
    return of(MetodosDePagosActualizados);
  }

  /**
   * Elimina un método de pago asociado a un cliente.
   * @param idCliente ID del cliente.
   * @param idMetodosDePago ID del método de pago a eliminar.
   * @returns Un Observable que indica la realización de la operación de eliminación.
   */
  deleteMetodosDePago(idCliente: number, idMetodosDePago: number): Observable<void> {
    console.log(`Solicitud de eliminación del cliente con ID ${idCliente} ${idMetodosDePago} recibida`);
    return of();
  }

}
