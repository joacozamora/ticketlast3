import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../carrito/carrito.service';
import { EventosService } from '../../eventos/eventos.service';
import { EntradasService } from '../../entradas/entradas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Entrada } from '../entradas';

@Component({
  selector: 'app-comprar-entradas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comprar-entradas.component.html',
  styleUrls: ['./comprar-entradas.component.css']
})
export class ComprarEntradasComponent implements OnInit {
  evento: any;
  entradas: Entrada[] = [];
  precioTotal: number = 0;
  seleccionResumen: { nombre: string, cantidad: number, precio: number }[] = [];

  
  cantidadSeleccionada: { [entradaId: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private eventoService: EventosService,
    private entradasService: EntradasService
  ) { }

  ngOnInit(): void {
    // Obteniendo datos del evento y sus entradas
    this.route.params.subscribe(params => {
      const eventoId = +params['id'];
      if (eventoId > 0) {
        this.cargarEvento(eventoId);
        this.cargarEntradasPorEvento(eventoId);
      }
    });
  }

  cargarEvento(eventoId: number): void {
    this.eventoService.obtenerPorId(eventoId).subscribe(
      evento => {
        this.evento = evento;
      },
      error => {
        console.error('Error al cargar el evento:', error);
      }
    );
  }

  cargarEntradasPorEvento(eventoId: number): void {
    this.entradasService.obtenerEntradasPorEvento(eventoId).subscribe(
      entradas => {
        this.entradas = entradas;
        // Inicializamos la cantidad seleccionada para cada entrada en 0
        this.entradas.forEach(entrada => {
          this.cantidadSeleccionada[entrada.id] = 0;
        });
      },
      error => {
        console.error('Error al cargar las entradas del evento:', error);
      }
    );
  }

  incrementarEntradas(entrada: Entrada) {
    if (this.cantidadSeleccionada[entrada.id] < entrada.stock) {
      this.cantidadSeleccionada[entrada.id]++;
      this.calcularTotal();
    }
  }

  decrementarEntradas(entrada: Entrada) {
    if (this.cantidadSeleccionada[entrada.id] > 0) {
      this.cantidadSeleccionada[entrada.id]--;
      this.calcularTotal();
    }
  }

  calcularTotal(): void {
    // Calculamos el total sumando el precio de cada entrada seleccionada
    this.precioTotal = this.entradas.reduce((total, entrada) =>
      total + (entrada.precio * (this.cantidadSeleccionada[entrada.id] || 0)), 0
    );

    // Actualizamos el resumen de la selección
    this.seleccionResumen = this.entradas
      .filter(entrada => this.cantidadSeleccionada[entrada.id] > 0) 
      .map(entrada => ({
        nombre: entrada.nombreTanda,
        cantidad: this.cantidadSeleccionada[entrada.id],
        precio: entrada.precio * this.cantidadSeleccionada[entrada.id]
      }));
  }

  agregarAlCarrito(): void {
    this.seleccionResumen.forEach(item => {
      const entrada = this.entradas.find(e => e.nombreTanda === item.nombre);
      if (entrada) {
        this.carritoService.agregarAlCarrito({
          entradaId: entrada.id,
          nombreEntrada: entrada.nombreTanda,
          cantidad: item.cantidad,
          precio: entrada.precio,
          total: item.precio,
          nombreEvento: this.evento.nombre,
          imagenEvento: this.evento.imagen
        });
      }
    });
  }
}


