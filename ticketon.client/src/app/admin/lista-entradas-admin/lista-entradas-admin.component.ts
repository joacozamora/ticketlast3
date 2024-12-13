import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../../entradas/entradas.service';
import { Entrada } from '../../entradas/entradas';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-entradas-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lista-entradas-admin.component.html',
  styleUrls: ['./lista-entradas-admin.component.css']
})
export class ListaEntradasAdminComponent implements OnInit {
  entradas: Entrada[] = [];
  terminoBusqueda = '';

  constructor(
    private entradasService: EntradasService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEntradas();
  }

  cargarEntradas(): void {
    this.entradasService.obtenerEntradasConEventos().subscribe({
      next: (entradas) => {
        this.entradas = entradas;
      },
      error: (err) => console.error('Error al cargar las entradas:', err),
    });
  }

  editarEntrada(id: number): void {
    console.log('ID de la entrada seleccionada para edición:', id); // Confirmación del ID seleccionado
    this.router.navigate(['/admin/entradas/editar', id]);
  }

  eliminarEntrada(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta entrada?')) {
      this.entradasService.eliminar(id).subscribe({
        next: () => {
          alert('Entrada eliminada con éxito.');
          this.cargarEntradas(); // Actualiza la lista después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar entrada:', err);
          alert('No se pudo eliminar la entrada. Verifica si está en uso.');
        },
      });
    }
  }

  get entradasFiltradas(): Entrada[] {
    if (!this.terminoBusqueda) {
      return this.entradas;
    }
    return this.entradas.filter((entrada) =>
      entrada.nombreEvento?.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }
}
