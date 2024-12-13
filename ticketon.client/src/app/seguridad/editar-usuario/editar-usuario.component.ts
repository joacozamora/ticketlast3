import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeguridadService } from '../seguridad.service';
import { CommonModule } from '@angular/common';
import { CredencialesUsuarioDTO } from '../seguridad';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  form!: FormGroup;
  private seguridadService = inject(SeguridadService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  email!: string;

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email')!; // Captura el correo desde la URL
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: [''],
      dni: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.seguridadService.obtenerUsuarioPorCorreo(this.email).subscribe({
      next: (usuario) => {
        this.form.patchValue({
          nombre: (usuario as any).nombre || '',
          apellido: (usuario as any).apellido || '',
          telefono: (usuario as any).telefono || '',
          dni: (usuario as any).dni || '',
          email: usuario.email || ''
        });
      },
      error: (err) => {
        console.error('Error al cargar el usuario:', err);
        alert('No se pudo cargar el usuario.');
        this.router.navigate(['/']);
      }
    });
  }

  guardarCambios(): void {
    if (this.form.invalid) {
      alert('Formulario inválido');
      return;
    }

    const usuarioActualizado = this.form.value;

    this.seguridadService.actualizarUsuario(this.email, usuarioActualizado).subscribe({
      next: () => {
        alert('Usuario actualizado con éxito');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al actualizar el usuario:', err);
        alert('No se pudo actualizar el usuario.');
      }
    });
  }


  cancelar(): void {
    this.router.navigate(['/']); // Redirige al inicio
  }
}
