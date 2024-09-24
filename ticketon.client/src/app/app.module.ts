import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ListadoEventosComponent } from './eventos/listado-eventos/listado-eventos.component';

import {MaterialModule} from './material/material.module';
import { MenuComponent } from './menu/menu.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceGenerosComponent } from './generos/indice-generos/indice-generos.component';
import { CrearGeneroComponent } from './generos/crear-genero/crear-genero.component';
import { FormularioGeneroComponent } from './generos/formulario-genero/formulario-genero.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearEventoComponent } from './eventos/crear-evento/crear-evento.component';
import { FormularioEventoComponent } from './eventos/formulario-evento/formulario-evento.component';
import { InputImgComponent } from './utilidades/input-img/input-img.component';
import { ListadoGenericoComponent } from './utilidades/listado-generico/listado-generico.component';
import { EditarGeneroComponent } from './generos/editar-genero/editar-genero.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrearEntradaComponent } from './entradas/crear-entrada/crear-entrada.component';
import { FormularioEntradaComponent } from './entradas/formulario-entrada/formulario-entrada.component';


@NgModule({
  declarations: [
    AppComponent,
    ListadoEventosComponent,
    MenuComponent,
    LandingPageComponent,
    IndiceGenerosComponent,
    CrearGeneroComponent,
    FormularioGeneroComponent,
    CrearEventoComponent,
    FormularioEventoComponent,
    InputImgComponent,
    ListadoGenericoComponent,
    EditarGeneroComponent,
    CrearEntradaComponent,
    FormularioEntradaComponent,
  ],
  imports: [
    SweetAlert2Module.forRoot(),
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
