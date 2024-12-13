

import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { CredencialesLoginDTO, CredencialesUsuarioDTO, RespuestaAutenticacionDTO, UsuarioDTO } from './seguridad';
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

  obtenerToken(): string | null{
    return localStorage.getItem(this.llaveToken);
  }


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



  hacerProductora(email: string) {
    return this.http.post(`${this.urlBase}/hacerproductora`, { email });
  }

  removerProductora(email: string) {
    return this.http.post(`${this.urlBase}/removerproductora`, { email });
  }

  
  actualizarUsuario(email: string, usuarioActualizado: CredencialesUsuarioDTO): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/actualizar/${email}`, usuarioActualizado);
  }


  registrar(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/register`, credenciales)
      .pipe(
        tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
      );
  }

  login(credenciales: CredencialesLoginDTO): Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/login`, credenciales)
      .pipe(
        tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
      );
  }

  obtenerCampoJWT(campo: string): string {
    const token = localStorage.getItem(this.llaveToken);
    if (!token){ return ''}
    var dataToken = JSON.parse(atob(token.split('.')[1]))
    return dataToken[campo];
  }

  guardarToken(respuestaAutenticacion: RespuestaAutenticacionDTO) {
    localStorage.setItem(this.llaveToken, respuestaAutenticacion.token);
    localStorage.setItem(this.llaveExpiracion, respuestaAutenticacion.expiracion.toString());

    // Almacenar el ID del usuario si est� presente en la respuesta
    if (respuestaAutenticacion.userId) {
      localStorage.setItem(this.llaveUserId, respuestaAutenticacion.userId);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.llaveToken);
  }

  // M�todo para obtener el ID del usuario almacenado
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

  obtenerUsuarioPorCorreo(email: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.urlBase}/${email}`);
  }

  logout() {
    localStorage.removeItem(this.llaveToken);
    localStorage.removeItem(this.llaveExpiracion);
    localStorage.removeItem(this.llaveUserId);
  }

  obtenerRol(): string {
    const esAdmin = this.obtenerCampoJWT('esadmin');
    const esProductora = this.obtenerCampoJWT('esproductora');

    if (esAdmin === 'true') {
      return 'admin';
    } else if (esProductora === 'true') {
      return 'productora';
    } else {
      return '';
    }
  }
}

