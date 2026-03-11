import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operacion } from '../model/operacion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperacionService {
  private apiUrl = environment.apiUrl+'api/operaciones'; // URL de la API para operaciones

  constructor(private http: HttpClient) { }

  // Método para obtener todas las operaciones (para filtrado en cliente)
  getOperaciones(): Observable<Operacion[]> {
    return this.http.get<Operacion[]>(this.apiUrl);
  }

  // Método para buscar/filtrar operaciones con paginación
  searchOperaciones(filters: any, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Añadir filtros a los parámetros
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== '' && value !== undefined) {
        if (key === 'fechaInicio' || key === 'fechaFin') {
          params = params.set(key, new Date(value).toISOString());
        } else {
          params = params.set(key, value);
        }
      }
    });

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  // Guardar (crear o actualizar) una operación
  guardarOperacion(operacion: Operacion): Observable<Operacion> {
    return operacion.id
      ? this.http.put<Operacion>(`${this.apiUrl}/${operacion.id}`, operacion)
      : this.http.post<Operacion>(this.apiUrl, operacion);
  }

  // Eliminar una operación por ID
  eliminarOperacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}