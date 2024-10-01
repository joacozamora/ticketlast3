import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './seguridad/login/login.component';
import { RegistroComponent } from './seguridad/registro/registro.component';
import { AutorizadoComponent } from './seguridad/autorizado/autorizado.component';
import { FormularioAutenticacionComponent } from './seguridad/formulario-autenticacion/formulario-autenticacion.component';
import { MostrarErroresComponent } from './utilidades/mostrar-errores/mostrar-errores.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuComponent, RouterOutlet, LoginComponent, RegistroComponent, AutorizadoComponent, FormularioAutenticacionComponent, MostrarErroresComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 

  /*title = 'ticketon.client';*/
}
