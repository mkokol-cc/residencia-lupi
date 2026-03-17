import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../custom-services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //return true;
  return authService.isAuthenticated().pipe(
    map(isAuth => {
      //console.log("Soy el guard, isAuth: "+isAuth)
      if (isAuth) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
