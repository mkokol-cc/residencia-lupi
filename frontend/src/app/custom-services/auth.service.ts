import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'api/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.accessToken) {
          this.setToken(response.accessToken);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Realiza una comprobación rápida en el lado del cliente para ver si existe un token y no ha expirado.
   * Es adecuado para la lógica de la interfaz de usuario (por ejemplo, mostrar/ocultar botones), pero no para proteger rutas.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) {
        // Un token sin fecha de expiración se considera inválido
        return false;
      }
      const now = Math.floor(Date.now() / 1000);
      // Devuelve true si el token no ha expirado
      return exp > now;
    } catch (e) {
      // Error al decodificar el token
      return false;
    }
  }

  /**
   * Realiza una comprobación de autenticación completa.
   * 1. Comprueba si existe un token localmente.
   * 2. Valida el token contra el backend para asegurar que sigue activo.
   * Este es el método seguro que se debe usar en los guards de las rutas.
   */
  public isAuthenticated(): Observable<boolean> {
    //const token = this.getToken();

    if (!this.isLoggedIn()) {
      //console.log('AuthGuard: Token ausente o inválido (verificación cliente). Acceso denegado.');
      return of(false);
    }

    //const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    //console.log('AuthGuard: Token válido (cliente). Verificando con el backend...');
    return this.http.get<boolean>(`${this.apiUrl}/validate`/*, { headers }*/).pipe(
      map(() => true),
      catchError(() => {
        //console.warn('AuthGuard: El backend rechazó el token. Se cerrará la sesión.');
        this.logout();
        return of(false);
      })
    );
  }

  // Método útil para obtener roles si los necesitas en el futuro
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles ? payload.roles.split(',') : [];
  }
}
