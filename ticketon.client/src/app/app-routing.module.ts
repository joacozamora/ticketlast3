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
import { EditarEventoComponent } from './eventos/editar-evento/editar-evento.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ComprarEntradasComponent } from './entradas/comprar-entradas/comprar-entradas.component';
import { IndexComponent } from './index/index.component';
import { BilleteraComponent } from './billetera/billetera.component';
import { ReventaComponent } from './reventa/reventa/reventa.component';
import { CrearReventaComponent } from './reventa/crear-reventa/crear-reventa.component';
import { ConfirmacionComponent } from './confirmacion/confirmacion.component';


export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'generos', component: IndiceGenerosComponent },
  { path: 'generos/crear', component: CrearGeneroComponent },
  { path: 'eventos/filtrar', component: FiltroEventosComponent },
  { path: 'eventos/crear', component: CrearEventoComponent, canActivate: [esAdminGuard] },
  { path: 'generos/editar/:id', component: EditarGeneroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrar', component: RegistroComponent },
  { path: 'usuarios', component: IndiceUsuariosComponent, canActivate: [esAdminGuard] },
  { path: 'entradas/crear/:idEvento', component: CrearEntradaComponent },
  { path: 'eventos', component: IndiceEventosComponent },
  { path: 'eventos/editar/:id', component: EditarEventoComponent },
  { path: 'eventos', component: ListadoEventosComponent },
  { path: 'comprar-entradas/:id', component: ComprarEntradasComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'billetera', component: BilleteraComponent },
  { path: 'reventa', component: ReventaComponent },
  { path: 'crear-reventa', component: CrearReventaComponent },
  { path: 'confirmacion', component: ConfirmacionComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
