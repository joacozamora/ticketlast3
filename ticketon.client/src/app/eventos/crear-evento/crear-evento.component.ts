import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoCreacionDTO } from '../evento';
import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { EventosService } from '../eventos.service';




@Component({
    selector: 'app-crear-evento',
    imports: [CommonModule, RouterModule, FormularioEventoComponent],
    templateUrl: './crear-evento.component.html',
    styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  router = inject(Router);  
  eventosServices = inject(EventosService);
  route = inject(ActivatedRoute);

  idUsuario!: string;

  

  guardarCambios(evento: EventoCreacionDTO) {
    this.eventosServices.crear(evento).subscribe({
      next: evento => {
        console.log(evento);
        this.router.navigate(['/entradas/crear', evento.id]);
      },

    })
  }

}
