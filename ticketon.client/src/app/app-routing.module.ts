import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceGenerosComponent } from './generos/indice-generos/indice-generos.component';
import { CrearGeneroComponent } from './generos/crear-genero/crear-genero.component';
import { CrearEventoComponent } from './eventos/crear-evento/crear-evento.component';
import { EditarGeneroComponent } from './generos/editar-genero/editar-genero.component';
import { FiltroEventosComponent } from './eventos/filtro-eventos/filtro-eventos.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'generos', component: IndiceGenerosComponent },
  { path: 'generos/crear', component: CrearGeneroComponent },
  { path: 'eventos/crear', component: CrearEventoComponent },
  { path: 'generos/editar/:id', component: EditarGeneroComponent },
  { path: 'eventos/filtrar', component: FiltroEventosComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
