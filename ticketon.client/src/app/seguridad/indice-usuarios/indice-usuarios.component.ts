import { Component, inject } from '@angular/core';
import { SeguridadService } from '../seguridad.service';
import Swal from 'sweetalert2';
import { PaginacionDTO } from '../../utilidades/modelos/PaginacionDTO';
import { UsuarioDTO } from '../seguridad';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ListadoGenericoComponent } from '../../utilidades/listado-generico/listado-generico.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-indice-usuarios',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatTableModule, ListadoGenericoComponent, MatPaginatorModule, SweetAlert2Module],
  templateUrl: './indice-usuarios.component.html',
  styleUrl: './indice-usuarios.component.css'
})
export class IndiceUsuariosComponent {

  columnasAMostrar = ['email', 'acciones'];
  paginacion: PaginacionDTO = { pagina: 1, recordsPorPagina: 10 };
  cantidadTotalRegistros!: number;

  usuarios!: UsuarioDTO[];

  servicioSeguridad = inject(SeguridadService);

  constructor() {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.servicioSeguridad.obtenerUsuariosPaginado(this.paginacion)
      .subscribe(respuesta => {
        this.usuarios = respuesta.body as UsuarioDTO[];
        const cabecera = respuesta.headers.get("cantidad-total-registros") as string;
        this.cantidadTotalRegistros = parseInt(cabecera, 10);

      })
  }

  actualizarPaginacion(datos: PageEvent) {
    this.paginacion = { pagina: datos.pageIndex + 1, recordsPorPagina: datos.pageSize };
    this.cargarRegistros();
  }

  hacerAdmin(email: string) {
    this.servicioSeguridad.hacerAdmin(email)
      .subscribe(() => {
        Swal.fire("Exitoso", `El usuario ${email} ahora es admin`, "success");
      });
  }

  removerAdmin(email: string) {
    this.servicioSeguridad.removerAdmin(email)
      .subscribe(() => {
        Swal.fire("Exitoso", `El usuario ${email} ya no es admin`, "success");
      });
  }
}
