import { Component , OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-eventos',
  templateUrl: './listado-eventos.component.html',
  styleUrls: ['./listado-eventos.component.css']
})

export class ListadoEventosComponent implements OnInit { // Implementado OnInit
  eventos: any[] | undefined; // Definir el tipo de 'eventos'

  constructor() { }

  ngOnInit(): void {
    this.eventos = [{
      titulo: "Liga Bazooka",
      fechaEvento: new Date(),
      precio: 8800.99
    }, {
        titulo: "Flaco Vasquez",
        fechaEvento: new Date(),
        precio: 12000
      }];
  }
}
