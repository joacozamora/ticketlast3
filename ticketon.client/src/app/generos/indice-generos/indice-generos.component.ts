import { Component, inject } from '@angular/core';
import { GenerosService } from '../generos.service';
import { GeneroDTO } from '../genero';
import { ListadoGenericoComponent } from '../../utilidades/listado-generico/listado-generico.component';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-indice-generos',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatTableModule, ListadoGenericoComponent, MatPaginatorModule, SweetAlert2Module],
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
