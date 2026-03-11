import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Concepto } from '../model/concepto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConceptoService {
  private conceptosUrl = environment.apiUrl+'api/conceptos';  // URL a la API en memoria

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET conceptos from the server */
  getConceptos(): Observable<Concepto[]> {
    return this.http.get<Concepto[]>(this.conceptosUrl)
      .pipe(
        tap(_ => console.log('Servicio: conceptos obtenidos')),
        catchError(this.handleError<Concepto[]>('getConceptos', []))
      );
  }

  searchConceptos(search: string, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) params = params.set('search', search);

    return this.http.get<any>(`${this.conceptosUrl}/search`, { params });
  }

  /** POST: add a new concepto to the server */
  /** PUT: update the concepto on the server */
  guardarConcepto(concepto: Concepto): Observable<any> {
    if (concepto.id) {
      const url = `${this.conceptosUrl}/${concepto.id}`;
      return this.http.put(url, concepto, this.httpOptions).pipe(
        tap(_ => console.log(`Servicio: concepto actualizado id=${concepto.id}`)),
        catchError(this.handleError<any>('updateConcepto'))
      );
    }
    return this.http.post<Concepto>(this.conceptosUrl, concepto, this.httpOptions).pipe(
      tap((newConcepto: Concepto) => console.log(`Servicio: concepto agregado w/ id=${newConcepto.id}`)),
      catchError(this.handleError<Concepto>('addConcepto'))
    );
  }

  /** DELETE: delete the concepto from the server */
  eliminarConcepto(id: number): Observable<Concepto> {
    const url = `${this.conceptosUrl}/${id}`;
    return this.http.delete<Concepto>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Servicio: concepto eliminado id=${id}`)),
      catchError(this.handleError<Concepto>('deleteConcepto'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}