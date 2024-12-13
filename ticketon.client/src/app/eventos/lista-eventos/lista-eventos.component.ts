import { Component, OnInit } from '@angular/core';
import { EventosService } from '../eventos.service';
import { EventoDTO } from '../evento';
import { SeguridadService } from '../../seguridad/seguridad.service';
import { ListadoEventosComponent } from '../listado-eventos/listado-eventos.component';
import { ListadoGenericoComponent } from '../../utilidades/listado-generico/listado-generico.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-eventos',
  imports: [ListadoGenericoComponent, CommonModule, RouterModule],
  templateUrl: './lista-eventos.component.html',
  styleUrls: ['./lista-eventos.component.css'],
  standalone: true
})
export class ListaEventosComponent implements OnInit {
  eventos: EventoDTO[] = [];
  errores: string[] = [];

  constructor(private eventosService: EventosService, private seguridadService: SeguridadService) { }

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos() {
    const email = this.seguridadService.obtenerCampoJWT('email');
    if (!email) {
      this.errores.push('No se pudo obtener el correo del usuario.');
      return;
    }

    this.eventosService.obtenerEventosCreados(email).subscribe({
      next: (response) => {
        this.eventos = response.creados;
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.errores.push('No se pudieron cargar los eventos.');
      }
    });
  }

  trackByFn(index: number, item: EventoDTO): number {
    return item.id;
  }
}
