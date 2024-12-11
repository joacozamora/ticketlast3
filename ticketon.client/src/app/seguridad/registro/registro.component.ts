import { Component, Inject, inject } from '@angular/core';
import { SeguridadService } from '../seguridad.service';
import { Router } from '@angular/router';
import { CredencialesUsuarioDTO } from '../seguridad';
import { FormularioAutenticacionComponent } from '../formulario-autenticacion/formulario-autenticacion.component';
import { MostrarErroresComponent } from '../../utilidades/mostrar-errores/mostrar-errores.component';
import { extraerErroresIdentity } from '../../utilidades/extraerErrores';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'app-registro',
    imports: [FormularioAutenticacionComponent, MostrarErroresComponent],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.css'
})
export class RegistroComponent {
  seguridadService = inject(SeguridadService);
  router = inject(Router);
  dialog = inject(MatDialog);
  dialogRef = inject(MatDialogRef<RegistroComponent>);
  errores: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { titulo: string }) { }

  registrar(credenciales: CredencialesUsuarioDTO) {
    this.seguridadService.registrar(credenciales).subscribe({
      next: () => {
        this.dialogRef.close(); // Cierra el modal solo cuando el registro es exitoso
        this.router.navigate(['/']); // Opcional: redirige a la página principal u otra de tu elección
      },
      error: (err) => {
        this.errores = extraerErroresIdentity(err);
      }
    });
  }
}
