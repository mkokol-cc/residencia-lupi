import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MetodoPago } from '../model/metodo-pago';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private metodosPagoUrl = environment.apiUrl+'api/metodos-pago';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.metodosPagoUrl).pipe(
      tap(_ => console.log('Servicio: métodos de pago obtenidos')),
      catchError(this.handleError<MetodoPago[]>('getMetodosPago', []))
    );
  }

  guardarMetodoPago(metodo: MetodoPago): Observable<any> {
    if (metodo.id) {
      const url = `${this.metodosPagoUrl}/${metodo.id}`;
      return this.http.put(url, metodo, this.httpOptions).pipe(
        tap(_ => console.log(`Servicio: método de pago actualizado id=${metodo.id}`)),
        catchError(this.handleError<any>('updateMetodoPago'))
      );
    }
    return this.http.post<MetodoPago>(this.metodosPagoUrl, metodo, this.httpOptions).pipe(
      tap((newMetodo: MetodoPago) => console.log(`Servicio: método de pago agregado w/ id=${newMetodo.id}`)),
      catchError(this.handleError<MetodoPago>('addMetodoPago'))
    );
  }

  eliminarMetodoPago(id: number): Observable<MetodoPago> {
    const url = `${this.metodosPagoUrl}/${id}`;
    return this.http.delete<MetodoPago>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Servicio: método de pago eliminado id=${id}`)),
      catchError(this.handleError<MetodoPago>('deleteMetodoPago'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}