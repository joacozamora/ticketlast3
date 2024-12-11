import { Component, Inject, inject } from '@angular/core';
import { SeguridadService } from '../seguridad.service';
import { Router } from '@angular/router';
import { CredencialesUsuarioDTO } from '../seguridad';
import { FormularioAutenticacionComponent } from '../formulario-autenticacion/formulario-autenticacion.component';
import { MostrarErroresComponent } from '../../utilidades/mostrar-errores/mostrar-errores.component';
import { extraerErroresIdentity } from '../../utilidades/extraerErrores';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    imports: [FormularioAutenticacionComponent, MostrarErroresComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  seguridadService = inject(SeguridadService);
  router = inject(Router);
  dialogRef = inject(MatDialogRef<LoginComponent>);
  errores: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { titulo: string }) { }

  loguear(credenciales: CredencialesUsuarioDTO) {
    this.seguridadService.login(credenciales)
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.router.navigate(['/'])
        },
        error: err => {
          const errores = extraerErroresIdentity(err);
          this.errores = errores;
        }
      })
  }


}
