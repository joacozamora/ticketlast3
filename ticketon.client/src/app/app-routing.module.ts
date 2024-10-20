import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceGenerosComponent } from './generos/indice-generos/indice-generos.component';
import { CrearGeneroComponent } from './generos/crear-genero/crear-genero.component';
import { CrearEventoComponent } from './eventos/crear-evento/crear-evento.component';
import { EditarGeneroComponent } from './generos/editar-genero/editar-genero.component';
import { LoginComponent } from './seguridad/login/login.component';
import { RegistroComponent } from './seguridad/registro/registro.component';
import { IndiceUsuariosComponent } from './seguridad/indice-usuarios/indice-usuarios.component';
import { esAdminGuard } from './utilidades/guards/es-admin.guard';
import { FiltroEventosComponent } from './eventos/filtro-eventos/filtro-eventos.component';
import { CrearEntradaComponent } from './entradas/crear-entrada/crear-entrada.component';
import { ListadoEventosComponent } from './eventos/listado-eventos/listado-eventos.component';
import { IndiceEventosComponent } from './eventos/indice-eventos/indice-eventos.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'generos', component: IndiceGenerosComponent },
  { path: 'generos/crear', component: CrearGeneroComponent },
  { path: 'eventos/filtrar', component: FiltroEventosComponent},
  { path: 'eventos/crear', component: CrearEventoComponent, canActivate: [esAdminGuard]},
  { path: 'generos/editar/:id', component: EditarGeneroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistroComponent },
  { path: 'usuarios', component: IndiceUsuariosComponent, canActivate: [esAdminGuard] },
  { path: 'entradas/crear/:idEvento', component: CrearEntradaComponent },
  {path: 'eventos', component: IndiceEventosComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
