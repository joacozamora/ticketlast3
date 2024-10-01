import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoCreacionDTO, EventoDTO } from './evento';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'https://localhost:7225/api/eventos';


  constructor(private http: HttpClient) { }

  //public crear(evento: EventoCreacionDTO) {
  //  return this.http.post(this.apiUrl, evento);
  //}
  public crear(evento: EventoCreacionDTO): Observable<EventoDTO> {
    const formData = this.construirFormData(evento);
    return this.http.post<EventoDTO>(this.apiUrl, formData);
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





