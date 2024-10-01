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

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'generos', component: IndiceGenerosComponent },
  { path: 'generos/crear', component: CrearGeneroComponent },
  { path: 'eventos/crear', component: CrearEventoComponent, canActivate: [esAdminGuard]},
  { path: 'generos/editar/:id', component: EditarGeneroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistroComponent },
  { path: 'usuarios', component: IndiceUsuariosComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
