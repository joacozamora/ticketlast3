import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { CredencialesUsuarioDTO, RespuestaAutenticacionDTO } from './seguridad';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/usuarios';
  private readonly llaveToken = 'token';
  private readonly llaveExpiracion = 'token-expiracion'

  obtenerUsuariosPaginado(paginacion: PaginacionDTO): Observable<HttpResponse<UsuarioDTO[]>> {
    let queryParams = construirQueryParams(paginacion);
    return this.http.get(`${this.urlBase}/ListadoUsuarios`, {params: queryParams, observe: `response`})
  }

  registrar(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/register`, credenciales)
      .pipe(
        tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
      )
  }

  login(credenciales: CredencialesUsuarioDTO): Observable<RespuestaAutenticacionDTO> {
    return this.http.post<RespuestaAutenticacionDTO>(`${this.urlBase}/login`, credenciales)
      .pipe(
        tap(respuestaAutenticacion => this.guardarToken(respuestaAutenticacion))
      )
  }

  obtenerCampoJWT(campo: string): string {
    const token = localStorage.getItem(this.llaveToken);
    if (!token) { return '' }
    var dataToken = JSON.parse(atob(token.split('.')[1]))
    return dataToken[campo];
  }

  guardarToken(respuestaAutenticacion: RespuestaAutenticacionDTO) {
    localStorage.setItem(this.llaveToken, respuestaAutenticacion.token);
    localStorage.setItem(this.llaveExpiracion, respuestaAutenticacion.expiracion.toString());
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

  }

  obtenerRol(): string {
    return ''
  }
}
