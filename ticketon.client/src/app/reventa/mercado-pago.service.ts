import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private apiUrl = `${environment.apiURL}/mercadopago`;

  constructor(private http: HttpClient) { }

  // Método para verificar si el usuario está vinculado con MercadoPago
  verificarVinculacion(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/vinculado`);
  }

  // Método para redirigir a la autorización de MercadoPago
  autorizarMercadoPago(usuarioId: string): void {
    const apiUrl = `${this.apiUrl}/autorizar?usuarioId=${usuarioId}`;
    window.location.href = apiUrl;
  }
}
