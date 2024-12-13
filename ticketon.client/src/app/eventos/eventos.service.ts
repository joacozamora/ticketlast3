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

  // Obtener datos para la página principal
  public obtenerLandingPage(): Observable<LandingPageDTO> {
    return this.http.get<LandingPageDTO>(`${this.apiURL}/landing`);
  }

  // Obtener un evento por ID
  public obtenerPorId(id: number): Observable<EventoDTO> {
    return this.http.get<EventoDTO>(`${this.apiURL}/${id}`);
  }

  // Crear un nuevo evento
  public crear(evento: EventoCreacionDTO): Observable<EventoDTO> {
    const formData = this.construirFormData(evento);
    return this.http.post<EventoDTO>(this.apiURL, formData).pipe(
      catchError((error) => {
        console.error('Error al crear evento:', error);
        return throwError(() => new Error('No se pudo crear el evento. Inténtalo de nuevo.'));
      })
    );
  }

  // Obtener eventos creados por un usuario
  public obtenerEventosCreados(email: string): Observable<EventosPageDTO> {
    return this.http.get<EventosPageDTO>(`${this.apiURL}/eventosPage`, {
      params: new HttpParams().set('email', email),
    });
  }

  // Actualizar un evento existente
  public actualizar(id: number, evento: EventoCreacionDTO) {
    const formData = this.construirFormData(evento);

    // Log para revisar el contenido del FormData
    formData.forEach((value, key) => {
      console.log(`FormData - ${key}:`, value);
    });

    return this.http.put(`${this.apiURL}/${id}`, formData).pipe(
      catchError((error) => {
        console.error('Error al actualizar evento:', error);
        return throwError(() => new Error('No se pudo actualizar el evento.'));
      })
    );
  }

  // Eliminar un evento
  public borrar(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar evento:', error);
        return throwError(() => new Error('No se pudo eliminar el evento.'));
      })
    );
  }

  public pausar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiURL}/${id}/pausar`, {}).pipe(
      catchError((error) => {
        console.error('Error al pausar/reanudar el evento:', error);
        return throwError(() => new Error('No se pudo pausar/reanudar el evento.'));
      })
    );
  }

  // Construir el FormData para solicitudes que incluyen archivos
  private construirFormData(evento: EventoCreacionDTO): FormData {
    const formData = new FormData();

    // Campos obligatorios
    formData.append('nombre', evento.nombre);
    formData.append('fechaInicio', evento.fechaInicio.toISOString().split('T')[0]);
    formData.append('latitud', evento.latitud.toString());
    formData.append('longitud', evento.longitud.toString());

    // Campos opcionales con validación
    formData.append('direccion', evento.direccion || '');
    formData.append('nombreLugar', evento.nombreLugar || '');
    formData.append('esPublicitado', evento.esPublicitado?.toString() || 'false');
    formData.append('activo', evento.activo?.toString() || 'true');

    // Adjuntar imagen si existe
    if (evento.imagen) {
      formData.append('imagen', evento.imagen);
    }

    return formData;
  }

  obtenerNombreEvento(idEvento: number): Observable<string> {
    return this.http.get<string>(`${this.apiURL}/nombre/${idEvento}`);
  }

  // Obtener todos los eventos
  public obtenerTodos(): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.apiURL}/todos`);
  }
}


