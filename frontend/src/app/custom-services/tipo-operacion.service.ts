import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoOperacion } from '../model/tipo-operacion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoOperacionService {
  private apiUrl = environment.apiUrl+'api/tipos-operacion';

  constructor(private http: HttpClient) { }

  // For dropdowns, get all without pagination
  getTiposOperacion(): Observable<TipoOperacion[]> {
    return this.http.get<TipoOperacion[]>(this.apiUrl);
  }

  // Search with pagination for CRUD screen
  searchTiposOperacion(search: string, page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  guardar(tipo: TipoOperacion): Observable<TipoOperacion> {
    return tipo.id
      ? this.http.put<TipoOperacion>(`${this.apiUrl}/${tipo.id}`, tipo)
      : this.http.post<TipoOperacion>(this.apiUrl, tipo);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}