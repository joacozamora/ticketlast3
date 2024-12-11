import { Component, inject } from '@angular/core';
import { ListadoEventosComponent } from '../eventos/listado-eventos/listado-eventos.component';
import { EventosService } from '../eventos/eventos.service';
import { AutorizadoComponent } from '../seguridad/autorizado/autorizado.component';

@Component({
    selector: 'app-landing-page',
    imports: [ListadoEventosComponent, AutorizadoComponent],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  eventosService = inject(EventosService);

  constructor() {
    this.cargarEventos();
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
