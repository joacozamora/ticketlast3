import { Component, Inject,  Input, OnInit, inject, numberAttribute } from '@angular/core';
import { EventoCreacionDTO, EventoDTO } from '../evento';
import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';
import { EventosService } from '../eventos.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-editar-evento',
    imports: [FormularioEventoComponent],
    templateUrl: './editar-evento.component.html',
    styleUrl: './editar-evento.component.css'
})
export class EditarEventoComponent{

  ngOnInit(): void {
    // Captura el ID desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.eventosServices.obtenerPorId(this.id).subscribe({
        next: (evento) => {
          this.evento = evento;
          this.imagenActual = evento.imagen as string;
        },
        error: (err) => {
          console.error('Error al obtener el género:', err);
        }
      });
    }
  }


  @Input({ transform: numberAttribute })
  id!: number;

  evento?: EventoDTO;
  eventosServices = inject(EventosService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  imagenActual: string = '';


  guardarCambios(evento: EventoCreacionDTO) {

    this.eventosServices.actualizar(this.id, evento).subscribe({
      next: () => {
        console.log(evento);
        this.router.navigate(['/eventos'])
      } 
    })
  }
}
