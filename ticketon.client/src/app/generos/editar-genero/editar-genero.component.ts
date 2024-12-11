import { Component, Input, OnInit, inject, numberAttribute } from '@angular/core';
import { GeneroCreacionDTO, GeneroDTO } from '../genero';
import { GenerosService } from '../generos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioGeneroComponent } from '../formulario-genero/formulario-genero.component';

@Component({
    selector: 'app-editar-genero',
    imports: [FormularioGeneroComponent],
    templateUrl: './editar-genero.component.html',
    styleUrls: ['./editar-genero.component.css']
})
export class EditarGeneroComponent implements OnInit {



  ngOnInit(): void {
    // Captura el ID desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.generosServices.obtenerPorId(this.id).subscribe({
        next: (genero) => {
          this.genero = genero;
        },
        error: (err) => {
          console.error('Error al obtener el género:', err);
        }
      });
    }
  }  


  @Input({ transform: numberAttribute })
  id!: number;

  genero?: GeneroDTO;
  generosServices = inject(GenerosService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  guardarCambios(genero: GeneroCreacionDTO) {

    this.generosServices.actualizar(this.id, genero).subscribe({
      next: () => {
        this.router.navigate(['/generos'])
      }
      //error: err => {
      //  console.error('Error al actualizar el género:', err);
      //}
    })
  }
}
