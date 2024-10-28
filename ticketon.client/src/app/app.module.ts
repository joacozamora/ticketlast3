import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {MaterialModule} from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CrearEntradaComponent } from './entradas/crear-entrada/crear-entrada.component';
import { FormularioEntradaComponent } from './entradas/formulario-entrada/formulario-entrada.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { AutorizadoComponent } from './seguridad/autorizado/autorizado.component';
import { LoginComponent } from './seguridad/login/login.component';
import { RegistroComponent } from './seguridad/registro/registro.component';
import { FormularioAutenticacionComponent } from './seguridad/formulario-autenticacion/formulario-autenticacion.component';
import { MostrarErroresComponent } from './utilidades/mostrar-errores/mostrar-errores.component';
import { IndiceUsuariosComponent } from './seguridad/indice-usuarios/indice-usuarios.component';
import { SelectorMultipleComponent } from './utilidades/selector-multiple/selector-multiple.component';
import { authInterceptor } from './seguridad/token-interceptor-http';
import { MatInputModule } from '@angular/material/input';
import { IndiceEventosComponent } from './eventos/indice-eventos/indice-eventos.component';
import { CarruselComponent } from './carrusel/carrusel.component';
import { IndexComponent } from './index/index.component';



// Configuración del formato de fecha
export const MY_FORMATS = {
  parse: {
    dateInput: ['DD-MM-YYYY'],
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
  
};

//export function tokenGetter() {
//  return localStorage.getItem('token');
//}

@NgModule({
  declarations: [    
    SelectorMultipleComponent, IndiceEventosComponent,
    ],
  imports: [
    SweetAlert2Module.forRoot(),
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    MatInputModule
    //JwtModule.forRoot({
    //  config: {
    //    tokenGetter: tokenGetter,
    //    allowedDomains: ['localhost:4200'], // Cambia esto por tu dominio de API
    //    disallowedRoutes: []
    //  }
    //}),
  ],
  providers: [
    provideAnimationsAsync(),
     { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },  // Configura el idioma
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },  // Configura Moment para usar UTC
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },  // Configura los formatos de fecha
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
