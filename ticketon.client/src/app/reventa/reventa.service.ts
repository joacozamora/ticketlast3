import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReventaDTO } from './reventa';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReventaService {
  private apiURL = environment.apiURL + '/reventas'; // URL base del controlador de reventas

  constructor(private http: HttpClient) { }

  // Método para crear una nueva reventa
  crearReventa(reventa: any): Observable<any> {
    return this.http.post<any>(this.apiURL, reventa);
  }

  // Nuevo método para obtener todas las reventas
  obtenerReventas(): Observable<ReventaDTO[]> {
    return this.http.get<ReventaDTO[]>(this.apiURL);
  }
}
