import { Component, inject } from '@angular/core';

import { PaginacionDTO } from '../../utilidades/modelos/PaginacionDTO';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { CredencialesUsuarioDTO } from '../../seguridad/seguridad';
import { SeguridadService } from '../../seguridad/seguridad.service';

@Component({
  selector: 'app-lista-usuarios-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './lista-usuarios-admin.component.html',
  styleUrls: ['./lista-usuarios-admin.component.css']
})
export class ListaUsuariosAdminComponent {
  columnasAMostrar = ['email', 'nombre', 'apellido', 'telefono', 'dni', 'acciones'];
  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 10 };
  cantidadTotalRegistros!: number;

  usuarios!: CredencialesUsuarioDTO[];

  private seguridadService = inject(SeguridadService);
  private router = inject(Router);

  constructor() {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.seguridadService.obtenerUsuariosPaginado(this.paginacion)
      .subscribe({
        next: (respuesta) => {
          this.usuarios = respuesta.body as CredencialesUsuarioDTO[];
          const cabecera = respuesta.headers.get("cantidad-total-registros") as string;
          this.cantidadTotalRegistros = parseInt(cabecera, 10);
        },
        error: (err) => console.error('Error al cargar los usuarios:', err)
      });
  }

  actualizarPaginacion(datos: PageEvent) {
    this.paginacion = { pagina: datos.pageIndex + 1, recordsPorPagina: datos.pageSize };
    this.cargarRegistros();
  }

  editarUsuario(email: string) {
    this.router.navigate(['/usuario/editar', email]); // Redirige al componente EditarUsuarioComponent
  }
}
