import { Component, inject } from '@angular/core';
import { GenerosService } from '../generos.service';
import { GeneroDTO } from '../genero';

@Component({
  selector: 'app-indice-generos',
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
