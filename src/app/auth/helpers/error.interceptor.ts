import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'app/auth/service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * Constructor de la clase ErrorInterceptor.
   * @param {Router} _router - Router para redirigir a la página de error.
   * @param {AuthenticationService} _authenticationService - Servicio de autenticación para cerrar la sesión.
   */
  constructor(private _router: Router, private _authenticationService: AuthenticationService) {}

  /**
   * Función que intercepta las solicitudes HTTP para manejar errores.
   * @param {HttpRequest<any>} request - La solicitud HTTP interceptada.
   * @param {HttpHandler} next - El siguiente controlador en la cadena de interceptores.
   * @returns {Observable<HttpEvent<any>>} Un observable que contiene la respuesta HTTP o un error.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Manejamos cualquier error con el operador catchError del observable que se retorna.
    return next.handle(request).pipe(
      catchError(err => {
        // Si la respuesta del servidor es 401 Unauthorized o 403 Forbidden, redirigimos a la página de error.
        if ([401, 403].indexOf(err.status) !== -1) {
          this._router.navigate(['/pages/miscellaneous/not-authorized']);
          // También podríamos cerrar la sesión del usuario si se necesita y recargar la página con location.reload(true).
          // this._authenticationService.logout();
          // location.reload(true);
        }
        // Si no es un error de autorización, lanzamos una excepción con el mensaje de error del servidor.
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
