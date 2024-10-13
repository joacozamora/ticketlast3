import { Component , EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { EventosService } from '../eventos.service';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ListadoGenericoComponent } from '../../utilidades/listado-generico/listado-generico.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AutorizadoComponent } from '../../seguridad/autorizado/autorizado.component';
import { SeguridadService } from '../../seguridad/seguridad.service';

@Component({
  selector: 'app-listado-eventos',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, ListadoGenericoComponent, MatButtonModule, MatIconModule, RouterLink, SweetAlert2Module, AutorizadoComponent],
  templateUrl: './listado-eventos.component.html',
  styleUrls: ['./listado-eventos.component.css']
})

export class ListadoEventosComponent  { 
  @Input({ required: true })
  eventos!: any[];

  eventosService = inject(EventosService);
  seguridadService = inject(SeguridadService);

  @Output()
  borrado = new EventEmitter<void>();

  constructor() {
    this.cargarEventos();
  }

  borrar(id: number) {
    this.eventosService.borrar(id)
      .subscribe(() => this.borrado.emit())
  }
  cargarEventos() {
    this.eventosService.obtenerLandingPage().subscribe(modelo => {
      this.publicados = modelo.publicados;

    });
  }
  publicados!: any[];
}
