//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
//export class VentaService {

//  constructor() { }
//}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CarritoService } from '../carrito/carrito.service';
import { CarritoItem } from '../carrito/carrito-item';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = environment.apiURL + '/ventas';

  constructor(private http: HttpClient) { }

  crearVenta(carritoItems: CarritoItem[]): Observable<any> {
    const venta = this.montarVenta(carritoItems);
    return this.http.post(this.apiUrl, venta);
  }

  private montarVenta(carritoItems: CarritoItem[]) {
    return {
      fechaVenta: new Date(),
      total: carritoItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0),
      detallesVenta: carritoItems.map(item => ({
        entradaId: item.entradaId,
        precioVenta: item.precio
      }))
    };
  }
}
