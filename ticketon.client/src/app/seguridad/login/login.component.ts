import { Component, inject } from '@angular/core';
import { SeguridadService } from '../seguridad.service';
import { Router } from '@angular/router';
import { CredencialesUsuarioDTO } from '../seguridad';
import { FormularioAutenticacionComponent } from '../formulario-autenticacion/formulario-autenticacion.component';
import { MostrarErroresComponent } from '../../utilidades/mostrar-errores/mostrar-errores.component';
import { extraerErroresIdentity } from '../../utilidades/extraerErrores';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormularioAutenticacionComponent, MostrarErroresComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  seguridadService = inject(SeguridadService);
  router = inject(Router);
  errores: string[] = [];

  loguear(credenciales: CredencialesUsuarioDTO) {
    this.seguridadService.login(credenciales)
      .subscribe({
        next: () => {
          this.router.navigate(['/'])
        },
        error: err => {
          const errores = extraerErroresIdentity(err);
          this.errores = errores;
        }
      })
  }


}
