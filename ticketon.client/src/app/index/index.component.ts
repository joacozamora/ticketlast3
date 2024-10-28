import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventosService } from '../eventos/eventos.service';
import { CarruselComponent } from '../carrusel/carrusel.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EventoDTO } from '../eventos/evento';
import { ListadoEventosComponent } from '../eventos/listado-eventos/listado-eventos.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CarruselComponent, ListadoEventosComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IndexComponent implements OnInit {
  eventos: { nombre: string; imagen: string }[] = [];
  private eventosService = inject(EventosService);

  constructor() {
    this.cargarEventos();
  }
  ngOnInit() {
    this.eventosService.obtenerLandingPage().subscribe({
      next: (data) => {
        // Mapea los eventos para que tengan sólo nombre e imagen.
        this.eventos = data.publicados.map(evento => ({
          nombre: evento.nombre,
          imagen: evento.imagen || 'default.jpg'  // Imagen por defecto si no está definida.
        }));
      },
      error: (err) => console.error('Error al cargar eventos:', err)
    });
  }

  eventoBorrado() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventosService.obtenerLandingPage().subscribe(modelo => {
      this.publicados = modelo.publicados;

    });
  }

  publicados!: any[];
}
