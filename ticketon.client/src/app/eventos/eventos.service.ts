import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoCreacionDTO, EventoDTO, EventosPageDTO, LandingPageDTO } from './evento';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'https://localhost:7225/api/eventos';


  constructor(private http: HttpClient) { }

  public obtenerLandingPage(): Observable<LandingPageDTO> {
    return this.http.get<LandingPageDTO>(`${this.apiUrl}/landing`);
  }

  public obtenerEventoPage(email: string): Observable<EventosPageDTO> {
    const params = new HttpParams().set('email', email); // Configura los parámetros
    return this.http.get<EventosPageDTO>(`${this.apiUrl}/eventosPage`, { params });
  }


  public obtenerPorId(id: number): Observable<EventoDTO> {
    return this.http.get<EventoDTO>(`${this.apiUrl}/${id}`);
  }

  public crear(evento: EventoCreacionDTO): Observable<EventoDTO> {
    const formData = this.construirFormData(evento);
    return this.http.post<EventoDTO>(this.apiUrl, formData);
  }

  public actualizar(id: number, evento: EventoCreacionDTO) {
    const formData = this.construirFormData(evento);
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  public borrar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  private construirFormData(evento: EventoCreacionDTO): FormData {
    const formData = new FormData();
    formData.append('nombre', evento.nombre);
    formData.append('fechaInicio', evento.fechaInicio.toISOString().split('T')[0]);
    formData.append('latitud', evento.latitud.toString().replace('.', ','));
    formData.append('longitud', evento.longitud.toString().replace('.', ','));

    if (evento.imagen) {
      formData.append('imagen', evento.imagen);
    }

    return formData;

  }

  public obtenerTodos(): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.apiUrl}/todos`);
  }
  //createEvento(evento: any): Observable<any> {
  //  return this.http.post(this.apiUrl, evento);
  //}
}





