import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CredencialesLoginDTO, CredencialesUsuarioDTO } from '../seguridad';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MostrarErroresComponent } from '../../utilidades/mostrar-errores/mostrar-errores.component';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SeguridadService } from '../seguridad.service';
import { extraerErroresIdentity } from '../../utilidades/extraerErrores';

@Component({
  selector: 'app-formulario-autenticacion',
  standalone: true,
  imports: [
    MostrarErroresComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatLabel,
    CommonModule
  ],
  templateUrl: './formulario-autenticacion.component.html',
  styleUrls: ['./formulario-autenticacion.component.css']
})
export class FormularioAutenticacionComponent {
  @Input() titulo!: string;
  @Input() errores: string[] = [];
  @Output() loginFormulario = new EventEmitter<CredencialesLoginDTO>();
  @Output() registroFormulario = new EventEmitter<CredencialesUsuarioDTO>();

  form: FormGroup;
  seguridadService = inject(SeguridadService);
  router = inject(Router);
  dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormularioAutenticacionComponent>
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.titulo === 'Registrate') {
      this.form.addControl('nombre', this.fb.control('', Validators.required));
      this.form.addControl('apellido', this.fb.control('', Validators.required));
      this.form.addControl('telefono', this.fb.control('', Validators.pattern(/^[0-9]{10,15}$/)));
      this.form.addControl('dni', this.fb.control('', Validators.pattern(/^[0-9]{7,10}$/)));
    }
  }

  guardarCambios() {
    if (!this.form.valid) {
      console.error('Formulario inválido:', this.form.value); // Para depuración
      return;
    }

    if (this.titulo === 'Login') {
      const credencialesLogin: CredencialesLoginDTO = {
        email: this.form.value.email,
        password: this.form.value.password
      };
      console.log('Datos enviados para Login:', credencialesLogin); // Debug
      this.loginFormulario.emit(credencialesLogin);
    } else if (this.titulo === 'Registrate') {
      const credencialesRegistro: CredencialesUsuarioDTO = {
        email: this.form.value.email,
        password: this.form.value.password,
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        telefono: this.form.value.telefono || '',
        dni: this.form.value.dni || ''
      };
      console.log('Datos enviados para Registro:', credencialesRegistro); // Debug
      this.registroFormulario.emit(credencialesRegistro);
    }
  }


  cambiarARegistro() {
    this.dialogRef.close(); // Cierra el modal actual
    const nuevoTitulo = this.titulo === 'Login' ? 'Registrate' : 'Login';

    // Abre el modal opuesto
    const nuevoDialog = this.dialog.open(FormularioAutenticacionComponent, {
      width: '600px',
      data: { titulo: nuevoTitulo }
    });

    nuevoDialog.componentInstance.registroFormulario.subscribe((credencialesRegistro: CredencialesUsuarioDTO) => {
      console.log('Datos recibidos en cambiarARegistro (Registro):', credencialesRegistro); // Depuración
    });

    nuevoDialog.componentInstance.loginFormulario.subscribe((credencialesLogin: CredencialesLoginDTO) => {
      console.log('Datos recibidos en cambiarARegistro (Login):', credencialesLogin); // Depuración
    });
  }
}
