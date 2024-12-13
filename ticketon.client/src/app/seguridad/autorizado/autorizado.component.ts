import { Component, Input, inject } from '@angular/core';
import { SeguridadService } from '../seguridad.service';

@Component({
    selector: 'app-autorizado',
    imports: [],
    templateUrl: './autorizado.component.html',
    styleUrl: './autorizado.component.css'
})
export class AutorizadoComponent {

  seguridadService = inject(SeguridadService);
  @Input()
  rol?: string;

  estaAutorizado(): boolean {
    if (this.rol) {
      // Verificar si el usuario tiene el rol específico (admin o productora)
      return this.seguridadService.obtenerRol() === this.rol;
    } else {
      // Verificar si el usuario está logueado
      return this.seguridadService.estaLogueado();
    }
  }
}
