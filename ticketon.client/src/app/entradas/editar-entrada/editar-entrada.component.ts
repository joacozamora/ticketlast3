import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EntradasService } from '../entradas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-entrada',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './editar-entrada.component.html',
  styleUrl: './editar-entrada.component.css'
})
export class EditarEntradaComponent implements OnInit {
  form!: FormGroup;
  entradaId!: number;
  correoOrganizador?: string;
  nombreEvento?: string;

  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private entradasService = inject(EntradasService);

  ngOnInit(): void {
    this.entradaId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.entradaId) {
      alert('ID de entrada inválido');
      this.router.navigate(['/admin/entradas']);
    }

    this.form = this.formBuilder.group({
      nombreTanda: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(1)]],
      precio: [null, [Validators.required, Validators.min(0)]],
    });

    this.cargarEntrada();
  }

  cargarEntrada(): void {
    this.entradasService.obtenerPorId(this.entradaId).subscribe({
      next: (entrada) => {
        this.correoOrganizador = entrada.correoOrganizador; // Guardar el correo del organizador
        this.nombreEvento = entrada.nombreEvento; // Guardar el nombre del evento
        this.form.patchValue({
          nombreTanda: entrada.nombreTanda,
          stock: entrada.stock,
          precio: entrada.precio,
        });
      },
      error: (err) => {
        console.error('Error al cargar la entrada:', err);
        alert('No se pudo cargar la entrada.');
        this.router.navigate(['/admin/entradas']);
      },
    });
  }

  guardarCambios(): void {
    if (this.form.invalid) {
      alert('Formulario inválido');
      return;
    }

    const entradaActualizada = {
      nombreTanda: this.form.value.nombreTanda,
      stock: this.form.value.stock,
      precio: this.form.value.precio,
    };

    this.entradasService.editar(this.entradaId, entradaActualizada).subscribe({
      next: () => {
        alert('Entrada actualizada con éxito');
        this.router.navigate(['/admin/entradas']);
      },
      error: (err) => {
        console.error('Error al actualizar la entrada:', err);
        alert('No se pudo actualizar la entrada.');
      },
    });
  }
}
