import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredencialesUsuarioDTO } from '../seguridad';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MostrarErroresComponent } from '../../utilidades/mostrar-errores/mostrar-errores.component';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-formulario-autenticacion',
  standalone: true,
  imports: [MostrarErroresComponent, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatButtonModule, MatInputModule, MatLabel, CommonModule],
  templateUrl: './formulario-autenticacion.component.html',
  styleUrl: './formulario-autenticacion.component.css'
})
export class FormularioAutenticacionComponent {
  @Input() titulo!: string;
  @Input() errores: string[] = [];
  @Output() posteoFormulario = new EventEmitter<CredencialesUsuarioDTO>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormularioAutenticacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {
    this.titulo = data.titulo;
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  guardarCambios() {
    if (this.form.valid) {
      this.posteoFormulario.emit(this.form.value);
    }
  }

  cambiarARegistro() {
    this.dialogRef.close(); // Cerrar el modal actual

    // Abrir el modal opuesto
    const nuevoTitulo = this.titulo === 'Login' ? 'Registrate' : 'Login';
    const dialogRef = this.dialog.open(FormularioAutenticacionComponent, {
      width: '550px',
      data: { titulo: nuevoTitulo }
    });

    dialogRef.componentInstance.posteoFormulario.subscribe((credenciales: CredencialesUsuarioDTO) => {
      if (nuevoTitulo === 'Login') {
        // Aquí deberás llamar al método de login en tu componente de login
      } else {
        // Aquí deberás llamar al método de registro en tu componente de registro
      }
      dialogRef.close();
    });
  }

  recuperarCuenta() { }
}
