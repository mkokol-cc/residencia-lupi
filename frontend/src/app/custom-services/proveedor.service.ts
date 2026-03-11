import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Proveedor } from '../model/proveedor';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
    private proveedoresUrl = environment.apiUrl+'api/proveedores';  // URL a la API en memoria

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  /** GET proveedores from the server */
  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.proveedoresUrl)
      .pipe(
        tap(_ => console.log('Servicio: proveedores obtenidos')),
        catchError(this.handleError<Proveedor[]>('getProveedores', []))
      );
  }

  searchProveedores(search: string, page: number, size: number, sort: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);

    return this.http.get<any>(`${this.proveedoresUrl}/search`, { params });
  }

  /** POST: add a new proveedor to the server */
  /** PUT: update the proveedor on the server */
  guardarProveedor(proveedor: Proveedor): Observable<any> {
    if (proveedor.id) {
      const url = `${this.proveedoresUrl}/${proveedor.id}`;
      return this.http.put(url, proveedor, this.httpOptions).pipe(
        tap(_ => console.log(`Servicio: proveedor actualizado id=${proveedor.id}`)),
        catchError(this.handleError<any>('updateProveedor'))
      );
    }
    return this.http.post<Proveedor>(this.proveedoresUrl, proveedor, this.httpOptions).pipe(
      tap((newproveedor: Proveedor) => console.log(`Servicio: proveedor agregado w/ id=${newproveedor.id}`)),
      catchError(this.handleError<Proveedor>('addProveedor'))
    );
  }

  /** DELETE: delete the proveedor from the server */
  eliminarProveedor(id: number): Observable<Proveedor> {
    const url = `${this.proveedoresUrl}/${id}`;
    return this.http.delete<Proveedor>(url, this.httpOptions).pipe(
      tap(_ => console.log(`Servicio: proveedor eliminado id=${id}`)),
      catchError(this.handleError<Proveedor>('deleteProveedor'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}