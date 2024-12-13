import { Component, inject } from '@angular/core';
import { ListadoEventosComponent } from '../listado-eventos/listado-eventos.component';
import { EventosService } from '../eventos.service';
import { SeguridadService } from '../../seguridad/seguridad.service';
import { AutorizadoComponent } from '../../seguridad/autorizado/autorizado.component';

@Component({
    selector: 'app-indice-eventos',
    imports: [ListadoEventosComponent, AutorizadoComponent],
    templateUrl: './indice-eventos.component.html',
    styleUrl: './indice-eventos.component.css'
})
export class IndiceEventosComponent {

  eventosService = inject(EventosService);
  seguridadService = inject(SeguridadService);

  usuarioEmail = this.seguridadService.obtenerCampoJWT('email');
  constructor() {
    this.cargarEventos();
  }

  eventoBorrado() {
    this.cargarEventos();
  }

  cargarEventos() {
    console.log("Correo del usuario:", this.usuarioEmail); // Agrega este log


    
  }
  //cargarEventos() {
  //  this.eventosService.obtenerLandingPage().subscribe(modelo => {
  //    this.publicados = modelo.publicados;

  //  });
  //}
  publicados!: any[];


  creados!: any[];
}
