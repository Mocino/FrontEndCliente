import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MetodoDePago } from '../interfaces/Cliente';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  constructor() { }

  getMetodosDePagoPorCliente(idCliente: number): Observable<MetodoDePago[]> {
    const metodosPagoMockPorCliente: { [idCliente: number]: MetodoDePago[] } = {
      1: [
        { idMetodoPago: 1, idCliente: 1, tipo: 'Tarjeta de Crédito', numero: '1234567890123456', fechaVencimiento: new Date('2024-12-31'), nombreTitular: 'Juan Pérez' },
        { idMetodoPago: 2, idCliente: 1, tipo: 'Cuenta Bancaria', numero: '987654321', fechaVencimiento: new Date('2025-01-01'), nombreTitular: 'Juan Pérez' }
      ],
      2: [
        { idMetodoPago: 3, idCliente: 2, tipo: 'Tarjeta de Débito', numero: '9876543210987654', fechaVencimiento: new Date('2023-06-30'), nombreTitular: 'María García' }
      ],
      3: [
        { idMetodoPago: 4, idCliente: 3, tipo: 'PayPal', numero: 'juan@example.com', fechaVencimiento: new Date('2023-12-31'), nombreTitular: 'Pedro Martínez' },
        { idMetodoPago: 5, idCliente: 3, tipo: 'Transferencia Bancaria', numero: '987654321', fechaVencimiento: new Date('2024-01-01'), nombreTitular: 'Pedro Martínez' }
      ]
    };

    const metodosPagoCliente = metodosPagoMockPorCliente[idCliente] || [];
    return of(metodosPagoCliente);
  }


  AgregarMetodosDePago(idMetodosDePago: number, nuevoMetodosDePago: MetodoDePago): Observable<MetodoDePago[]> {
    console.log("idCliente:", idMetodosDePago);
    console.log("Nuevo MetodosDePago:", nuevoMetodosDePago);

    const MetodosDePagosActualizados = [nuevoMetodosDePago];
    return of(MetodosDePagosActualizados);
  }

  EditarMetodosDePago(idCliente: number, idMetodosDePago: number, nuevoMetodosDePago: MetodoDePago): Observable<MetodoDePago[]> {
    console.log("idCliente y idContacto en servicio metodo-pago:", idCliente, idMetodosDePago, nuevoMetodosDePago);

    const MetodosDePagosActualizados = [nuevoMetodosDePago];
    return of(MetodosDePagosActualizados);
  }

  deleteMetodosDePago(idCliente: number, idMetodosDePago: number): Observable<void> {
    console.log(`Solicitud de eliminación del cliente con ID ${idCliente} ${idMetodosDePago} recibida`);
    return of();
  }

}
