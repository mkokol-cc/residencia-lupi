import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Pago } from '../model/pago';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private pagosUrl = environment.apiUrl+'api/pagos';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.pagosUrl)
      .pipe(
        tap(_ => console.log('Servicio: pagos obtenidos')),
        catchError(this.handleError<Pago[]>('getPagos', []))
      );
  }

  getPagosPaged(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.pagosUrl}/paged`, { params });
  }

  searchPagos(filters: any, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.entidadId) params = params.set('entidadId', filters.entidadId);
    if (filters.metodoId) params = params.set('metodoId', filters.metodoId);
    if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString().split('T')[0]);
    if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString().split('T')[0]);
    if (filters.montoMin) params = params.set('montoMin', filters.montoMin);
    if (filters.montoMax) params = params.set('montoMax', filters.montoMax);
    if (filters.orden) {
      params = params.set('sort', filters.orden);
    }
    
    return this.http.get<any>(`${this.pagosUrl}/search`, { params });
  }

  guardarPago(pago: Pago): Observable<any> {
    if (pago.id) {
      const url = `${this.pagosUrl}/${pago.id}`;
      return this.http.put(url, pago, this.httpOptions).pipe(
        tap(_ => console.log(`Servicio: pago actualizado id=${pago.id}`)),
        catchError(this.handleError<any>('updatePago'))
      );
    }
    return this.http.post<Pago>(this.pagosUrl, pago, this.httpOptions).pipe(
      tap((newPago: Pago) => console.log(`Servicio: pago agregado w/ id=${newPago.id}`)),
      catchError(this.handleError<Pago>('addPago'))
    );
  }

  eliminarPago(id: string | number): Observable<Pago> {
    const url = `${this.pagosUrl}/${id}`;
    return this.http.delete<Pago>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Servicio: pago eliminado id=${id}`)),
      catchError(this.handleError<Pago>('deletePago'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}
