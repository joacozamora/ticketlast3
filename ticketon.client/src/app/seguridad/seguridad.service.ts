//import { HttpClient, HttpResponse } from '@angular/common/http';
//import { Injectable, inject } from '@angular/core';
//import { environment } from '../../environments/environment';
//import { Observable, tap } from 'rxjs';
//import { CredencialesUsuarioDTO, RespuestaAutenticacionDTO, UsuarioDTO } from './seguridad';
//import { construirQueryParams } from '../utilidades/funciones/construirQueryParams';
//import { PaginacionDTO } from '../utilidades/modelos/PaginacionDTO';
///*import { JwtHelperService } from '@auth0/angular-jwt';*/

//@Injectable({
//  providedIn: 'root'
//})
//export class SeguridadService {

//  /*constructor(private jwtHelper: JwtHelperService) { }*/

//  private http = inject(HttpClient);
//  private urlBase = environment.apiURL + '/usuarios';
//  private readonly llaveToken = 'token';
//  private readonly llaveExpiracion = 'token-expiracion'

//  obtenerUsuariosPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<UsuarioDTO[]>> {
//    let queryParams = construirQueryParams(paginacion);
//    return this.http.get<UsuarioDTO[]>(`${this.urlBase}/ListadoUsuarios`, {params: queryParams, observe: `response` });
//  }

//  hacerAdmin(email: string) {
//    return this.http.post(`${this.urlBase}/haceradmin`, { email });
//  }

//  removerAdmin(email: string) {
//    return this.http.post(`${this.urlBase}/removeradmin`, { email });
//  }

//  registrar(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
//    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/register`, credenciales)
//      .pipe(
//        tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
//      )
//  }

//  login(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
//    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/login`, credenciales)
//      .pipe(
//        tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
//      )
//  }

//  obtenerCampoJWT(campo: string): string {
//    const token = localStorage.getItem(this.llaveToken);
//    if (!token) { return '' }
//    var dataToken = JSON.parse(atob(token.split('.')[1]))
//    return dataToken[campo];
//  }

//  guardarToken(respuestaAutenticacion: RespuestaAutenticacionDTO) {
//    localStorage.setItem(this.llaveToken, respuestaAutenticacion.token);
//    localStorage.setItem(this.llaveExpiracion, respuestaAutenticacion.expiracion.toString());
//  }

//  getToken(): string | null {
//    return localStorage.getItem('token'); // o sessionStorage o cookie
//  }

//  estaLogueado(): boolean {

//    const token = localStorage.getItem(this.llaveToken);

//    if (!token) {
//      return false;
//    }

//    const expiracion = localStorage.getItem(this.llaveExpiracion)!;
//    const expiracionFecha = new Date(expiracion);

//    if (expiracionFecha <= new Date()) {
//      this.logout();
//      return false;
//    }

//    return true;
//  }

//  logout() {
//    localStorage.removeItem(this.llaveToken);
//    localStorage.removeItem(this.llaveExpiracion);

//  }

//  obtenerRol(): string {
//    const esAdmin = this.obtenerCampoJWT('esadmin');
//    if (esAdmin) {
//      return 'admin'
//    } else {
//      return '';
//    }

//  }
//}




import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { CredencialesUsuarioDTO, RespuestaAutenticacionDTO, UsuarioDTO } from './seguridad';
import { construirQueryParams } from '../utilidades/funciones/construirQueryParams';
import { PaginacionDTO } from '../utilidades/modelos/PaginacionDTO';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/usuarios';
  private readonly llaveToken = 'token';
  private readonly llaveExpiracion = 'token-expiracion';
  private readonly llaveUserId = 'user_id'; // Nueva llave para almacenar el ID de usuario

  obtenerUsuariosPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<UsuarioDTO[]>> {
    let queryParams = construirQueryParams(paginacion);
    return this.http.get<UsuarioDTO[]>(`${this.urlBase}/ListadoUsuarios`, { params: queryParams, observe: 'response' });
  }

  hacerAdmin(email: string) {
    return this.http.post(`${this.urlBase}/haceradmin`, { email });
  }

  removerAdmin(email: string) {
    return this.http.post(`${this.urlBase}/removeradmin`, { email });
  }

  registrar(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/register`, credenciales)
      .pipe(
        tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
      );
  }

  login(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/login`, credenciales)
      .pipe(
        tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
      );
  }

  obtenerCampoJWT(campo: string): string {
    const token = localStorage.getItem(this.llaveToken);
    if (!token) { return ''; }
    var dataToken = JSON.parse(atob(token.split('.')[1]));
    return dataToken[campo];
  }

  guardarToken(respuestaAutenticacion: RespuestaAutenticacionDTO) {
    localStorage.setItem(this.llaveToken, respuestaAutenticacion.token);
    localStorage.setItem(this.llaveExpiracion, respuestaAutenticacion.expiracion.toString());

    // Almacenar el ID del usuario si está presente en la respuesta
    if (respuestaAutenticacion.userId) {
      localStorage.setItem(this.llaveUserId, respuestaAutenticacion.userId);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.llaveToken);
  }

  // Método para obtener el ID del usuario almacenado
  getUserId(): string | null {
    return localStorage.getItem(this.llaveUserId);
  }

  estaLogueado(): boolean {
    const token = localStorage.getItem(this.llaveToken);
    if (!token) {
      return false;
    }

    const expiracion = localStorage.getItem(this.llaveExpiracion)!;
    const expiracionFecha = new Date(expiracion);

    if (expiracionFecha <= new Date()) {
      this.logout();
      return false;
    }

    return true;
  }

  logout() {
    localStorage.removeItem(this.llaveToken);
    localStorage.removeItem(this.llaveExpiracion);
    localStorage.removeItem(this.llaveUserId); // También eliminar el ID de usuario
  }

  obtenerRol(): string {
    const esAdmin = this.obtenerCampoJWT('esadmin');
    return esAdmin ? 'admin' : '';
  }
}
