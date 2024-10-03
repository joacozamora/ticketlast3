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

  borrar(id: number) {
    this.eventosService.borrar(id)
      .subscribe(() => this.borrado.emit())
  }
  //ngOnInit(): void {
  //  setTimeout(() => {
  //    this.eventos = [{
  //      titulo: "Liga Bazooka",
  //      fechaEvento: new Date(),
  //      precio: 8800.99,
  //      poster: 'https://th.bing.com/th/id/OIP.ACJPWX7t6-QGmEapAodeSQHaEK?rs=1&pid=ImgDetMain'
  //    }, {
  //      titulo: "Flaco Vazquez",
  //      fechaEvento: new Date(),
  //      precio: 12000,
  //      poster: 'https://t2.genius.com/unsafe/600x600/https://images.genius.com/bd561d35c39547872191f9f877c441f3.499x499x1.jpg'
  //    }, {
  //      titulo: "Nekkrai Fest",
  //      fechaEvento: new Date(),
  //      precio: 8800.99,
  //      poster: 'https://th.bing.com/th/id/OIP.nD517mK7FvVxPtrknn92PQHaHa?rs=1&pid=ImgDetMain'
  //    }, {
  //      titulo: "Wu Tang Clan",
  //      fechaEvento: new Date(),
  //      precio: 12000,
  //      poster: 'https://th.bing.com/th/id/OIP.t3Y9B_GJNwrDjaRwocxqdgHaHF?rs=1&pid=ImgDetMain'
  //    }, {
  //      titulo: "Rolkkrai",
  //      fechaEvento: new Date(),
  //      precio: 8800.99,
  //      poster: 'https://th.bing.com/th/id/R.6d453364c23dcbac7cc85495d2ef9087?rik=TFnkGtlcEfIlnQ&pid=ImgRaw&r=0'
  //    }, {
  //      titulo: "Red Bull",
  //      fechaEvento: new Date(),
  //      precio: 12000,
  //      poster: 'https://th.bing.com/th/id/OIP.oeYNADgTIT3PWKRFokI1vQAAAA?rs=1&pid=ImgDetMain'
  //    }];
  //  }, 500);
  //}
}
