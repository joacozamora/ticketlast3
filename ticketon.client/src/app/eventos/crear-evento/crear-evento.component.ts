import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoCreacionDTO } from '../evento';
/*import { FormularioEventoComponent } from './formulario-evento.component';*/

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {

  private router = inject(Router);
  /*constructor(private router: Router) { }*/

  guardarCambios() {
    this.router.navigate(['/']);
  }

}
