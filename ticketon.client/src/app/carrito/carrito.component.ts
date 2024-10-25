//import { Component } from '@angular/core';

//@Component({
//  selector: 'app-carrito',
//  templateUrl: './carrito.component.html',
//  styleUrl: './carrito.component.css'
//})
//export class CarritoComponent {

//}

//import { Component, OnInit } from '@angular/core';
//import { CarritoService } from './carrito.service';
//import { CarritoItem } from './carrito-item';
//import { CommonModule } from '@angular/common';
//import { VentaService } from '../venta/venta.service'
//import { ActivatedRoute, RouterLink } from '@angular/router';

//@Component({
//  selector: 'app-carrito',
//  standalone: true,
//  imports: [CommonModule, RouterLink],
//  templateUrl: './carrito.component.html',
//  styleUrls: ['./carrito.component.css']
//})
//export class CarritoComponent implements OnInit {
//  eventoId!: number;
//  carritoItems: CarritoItem[] = [];

//  constructor(
//    private carritoService: CarritoService,
//    private ventaService: VentaService, // Para manejar las ventas
//    private route: ActivatedRoute // Para obtener el eventoId de la URL
//  ) { }

//  ngOnInit(): void {
//    this.eventoId = Number(this.route.snapshot.paramMap.get('eventoId')); // Captura el ID del evento desde la ruta

//    this.cargarCarrito();
//  }

//  cargarCarrito() {
//    this.carritoItems = this.carritoService.obtenerCarrito();
//  }

//  eliminarDelCarrito(entradaId: number) {
//    this.carritoService.eliminarDelCarrito(entradaId);
//    this.cargarCarrito();
//  }

//  vaciarCarrito() {
//    this.carritoService.vaciarCarrito();
//    this.cargarCarrito();
//  }

//  confirmarCompra(): void {
//    this.carritoService.confirmarCompra().subscribe(() => {
//      this.carritoService.vaciarCarrito();
//      this.cargarCarrito();
//    });
//  }
//}

import { Component, OnInit } from '@angular/core';
import { CarritoService } from './carrito.service';
import { CarritoItem } from './carrito-item';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carritoItems: CarritoItem[] = [];

  constructor(
    private carritoService: CarritoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.carritoItems = this.carritoService.obtenerCarrito();
  }

  eliminarDelCarrito(entradaId: number): void {
    this.carritoService.eliminarDelCarrito(entradaId);
    this.cargarCarrito();
  }

  calcularTotal(): number {
    return this.carritoItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  confirmarCompra(): void {
    this.carritoService.confirmarCompra().subscribe(() => {
      this.carritoService.vaciarCarrito();
      this.cargarCarrito();
    });
  }
}
