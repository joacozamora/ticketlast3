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
    return this.carritoItems.reduce((total, item) => total + item.total, 0);
  }

  confirmarCompra(): void {
    this.carritoService.confirmarCompra().subscribe(() => {
      this.carritoService.vaciarCarrito();
      this.cargarCarrito();
    });
  }
}
