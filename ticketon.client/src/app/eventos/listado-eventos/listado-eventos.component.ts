//import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
//import { EventosService } from '../eventos.service';
//import { RouterLink } from '@angular/router';
//import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
//import { ListadoGenericoComponent } from '../../utilidades/listado-generico/listado-generico.component';
//import { MatButtonModule } from '@angular/material/button';
//import { MatIconModule } from '@angular/material/icon';
//import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
//import { AutorizadoComponent } from '../../seguridad/autorizado/autorizado.component';
//import { SeguridadService } from '../../seguridad/seguridad.service';
//import { EventosPageDTO } from '../evento';

//@Component({
//  selector: 'app-listado-eventos',
//  standalone: true,
//  imports: [DatePipe, CurrencyPipe, ListadoGenericoComponent, MatButtonModule, MatIconModule, RouterLink, SweetAlert2Module, AutorizadoComponent, CommonModule],
//  templateUrl: './listado-eventos.component.html',
//  styleUrls: ['./listado-eventos.component.css']
//})
//export class ListadoEventosComponent {
//  @Input({ required: true })
//  eventos!: any[];

//  eventosService = inject(EventosService);
//  seguridadService = inject(SeguridadService);

//  @Output()
//  borrado = new EventEmitter<void>();

//  usuarioEmail = this.seguridadService.obtenerCampoJWT('email');
//  publicados!: any[];
//  creados!: any[]; // Agregar la propiedad `creados`

//  constructor() {
//    this.cargarEventos();
//  }

//  borrar(id: number) {
//    this.eventosService.borrar(id)
//      .subscribe(() => this.borrado.emit());
//  }

//  cargarEventos() {
//    console.log("Correo del usuario:", this.usuarioEmail);

//    this.eventosService.obtenerLandingPage().subscribe(modelo => {
//      this.publicados = modelo.publicados;
//    });

//    this.eventosService.obtenerEventoPage(this.usuarioEmail).subscribe(modelo => {
//      this.creados = modelo.creados;
//    });
//  }

//  currentSlide = 0;
//  isTransitioning = false;
//  intervalId: any;

//  ngOnInit(): void {
//    this.startAutoSlide();
//  }

//  ngOnDestroy(): void {
//    this.stopAutoSlide();
//  }

//  nextSlide() {
//    this.currentSlide = (this.currentSlide + 1) % this.eventos.length;
//  }

//  prevSlide() {
//    this.currentSlide = (this.currentSlide - 1 + this.eventos.length) % this.eventos.length;
//  }

//  goToSlide(index: number) {
//    this.currentSlide = index;
//  }

//  startAutoSlide() {
//    this.intervalId = setInterval(() => {
//      this.nextSlide();
//    }, 5000);
//  }

//  trackByFn(index: number, item: any) {
//    return item.id;
//  }

//  stopAutoSlide() {
//    if (this.intervalId) {
//      clearInterval(this.intervalId);
//    }
//  }
//  private adjustTransition() {
//    const carouselElement = document.querySelector('.flex');
//    if (carouselElement) {
//      // Deshabilita temporalmente la transición para hacer el ajuste instantáneo
//      carouselElement.classList.remove('transition-transform');
//      setTimeout(() => {
//        carouselElement.classList.add('transition-transform');
//      }, 50);
//    }
//  }
//}
import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, inject } from '@angular/core';
import { EventosService } from '../eventos.service';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ListadoGenericoComponent } from '../../utilidades/listado-generico/listado-generico.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { AutorizadoComponent } from '../../seguridad/autorizado/autorizado.component';
import { SeguridadService } from '../../seguridad/seguridad.service';
import { EventosPageDTO } from '../evento';

@Component({
    selector: 'app-listado-eventos',
    imports: [
        DatePipe,
        CurrencyPipe,
        ListadoGenericoComponent,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        SweetAlert2Module,
        AutorizadoComponent,
        CommonModule
    ],
    templateUrl: './listado-eventos.component.html',
    styleUrls: ['./listado-eventos.component.css']
})
export class ListadoEventosComponent implements OnInit, OnDestroy {
  @Input({ required: true })
  eventos!: any[];

  eventosService = inject(EventosService);
  seguridadService = inject(SeguridadService);

  @Output()
  borrado = new EventEmitter<void>();

  usuarioEmail = this.seguridadService.obtenerCampoJWT('email');
  publicados!: any[];
  creados!: any[];

  currentSlide = 0;
  isTransitioning = false;
  intervalId: any;

  constructor() {
    this.cargarEventos();
  }

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  borrar(id: number) {
    this.eventosService.borrar(id).subscribe(() => this.borrado.emit());
  }

  cargarEventos() {
    console.log("Correo del usuario:", this.usuarioEmail);

    this.eventosService.obtenerLandingPage().subscribe(modelo => {
      this.publicados = modelo.publicados;
    });

    this.eventosService.obtenerEventoPage(this.usuarioEmail).subscribe(modelo => {
      this.creados = modelo.creados;
    });
  }

  nextSlide() {
    this.isTransitioning = true;
    this.currentSlide = (this.currentSlide + 1) % (this.eventos.length * 2);
    setTimeout(() => {
      if (this.currentSlide >= this.eventos.length) {
        this.currentSlide = this.currentSlide % this.eventos.length;
        this.adjustTransition();
      }
      this.isTransitioning = false;
    }, 700); // Duración de la transición CSS
  }

  prevSlide() {
    this.isTransitioning = true;
    if (this.currentSlide === 0) {
      this.currentSlide = this.eventos.length;
      this.adjustTransition();
    }
    this.currentSlide = (this.currentSlide - 1 + this.eventos.length * 2) % (this.eventos.length * 2);
    setTimeout(() => {
      this.isTransitioning = false;
    }, 700); // Duración de la transición CSS
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  private adjustTransition() {
    const carouselElement = document.querySelector('.carousel-inner');
    if (carouselElement) {
      carouselElement.classList.remove('transition-transform');
      setTimeout(() => {
        carouselElement.classList.add('transition-transform');
      }, 50);
    }
  }
}
