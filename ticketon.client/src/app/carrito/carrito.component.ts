import { Component, OnInit } from '@angular/core';
import { CarritoService } from './carrito.service';
import { CarritoItem } from './carrito-item';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VentaService } from '../venta/venta.service';
declare var MercadoPago: any;

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
    private ventaService: VentaService,  
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCarrito();
    const mp = new MercadoPago('APP_USR-64585ae8-8796-44db-8f01-af9f6a1ed9ee');
  }

  pagarConMercadoPago(preferenceId: string): void {
    const mp = new MercadoPago('APP_USR-64585ae8-8796-44db-8f01-af9f6a1ed9ee'); 
    mp.checkout({
      preference: {
        id: preferenceId // Usa el preferenceId del backend
      },
      autoOpen: true, // Abre automáticamente el Checkout Pro
      onError: (error: any) => {
        console.error('Error en el pago:', error);
        alert('Hubo un error al procesar el pago.');
      }
    });
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
    this.ventaService.crearVenta(this.carritoItems).subscribe(
      (response: any) => {
        this.pagarConMercadoPago(response.preferenceId);
      },
      (error) => {
        console.error('Error al confirmar la compra:', error);
        alert('Hubo un error al procesar la compra.');
      }
    );
  }
}
