import { Component, inject } from '@angular/core';
import { GenerosService } from '../generos.service';
import { GeneroDTO } from '../genero';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ListadoGenericoComponent } from '../../utilidades/listado-generico/listado-generico.component';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-indice-generos',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, ListadoGenericoComponent, MatButtonModule, MatTableModule, MatIconModule, RouterLink, SweetAlert2Module],
  templateUrl: './indice-generos.component.html',
  styleUrls: ['./indice-generos.component.css']
})


export class IndiceGenerosComponent {
  generosService = inject(GenerosService)
  generos!: GeneroDTO[];
  columnasAMostrar = ['id', 'nombre', 'acciones']

  constructor() {
    this.generosService.obtenerTodos().subscribe(generos => {
      this.generos = generos;
    })
  }

  borrar(id: number) {
    this.generosService.borrar(id).subscribe(() => {
      this.generosService.obtenerTodos().subscribe(generos => {
        this.generos = generos;
      });
    });
  }

}
