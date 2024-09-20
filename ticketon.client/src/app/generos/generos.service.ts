import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneroCreacionDTO, GeneroDTO } from './genero';

@Injectable({
  providedIn: 'root'
})

export class GenerosService {
  private apiUrl = 'https://localhost:7225/api/generos';

  constructor(private http: HttpClient) { }

  public obtenerTodos(): Observable<GeneroDTO[]> {
    return this.http.get<GeneroDTO[]>(this.apiUrl);
  }


  public obtenerPorId(id: number): Observable<GeneroDTO> {
    return this.http.get<GeneroDTO>(`${this.apiUrl}/${id}`)
  }

  public actualizar(id: number, genero: GeneroCreacionDTO) {
    return this.http.put(`${this.apiUrl}/${id}`, genero);
  }

  public crear(genero: GeneroCreacionDTO) {
    return this.http.post(this.apiUrl, genero);
  }

  createGenero(genero: any): Observable<any> {
    return this.http.post(this.apiUrl, genero);
  }
}
