import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './seguridad/login/login.component';
import { RegistroComponent } from './seguridad/registro/registro.component';
import { AutorizadoComponent } from './seguridad/autorizado/autorizado.component';
import { FormularioAutenticacionComponent } from './seguridad/formulario-autenticacion/formulario-autenticacion.component';
import { MostrarErroresComponent } from './utilidades/mostrar-errores/mostrar-errores.component';
//import { ComprarEntradasComponent } from './entradas/comprar-entradas/comprar-entradas.component';
/*import { JwtHelperService } from '@auth0/angular-jwt';*/


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuComponent, RouterOutlet, LoginComponent, RegistroComponent, AutorizadoComponent, FormularioAutenticacionComponent, MostrarErroresComponent],
  /*providers: [JwtHelperService],*/
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /*constructor(private jwtHelper: JwtHelperService) { }*/


  /*title = 'ticketon.client';*/
}
