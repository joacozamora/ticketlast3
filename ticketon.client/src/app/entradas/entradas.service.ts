import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrada, EntradaActualizacion } from './entradas';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  private apiURL = environment.apiURL + '/entradas';

  constructor(private http: HttpClient) { }

  // Modificación para aceptar un array de entradas
  crear(entrada: Entrada): Observable<string> {
    return this.http.post<string>(this.apiURL, entrada, { responseType: 'text' as 'json' });
  }

  obtenerTodas(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiURL);
  }

  obtenerEntradasPorEvento(eventoId: number): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(`${this.apiURL}/porEvento/${eventoId}`);
  }

  obtenerEntradasConEventos(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(`${this.apiURL}/entradasConEventos`);
  }
  obtenerPorId(id: number): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiURL}/${id}`);
  }

  editar(id: number, entrada: Partial<Entrada>): Observable<void> {
    const { nombreTanda, stock, precio } = entrada;
    return this.http.put<void>(`${this.apiURL}/${id}`, { nombreTanda, stock, precio });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  
}
