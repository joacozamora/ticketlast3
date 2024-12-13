import { Component, OnInit, inject } from '@angular/core';
import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';
import { EventosService } from '../eventos.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventoCreacionDTO, EventoDTO } from '../evento';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [FormularioEventoComponent, CommonModule, RouterModule],
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent implements OnInit {
  evento?: EventoDTO;
  imagenActual?: string;
  id!: number; 

  private eventosService = inject(EventosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam); // Aseguramos que el ID se obtiene y asigna
      this.eventosService.obtenerPorId(this.id).subscribe({
        next: (evento) => {
          this.evento = evento;
          this.imagenActual = evento.imagen as string;

        },
        error: (err) => console.error('Error al obtener el evento:', err),
      });
    } else {
      console.error('No se encontró el ID del evento en la URL.');
    }
  }

  guardarCambios(evento: EventoCreacionDTO): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventosService.actualizar(id, evento).subscribe({
      next: () => this.router.navigate(['/lista-eventos']),
      error: (err) => console.error('Error al actualizar el evento:', err),
    });
  }

  eliminarEvento(): void {
    if (this.id) {
      if (confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
        this.eventosService.borrar(this.id).subscribe({
          next: () => {
            alert('Evento eliminado con éxito.');
            this.router.navigate(['/eventos']); // Redirige al listado de eventos
          },
          error: (err) => {
            console.error('Error al eliminar el evento:', err);
            alert('Ocurrió un error al intentar eliminar el evento.');
          },
        });
      }
    } else {
      console.error('El ID del evento no está definido.');
    }
  }

  
}


