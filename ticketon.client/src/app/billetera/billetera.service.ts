import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BilleteraDTO } from './billetera';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BilleteraService {
  private apiURL = environment.apiURL + '/billetera'; // Ajusta la URL a la configuración de tu backend
  
  constructor(private http: HttpClient) { }

  obtenerEntradasBilletera(usuarioId: string): Observable<BilleteraDTO[]> {
    const url = `${this.apiURL}/usuario/${usuarioId}`;
    console.log("URL de la billetera:", url); // Para verificar que la URL sea correcta
    return this.http.get<BilleteraDTO[]>(url);
  }
  obtenerEntradasBilleteraPorCorreo(correo: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/correo/${correo}`);
  }
  
}
