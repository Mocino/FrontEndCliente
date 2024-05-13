import { Injectable } from '@angular/core';
import { Contacto, Option } from '../interfaces/Cliente';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private myAppUrl: string = enviroment.endpoint;
  private myApiUrl: string = 'api/Contacto/'

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los tipos de contacto disponibles.
   * @returns Un Observable que emite un array de objetos de tipo TipoContacto.
   */
  getTiposContacto(): Observable<Option[]> {
    return this.http.get<Option[]>(`${this.myAppUrl}api/TiposContacto/obtenerTiposContacto`)
  }

  /**
   * Obtiene los contactos asociados a un cliente.
   * @param idContacto ID del cliente.
   * @returns Un Observable que emite un array de objetos de tipo Contacto.
   */
  getContactosPorCliente(idCliente: number): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(`${this.myAppUrl}${this.myApiUrl}${idCliente}/contactos`)
  }

  /**
   * Agrega un nuevo contacto para un cliente.
   * @param idContacto ID del cliente.
   * @param nuevoContacto Objeto que representa el nuevo contacto.
   * @returns Un Observable que emite un array de objetos de tipo Contacto actualizados.
   */

  AgregarContacto(idContacto: number, nuevoContacto: Contacto): Observable<Contacto[]> {
    return this.http.post<Contacto[]>(`${this.myAppUrl}${this.myApiUrl}${idContacto}/contactos`, nuevoContacto)
  }

  /**
   * Edita un contacto existente para un cliente.
   * @param idCliente ID del cliente.
   * @param idContacto ID del contacto a editar.
   * @param nuevoContacto Objeto que representa el contacto editado.
   * @returns Un Observable que emite un array de objetos de tipo Contacto actualizados.
   */
  EditarContacto(idCliente: number, idContacto: number, nuevoContacto: Contacto): Observable<Contacto[]> {
    return this.http.put<Contacto[]>(`${this.myAppUrl}${this.myApiUrl}${idCliente}/contactos/${idContacto}`, nuevoContacto)

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
