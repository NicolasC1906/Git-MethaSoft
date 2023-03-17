import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    // Display cookie and privacy policy toast
    this._toastrService.info('Al continuar, aceptas nuestras políticas y uso de cookies.', 'Aviso de privacidad y cookies', {
      toastClass: 'toast ngx-toastr',
      closeButton: true,
      positionClass: 'toast-bottom-left',
      progressBar: true,
      timeOut: 8000,
      extendedTimeOut: 0,
      tapToDismiss: true,
      disableTimeOut: false,
      onActivateTick: true,
    });
  
    return this._http
      .post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
  
            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'Ha iniciado sesión correctamente como ' +
                  user.role +
                  ' usuario de MethaSoft. Ahora puedes empezar a explorar. ¡Disfrutar! 🎉',
                '👋 Bienvenido, ' + user.firstName + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);
  
            // notify
            this.currentUserSubject.next(user);
          }
  
          return user;
        })
      );
  }
  

  /**
   * User logout
   *
   */
  logout() {
    // Display goodbye toast!
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Bogota',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    const formattedTime = formatter.format(now);
    const toastrOptions: Partial<IndividualConfig> = {
      toastClass: 'toast ngx-toastr',
      closeButton: true,
      enableHtml: true,
      positionClass: 'toast-top-center',
      progressBar: true,
      timeOut: 8000,
      extendedTimeOut: 0,
      tapToDismiss: false,
      disableTimeOut: false,
      onActivateTick: true,
    };
    this._toastrService.info(
      `<span>Sesión cerrada de forma segura.</span><br/><small>Solicitud realizada a las ${formattedTime}</small>`,
      '¡Adiós!',
      toastrOptions
    );
  
    // remove all items from local storage to log user out
    localStorage.clear();
    // remove all cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
    }
    // notify
    this.currentUserSubject.next(null);
  }
  
  
}
