import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
let isHandling401 = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const excludedPaths = [
    '/auth/login',
    '/auth/refresh'
  ];

  const shouldExclude = excludedPaths.some(path =>
    req.url.includes(path)
  );

  if (shouldExclude) {
    return next(req);
  }

  const token = storageService.getToken();
  let authReq = req;

  if (token) {
    isHandling401 = false;
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (!isHandling401) {
          isHandling401 = true;
          authService.logout();
          storageService.deleteSession();
          alert('Su sesion ha caducado debe volver a iniciar sesion');
          router.navigate(['/login']);
        }
      }
      /*if (error instanceof HttpErrorResponse && error.status === 403) {
        return handle403Error(authReq, next, authService);
      }*/
      return throwError(() => error);
    })
  );
};

const handle403Error = (request: any, next: any, authService: AuthService): Observable<any> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.token);
        return next(request.clone({
          setHeaders: {
            Authorization: `Bearer ${response.token}`
          }
        }));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => {
        return next(request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        }));
      })
    );
  }
};
