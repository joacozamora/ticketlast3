//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
//export class EntradasService {

//  constructor() { }
//}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrada } from './entradas';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EntradasService {

  private apiURL = environment.apiURL + '/entradas'; // Ajusta el puerto y la URL si es necesario

  constructor(private http: HttpClient) { }

  crear(entrada: Entrada): Observable<Entrada> {
    return this.http.post<Entrada>(this.apiURL, entrada);
  }

  obtenerTodas(): Observable<Entrada[]> {
    return this.http.get<Entrada[]>(this.apiURL);
  }

  obtenerPorId(id: number): Observable<Entrada> {
    return this.http.get<Entrada>(`${this.apiURL}/${id}`);
  }

  editar(id: number, entrada: Entrada): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/${id}`, entrada);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
