import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MetodoDePago, Option } from '../interfaces/Cliente';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  private myAppUrl: string = enviroment.endpoint;
  private myApiUrl: string = 'api/MetodosPagos/'

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los tipos de metodos disponibles.
   * @returns Un Observable que emite un array de objetos de metodos.
   */
  obtenerMetodosPagoSelect(): Observable<Option[]> {
    const tiposContactoMock: Option[] = [
      { valor: 'tarjetaCredito', nombre: 'Tarjeta de Crédito' },
      { valor: 'cuentaBancaria', nombre: 'Cuenta Bancaria' },
      { valor: 'PayPal', nombre: 'PayPal' },
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
    return this.http.get<MetodoDePago[]>(`${this.myAppUrl}${this.myApiUrl}${idCliente}/getMetodosPagos`)
  }

  /**
   * Agrega un nuevo método de pago para un cliente.
   * @param idMetodosDePago ID del cliente.
   * @param nuevoMetodosDePago Objeto que representa el nuevo método de pago.
   * @returns Un Observable que emite un array de objetos de tipo MetodoDePago actualizados.
   */
  AgregarMetodosDePago(idCliente: number, nuevoMetodosDePago: MetodoDePago): Observable<MetodoDePago[]> {
    return this.http.post<MetodoDePago[]>(`${this.myAppUrl}${this.myApiUrl}${idCliente}/MetodosPagos`, nuevoMetodosDePago)
  }

  /**
   * Edita un método de pago existente para un cliente.
   * @param idCliente ID del cliente.
   * @param idMetodosDePago ID del método de pago a editar.
   * @param nuevoMetodosDePago Objeto que representa el método de pago editado.
   * @returns Un Observable que emite un array de objetos de tipo MetodoDePago actualizados.
   */
  EditarMetodosDePago(idCliente: number, idMetodosDePago: number, nuevoMetodosDePago: MetodoDePago): Observable<MetodoDePago[]> {
    return this.http.put<MetodoDePago[]>(`${this.myAppUrl}${this.myApiUrl}${idCliente}/MetodosPagos/${idMetodosDePago}`, nuevoMetodosDePago)

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
