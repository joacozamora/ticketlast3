import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntradaVentaDTO } from './billetera';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BilleteraService {
  private apiURL = environment.apiURL + '/entradas-venta'; 
  
  constructor(private http: HttpClient) { }

  
  obtenerEntradasPorCorreo(correo: string): Observable<EntradaVentaDTO[]> {
    return this.http.get<EntradaVentaDTO[]>(`${this.apiURL}/correo/${correo}`);
  }

  
}
