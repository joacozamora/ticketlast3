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

@NgModule({
  declarations: [
    AppComponent,
    ListadoEventosComponent,
    MenuComponent,
    LandingPageComponent,
    IndiceGenerosComponent,
    CrearGeneroComponent,
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
