//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
//export class VentaService {

//  constructor() { }
//}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarritoItem } from '../carrito/carrito-item';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = environment.apiURL + '/ventas';

  constructor(private http: HttpClient) { }

  crearVenta(items: CarritoItem[]): Observable<any> {
    // Mapear los datos necesarios para el backend
    const ventaData = {
      total: items.reduce((total, item) => total + item.precio * item.cantidad, 0),
      detallesVenta: items.map((item) => ({
        entradaId: item.entradaId,
        cantidad: item.cantidad,
      })),
    };

    // Llamar al endpoint de creación de venta
    return this.http.post<any>(this.apiUrl, ventaData);
  }

  confirmarVenta(ventaId: number): Observable<any> {
    // Confirmar la venta tras el pago
    return this.http.post<any>(`${this.apiUrl}/confirmar/${ventaId}`, {});
  }
}
