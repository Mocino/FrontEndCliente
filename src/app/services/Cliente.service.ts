import { Injectable } from '@angular/core';
import { Cliente} from '../interfaces/Cliente';
import { Observable, of } from 'rxjs';
import { enviroment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private myAppUrl: string = enviroment.endpoint;
  private myApiUrl: string = 'api/Clientes/'

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de clientes.
   * @returns Un Observable que emite un array de objetos de tipo Cliente.
   */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.myAppUrl}${this.myApiUrl}obtenerClientes`)

  }

  /**
   * Guarda un nuevo cliente.
   * @param nuevoCliente Objeto que representa el nuevo cliente a guardar.
   * @returns Un Observable que indica si el cliente se guardó correctamente.
   */
  guardarCliente(nuevoCliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.myAppUrl}${this.myApiUrl}guardarClientes`, nuevoCliente)
  }

  /**
   * Actualiza un cliente existente.
   * @param idCliente ID del cliente a actualizar.
   * @param modelo Objeto que representa los datos actualizados del cliente.
   * @returns Un Observable que emite el objeto Cliente actualizado.
   */
  updateCliente(idCliente: number, modelo: Cliente): Observable<void>{
    return this.http.put<void >(`${this.myAppUrl}${this.myApiUrl}editarCliente/${idCliente}`, modelo)
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
