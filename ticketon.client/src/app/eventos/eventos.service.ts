import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { EventoCreacionDTO, EventoDTO, LandingPageDTO, EventosPageDTO } from './evento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventosService {
  private apiURL = environment.apiURL + '/eventos';

  constructor(private http: HttpClient) { }

  public obtenerLandingPage(): Observable<LandingPageDTO> {
    return this.http.get<LandingPageDTO>(`${this.apiURL}/landing`);
  }

  public obtenerEventoPage(email: string): Observable<EventosPageDTO> {
    const params = new HttpParams().set('email', email);
    return this.http.get<EventosPageDTO>(`${this.apiURL}/eventosPage`, { params });
  }

  public obtenerPorId(id: number): Observable<EventoDTO> {
    return this.http.get<EventoDTO>(`${this.apiURL}/${id}`);
  }

  public crear(evento: EventoCreacionDTO): Observable<EventoDTO> {
    const formData = this.construirFormData(evento);
    return this.http.post<EventoDTO>(this.apiURL, formData).pipe(
      catchError((error) => {
        console.error('Error al crear evento:', error);
        return throwError(() => new Error('No se pudo crear el evento. Inténtalo de nuevo.'));
      })
    );
  }

  public actualizar(id: number, evento: EventoCreacionDTO) {
    const formData = this.construirFormData(evento);
    return this.http.put(`${this.apiURL}/${id}`, formData).pipe(
      catchError((error) => {
        console.error('Error al actualizar evento:', error);
        return throwError(() => new Error('No se pudo actualizar el evento.'));
      })
    );
  }

  public borrar(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar evento:', error);
        return throwError(() => new Error('No se pudo eliminar el evento.'));
      })
    );
  }

  private construirFormData(evento: EventoCreacionDTO): FormData {
    const formData = new FormData();
    formData.append('nombre', evento.nombre);
    formData.append('fechaInicio', evento.fechaInicio.toISOString().split('T')[0]);
    formData.append('latitud', evento.latitud.toString());
    formData.append('longitud', evento.longitud.toString());

    if (evento.imagen) {
      formData.append('imagen', evento.imagen); // Aquí se envía la imagen al backend
    }

    return formData;
  }

  public obtenerTodos(): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.apiURL}/todos`);
  }
}

//import { Injectable } from '@angular/core';
//import { HttpClient, HttpParams } from '@angular/common/http';
//import { Observable } from 'rxjs';
//import { EventoCreacionDTO, EventoDTO, LandingPageDTO, EventosPageDTO } from './evento';
//import { environment } from '../../environments/environment';

//@Injectable({
//  providedIn: 'root'
//})
//export class EventosService {
//  private apiURL = environment.apiURL + '/eventos';

//  constructor(private http: HttpClient) { }

//  public obtenerLandingPage(): Observable<LandingPageDTO> {
//    return this.http.get<LandingPageDTO>(`${this.apiURL}/landing`);
//  }

//  public obtenerEventoPage(email: string): Observable<EventosPageDTO> {
//    const params = new HttpParams().set('email', email);
//    return this.http.get<EventosPageDTO>(`${this.apiURL}/eventosPage`, { params });
//  }

//  public obtenerPorId(id: number): Observable<EventoDTO> {
//    return this.http.get<EventoDTO>(`${this.apiURL}/${id}`);
//  }

//  public crear(evento: EventoCreacionDTO): Observable<EventoDTO> {
//    const formData = this.construirFormData(evento);
//    return this.http.post<EventoDTO>(this.apiURL, formData);
//  }

//  public actualizar(id: number, evento: EventoCreacionDTO) {
//    const formData = this.construirFormData(evento);
//    return this.http.put(`${this.apiURL}/${id}`, formData);
//  }

//  public borrar(id: number) {
//    return this.http.delete(`${this.apiURL}/${id}`);
//  }

//  private construirFormData(evento: EventoCreacionDTO): FormData {
//    const formData = new FormData();
//    formData.append('nombre', evento.nombre);
//    formData.append('fechaInicio', evento.fechaInicio.toISOString().split('T')[0]);
//    formData.append('latitud', evento.latitud.toString().replace('.', ','));
//    formData.append('longitud', evento.longitud.toString().replace('.', ','));

//    if (evento.imagen) {
//      formData.append('imagen', evento.imagen);
//    }

//    return formData;
//  }

//  public obtenerTodos(): Observable<EventoDTO[]> {
//    return this.http.get<EventoDTO[]>(`${this.apiURL}/todos`);
//  }
//}




