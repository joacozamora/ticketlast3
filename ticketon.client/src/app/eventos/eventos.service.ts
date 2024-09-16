import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoCreacionDTO } from './evento';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'https://localhost:7225/api/eventos';


  constructor(private http: HttpClient) { }

  createEvento(evento: any): Observable<any> {
    return this.http.post(this.apiUrl, evento);
  }
}



export class Evento {
  id!: number;
  nombre!: string;
  /*ubicacion!: string;*/
}

