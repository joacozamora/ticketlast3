import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoCreacionDTO, EventoDTO, LandingPageDTO } from './evento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  //private apiUrl = 'https://localhost:7225/api/eventos';
  private apiURL = environment.apiURL + '/eventos';


  constructor(private http: HttpClient) { }

  public obtenerLandingPage(): Observable<LandingPageDTO> {
    return this.http.get<LandingPageDTO>(`${this.apiURL}/landing`);
  }

  //public crear(evento: EventoCreacionDTO) {
  //  return this.http.post(this.apiUrl, evento);
  //}
  public crear(evento: EventoCreacionDTO): Observable<EventoDTO> {
    const formData = this.construirFormData(evento);
    return this.http.post<EventoDTO>(this.apiURL, formData);
  }

  public actualizar(id: number, evento: EventoCreacionDTO) {
    const formData = this.construirFormData(evento);
    return this.http.put(`${this.apiURL}/${id}`, formData);
  }

  public borrar(id: number) {
    return this.http.delete(`${this.apiURL}/${id}`);
  }


  private construirFormData(evento: EventoCreacionDTO): FormData {
    const formData = new FormData();
    formData.append('nombre', evento.nombre);
    formData.append('fechaInicio', evento.fechaInicio.toISOString().split('T')[0]);

    if (evento.imagen) {
      formData.append('imagen', evento.imagen);
    }

    return formData;

  }
  //createEvento(evento: any): Observable<any> {
  //  return this.http.post(this.apiUrl, evento);
  //}
}





