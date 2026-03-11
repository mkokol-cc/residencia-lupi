import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MovimientoSaldo } from '../model/movimiento-saldo';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovimientoSaldoService {
  private movimientosUrl = environment.apiUrl+'api/movimientos-saldo';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getMovimientosPaged(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.movimientosUrl}/paged`, { params });
  }

  searchMovimientos(filters: any, page: number, size: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.entidadId) params = params.set('entidadId', filters.entidadId);
    if (filters.conceptoId) params = params.set('conceptoId', filters.conceptoId);
    if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio.toISOString().split('T')[0]);
    if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin.toISOString().split('T')[0]);
    if (filters.montoMin) params = params.set('montoMin', filters.montoMin);
    if (filters.montoMax) params = params.set('montoMax', filters.montoMax);
    if (filters.orden) {
      params = params.set('sort', filters.orden);
    }

    return this.http.get<any>(`${this.movimientosUrl}/search`, { params });
  }

  getMovimientos(): Observable<MovimientoSaldo[]> {
    return this.http.get<MovimientoSaldo[]>(this.movimientosUrl).pipe(
      tap(_ => console.log('Servicio: movimientos de saldo obtenidos')),
      catchError(this.handleError<MovimientoSaldo[]>('getMovimientos', []))
    );
  }

  guardarMovimiento(movimiento: MovimientoSaldo): Observable<any> {
    if (movimiento.id) {
      const url = `${this.movimientosUrl}/${movimiento.id}`;
      return this.http.put(url, movimiento, this.httpOptions).pipe(
        tap(_ => console.log(`Servicio: movimiento actualizado id=${movimiento.id}`)),
        catchError(this.handleError<any>('updateMovimiento'))
      );
    }
    return this.http.post<MovimientoSaldo>(this.movimientosUrl, movimiento, this.httpOptions).pipe(
      tap((newMovimiento: MovimientoSaldo) => console.log(`Servicio: movimiento agregado w/ id=${newMovimiento.id}`)),
      catchError(this.handleError<MovimientoSaldo>('addMovimiento'))
    );
  }

  eliminarMovimiento(id: string | number): Observable<MovimientoSaldo> {
    const url = `${this.movimientosUrl}/${id}`;
    return this.http.delete<MovimientoSaldo>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Servicio: movimiento eliminado id=${id}`)),
      catchError(this.handleError<MovimientoSaldo>('deleteMovimiento'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}