import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoCreacionDTO } from '../evento';
import { FormularioEventoComponent } from '../formulario-evento/formulario-evento.component';
import { CommonModule } from '@angular/common'; // Si es necesario para otros elementos
import { RouterModule } from '@angular/router'; // Si estás usando enrutamiento en este componente




@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, RouterModule, FormularioEventoComponent],  // Importas el componente standalone
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
