import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelAdministradoresComponent } from './panel-administradores/panel-administradores.component';
import { ListaEntradasAdminComponent } from './lista-entradas-admin/lista-entradas-admin.component';
import { FormularioEntradaComponent } from '../entradas/formulario-entrada/formulario-entrada.component';
import { EditarEntradaComponent } from '../entradas/editar-entrada/editar-entrada.component';
import { ListaEntradasVentaAdminComponent } from './lista-entradas-venta/lista-entradas-venta.component';
import { ListaEntradasventaComponent } from './lista-entradasventa/lista-entradasventa.component';
import { EditarEventoComponent } from '../eventos/editar-evento/editar-evento.component';
import { ListaEventosAdminComponent } from './lista-eventos-admin/lista-eventos-admin.component';

import { EditarUsuarioComponent } from '../seguridad/editar-usuario/editar-usuario.component';
import { ListaUsuariosAdminComponent } from './lista-usuarios-admin/lista-usuarios-admin.component';

const routes: Routes = [
  {
    path: '',
    component: PanelAdministradoresComponent,
    children: [
      { path: 'entradas', component: ListaEntradasAdminComponent },
      { path: 'entradas/editar/:id', component: EditarEntradaComponent },
      { path: 'entradas/editar/:id', component: EditarEntradaComponent },
      { path: 'entradas-venta', component: ListaEntradasventaComponent },
      { path: 'eventos', component: ListaEventosAdminComponent },
      { path: 'eventos/:id', component: EditarEventoComponent },
      { path: 'usuarios', component: ListaUsuariosAdminComponent },
      { path: 'usuarios/editar/:email', component: EditarUsuarioComponent },
      { path: '', redirectTo: 'entradas', pathMatch: 'full' }, // Redirección inicial al componente de entradas

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
