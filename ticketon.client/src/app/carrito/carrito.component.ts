import { Component, OnInit } from '@angular/core';
import { CarritoService } from './carrito.service';
import { CarritoItem } from './carrito-item';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VentaService } from '../venta/venta.service';

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
    private ventaService: VentaService,  // Inyectamos el servicio de ventas
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
    this.ventaService.crearVenta(this.carritoItems).subscribe(
      () => {
        this.carritoService.vaciarCarrito();
        this.cargarCarrito();
        alert('Compra confirmada y entradas agregadas a la billetera.');
      },
      (error) => {
        console.error('Error al confirmar la compra:', error);
        alert('Hubo un error al procesar la compra.');
      }
    );
  }
}
