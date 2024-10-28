//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
//export class CarritoService {

//  constructor() { }
//}

//import { Injectable } from '@angular/core';
//import { CarritoItem } from './carrito-item';
//import { VentaService } from '../venta/venta.service';
//import { Observable } from 'rxjs';

//@Injectable({
//  providedIn: 'root'
//})
//export class CarritoService {

//  private readonly localStorageKey = 'carrito';

//  constructor(private ventaService: VentaService) { }

//  obtenerCarrito(): CarritoItem[] {
//    const carritoString = localStorage.getItem(this.localStorageKey);
//    return carritoString ? JSON.parse(carritoString) : [];
//  }

//  agregarAlCarrito(item: CarritoItem): void {
//    const carrito = this.obtenerCarrito();
//    carrito.push(item);
//    localStorage.setItem(this.localStorageKey, JSON.stringify(carrito));
//  }

//  eliminarDelCarrito(entradaId: number): void {
//    const carrito = this.obtenerCarrito().filter(item => item.entradaId !== entradaId);
//    localStorage.setItem(this.localStorageKey, JSON.stringify(carrito));
//  }

//  vaciarCarrito(): void {
//    localStorage.removeItem(this.localStorageKey);
//  }

//  confirmarCompra(): Observable<any> {
//    const carritoItems = this.obtenerCarrito();
//    return this.ventaService.crearVenta(carritoItems);
//  }
//}


import { Injectable } from '@angular/core';
import { CarritoItem } from './carrito-item';
import { VentaService } from '../venta/venta.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private readonly localStorageKey = 'carrito';

  constructor(private ventaService: VentaService) { }



  obtenerCarrito(): CarritoItem[] {
    const carritoString = localStorage.getItem(this.localStorageKey);
    return carritoString ? JSON.parse(carritoString) : [];
  }

  agregarAlCarrito(item: CarritoItem): void {
    const carrito = this.obtenerCarrito();
    carrito.push(item);
    localStorage.setItem(this.localStorageKey, JSON.stringify(carrito));
  }

  eliminarDelCarrito(entradaId: number): void {
    const carrito = this.obtenerCarrito().filter(item => item.entradaId !== entradaId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(carrito));
  }

  vaciarCarrito(): void {
    localStorage.removeItem(this.localStorageKey);
  }

  confirmarCompra(): Observable<any> {
    const carritoItems = this.obtenerCarrito();
    return this.ventaService.crearVenta(carritoItems);
  }
}
