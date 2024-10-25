import { Component , EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { EventosService } from '../eventos.service';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ListadoGenericoComponent } from '../../utilidades/listado-generico/listado-generico.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { AutorizadoComponent } from '../../seguridad/autorizado/autorizado.component';
import { SeguridadService } from '../../seguridad/seguridad.service';

@Component({
  selector: 'app-listado-eventos',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, ListadoGenericoComponent, MatButtonModule, MatIconModule, RouterLink, SweetAlert2Module, AutorizadoComponent, CommonModule],
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

  usuarioEmail = this.seguridadService.obtenerCampoJWT('email');

  constructor() {
    this.cargarEventos();
  }


  borrar(id: number) {
    this.eventosService.borrar(id)
      .subscribe(() => this.borrado.emit())
  }
  cargarEventos() {
    console.log("Correo del usuario:", this.usuarioEmail); // Agrega este log

    this.eventosService.obtenerLandingPage().subscribe(modelo => {
      this.publicados = modelo.publicados;

    });

    this.eventosService.obtenerEventoPage(this.usuarioEmail).subscribe(modelo => {
      this.creados = modelo.creados;
    });
  }
  publicados!: any[];
  currentSlide = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  // Método para ir al siguiente slide
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.eventos.length;
  }

  // Método para ir al slide anterior
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.eventos.length) % this.eventos.length;
  }

  // Método para ir a un slide específico
  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Método para iniciar el auto slide cada 5 segundos
  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia el slide cada 5 segundos
  }

  trackByFn(index: number, item: any) {
    return item.id; // o el identificador único del evento
  }

  // Método para detener el auto slide cuando se destruye el componente
  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
