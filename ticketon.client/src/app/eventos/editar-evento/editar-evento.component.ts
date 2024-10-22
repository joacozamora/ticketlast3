import { Component, Inject,  Input, OnInit, numberAttribute } from '@angular/core';
import { EventoCreacionDTO, EventoDTO } from '../evento';
import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';
import { EventosService } from '../eventos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-evento',
  standalone: true,
  imports: [FormularioEventoComponent],
  templateUrl: './editar-evento.component.html',
  styleUrl: './editar-evento.component.css'
})
export class EditarEventoComponent implements OnInit {

  //ngOnInit(): void {
  //  this.eventosService.obtenerPorId(this.id).subscribe(evento => {
  //    this.evento = evento;
  //  });
  //}

  @Input({ transform: numberAttribute })
  id!: number;
  evento?: EventoDTO;
  eventosService = Inject(EventosService);
  router = Inject(Router);

  guardarCambios(evento: EventoCreacionDTO) {
    console.log('editando el evento', evento);
  }

}
