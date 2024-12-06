import { Injectable } from '@angular/core';
import { CarritoItem } from './carrito-item';
import { VentaService } from '../venta/venta.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private readonly localStorageKey = 'carrito';

  constructor(private ventaService: VentaService) { }

  obtenerCarrito(): CarritoItem[] {
    // Obtener los elementos del carrito desde el localStorage
    const carritoString = localStorage.getItem(this.localStorageKey);
    return carritoString ? JSON.parse(carritoString) : [];
  }

  agregarAlCarrito(item: CarritoItem): void {
    // Agregar un nuevo item al carrito
    const carrito = this.obtenerCarrito();

    // Calcular el total del item (precio * cantidad)
    item.total = item.precio * item.cantidad;
    carrito.push(item);

    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(carrito));
  }

  eliminarDelCarrito(entradaId: number): void {
    // Eliminar un item del carrito por su entradaId
    const carrito = this.obtenerCarrito().filter((item) => item.entradaId !== entradaId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(carrito));
  }

  vaciarCarrito(): void {
    // Vaciar completamente el carrito
    localStorage.removeItem(this.localStorageKey);
  }

  confirmarCompra(): Observable<any> {
    // Obtener los elementos del carrito y pasar la responsabilidad de crear la venta al VentaService
    const carritoItems = this.obtenerCarrito();
    return this.ventaService.crearVenta(carritoItems);
  }
}


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

    
//    item.total = item.precio * item.cantidad;
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
