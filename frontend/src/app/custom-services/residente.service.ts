import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Residente } from '../model/residente';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResidenteService {
  private residentesUrl = environment.apiUrl+'api/residentes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getResidentes(): Observable<Residente[]> {
    return this.http.get<Residente[]>(this.residentesUrl).pipe(
      tap(_ => console.log('Servicio: residentes obtenidos')),
      catchError(this.handleError<Residente[]>('getResidentes', []))
    );
  }

  searchResidentes(search: string, page: number, size: number, sort: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);

    return this.http.get<any>(`${this.residentesUrl}/search`, { params });
  }

  guardarResidente(residente: Residente): Observable<any> {
    if (residente.id) {
      const url = `${this.residentesUrl}/${residente.id}`;
      return this.http.put(url, residente, this.httpOptions).pipe(
        tap(_ => console.log(`Servicio: residente actualizado id=${residente.id}`)),
        catchError(this.handleError<any>('updateResidente'))
      );
    }
    return this.http.post<Residente>(this.residentesUrl, residente, this.httpOptions).pipe(
      tap((newResidente: Residente) => console.log(`Servicio: residente agregado w/ id=${newResidente.id}`)),
      catchError(this.handleError<Residente>('addResidente'))
    );
  }

  eliminarResidente(id: string | number): Observable<Residente> {
    const url = `${this.residentesUrl}/${id}`;
    return this.http.delete<Residente>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Servicio: residente eliminado id=${id}`)),
      catchError(this.handleError<Residente>('deleteResidente'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}