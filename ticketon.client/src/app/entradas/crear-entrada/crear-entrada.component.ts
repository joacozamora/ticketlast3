import { Component, inject } from '@angular/core';
import { EntradasService } from '../entradas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Entrada } from '../entradas';
import { FormularioEntradaComponent } from '../formulario-entrada/formulario-entrada.component';

@Component({
    selector: 'app-crear-entrada',
    imports: [FormularioEntradaComponent],
    templateUrl: './crear-entrada.component.html',
    styleUrls: ['./crear-entrada.component.css']
})

export class CrearEntradaComponent {
  idEvento!: number; 
  usuarioActualId!: string;
  
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idEvento = +params['idEvento']; 
    });
  }
}
//export class CrearEntradaComponent {
//  private entradasService = inject(EntradasService);
//  private router = inject(Router);

//  guardarCambios(entrada: Entrada) {
//    this.entradasService.crear(entrada).subscribe({
//      next: entrada => {
//        console.log(entrada);
//        this.router.navigate(['/']); 
//      },
//    });
//  }
//}
