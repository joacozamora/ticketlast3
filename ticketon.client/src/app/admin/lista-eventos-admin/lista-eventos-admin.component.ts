import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../eventos/eventos.service';
import { EventoDTO } from '../../eventos/evento';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-eventos-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-eventos-admin.component.html',
  styleUrls: ['./lista-eventos-admin.component.css']
})
export class ListaEventosAdminComponent implements OnInit {
  eventos: EventoDTO[] = [];
  terminoBusqueda: string = '';

  constructor(
    private eventosService: EventosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.eventosService.obtenerTodos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
      },
      error: (err) => console.error('Error al cargar los eventos:', err)
    });
  }

  buscarEventos(): void {
    console.log('Eventos filtrados:', this.eventosFiltrados);
  }

  editarEvento(id: number): void {
    this.router.navigate(['/admin/eventos', id]);
  }

  get eventosFiltrados(): EventoDTO[] {
    if (!this.terminoBusqueda.trim()) {
      return this.eventos;
    }
    return this.eventos.filter(evento =>
      evento.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }
}
