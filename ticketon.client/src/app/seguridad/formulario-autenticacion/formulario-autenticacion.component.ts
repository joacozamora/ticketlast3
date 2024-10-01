import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredencialesUsuarioDTO } from '../seguridad';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MostrarErroresComponent } from '../../utilidades/mostrar-errores/mostrar-errores.component';

@Component({
  selector: 'app-formulario-autenticacion',
  standalone: true,
  imports: [MostrarErroresComponent, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatButtonModule, MatInputModule, MatLabel],
  templateUrl: './formulario-autenticacion.component.html',
  styleUrl: './formulario-autenticacion.component.css'
})
export class FormularioAutenticacionComponent {

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ['', { validators: [Validators.required, Validators.email] }],
    password: ['', { validators: [Validators.required] }]
  })

  @Input({ required: true })
  titulo!: string;

  @Input()
  errores: string[] = [];

  @Output()
  posteoFormulario = new EventEmitter<CredencialesUsuarioDTO>

  obtenerMensajeErrorEmail(): string {
    let campo = this.form.controls.email;

    if (campo.hasError('required')) {
      return 'El campo email es requerido';
    }

    if (campo.hasError('email')) {
      return 'El campo email no es valido';
    }
    return '';
  }

  obtenerMensajeErrorPassword(): string {
    let campo = this.form.controls.password;

    if (campo.hasError('required')) {
      return 'El campo password es requerido';
    }


    return '';
  }

  guardarCambios() {
    if (!this.form.valid) {
      return;
    }

    const credenciales = this.form.value as CredencialesUsuarioDTO;
    this.posteoFormulario.emit(credenciales);
  }


}
