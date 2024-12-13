import { Component, Inject, inject } from '@angular/core';
import { SeguridadService } from '../seguridad.service';
import { Router } from '@angular/router';
import { CredencialesLoginDTO } from '../seguridad';
import { FormularioAutenticacionComponent } from '../formulario-autenticacion/formulario-autenticacion.component';
import { MostrarErroresComponent } from '../../utilidades/mostrar-errores/mostrar-errores.component';
import { extraerErroresIdentity } from '../../utilidades/extraerErrores';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormularioAutenticacionComponent, MostrarErroresComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  seguridadService = inject(SeguridadService);
  router = inject(Router);
  dialogRef = inject(MatDialogRef<LoginComponent>);
  errores: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { titulo: string }) { }

  loguear(credenciales: CredencialesLoginDTO) {
    this.seguridadService.login(credenciales).subscribe({
      next: () => {
        this.dialogRef.close(); // Cierra el modal tras loguear
        this.router.navigate(['/']); // Redirige al home
      },
      error: (err) => {
        this.errores = extraerErroresIdentity(err); // Maneja errores
      },
    });
  }
}
