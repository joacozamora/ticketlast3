import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoCreacionDTO } from '../evento';
import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';
import { CommonModule } from '@angular/common'; // Si es necesario para otros elementos
import { RouterModule } from '@angular/router'; // Si estás usando enrutamiento en este componente
import { EventosService } from '../eventos.service';




@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormularioEventoComponent],  // Importas el componente standalone
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  private router = inject(Router);  // Usamos inject para el Router

  constructor(private eventoServices: EventosService) { }

  guardarCambios(evento: EventoCreacionDTO) {
    this.eventoServices.crear(evento).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (errorResponse) => {
        console.error('Error al guardar el evento:', errorResponse.error.errors);
      }
    });
  }

}
