import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneroCreacionDTO } from './genero';

@Injectable({
  providedIn: 'root'
})

export class GenerosService {
  private apiUrl = 'https://localhost:7225/api/generos';

  constructor(private http: HttpClient) { }

  createGenero(genero: any): Observable<any> {
    return this.http.post(this.apiUrl, genero);
  }
}
