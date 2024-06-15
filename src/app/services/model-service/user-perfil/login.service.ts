import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError as observableThrowError, of, observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './user';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  remember = false;
  baseurl: string = environment.SERVER_URL + 'login/authenticate';
  constructor(private http: HttpClient) {

    const strRemember: string | null = localStorage.getItem('remember');

    if (strRemember !== null) {
      // Convertir el valor almacenado a booleano usando JSON.parse
      this.remember = JSON.parse(strRemember);
      // Ahora puedes usar valorBooleano de manera segura
    }

    if (this.remember) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userInfo')!));
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('userInfo')!));
    }

    this.currentUser = this.currentUserSubject.asObservable();

  }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      /*'Authorization': `Bearer ${localStorage.getItem('token')}`*/
    })
  }

  public get currentUserValue(): User {
    return this.currentUserSubject?.value;
  }

  public get GetRemember(): boolean {
    const rememberDataString = localStorage.getItem('remember');
    return rememberDataString !== null ? JSON.parse(rememberDataString) : null;
  }

  loginUser(username: string, password: string, remember: boolean) {
    return this.http.post<any>(this.baseurl, { username, password }, this.httpOptions)
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('remember', remember == true ? "true" : "false");

          if (remember == true) {
            localStorage.setItem('userInfo', JSON.stringify(user));
          } else {
            sessionStorage.setItem('userInfo', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }


  RolVisible(role: string) {
    const currentUserString = localStorage.getItem('userInfo');
    if (currentUserString !== null) {
      const currentUser = JSON.parse(currentUserString);
      if (currentUser && currentUser.roles && Array.isArray(currentUser.roles)) {
        return currentUser.roles.indexOf(role) > -1;
      }
    }
    return false; // Por defecto, si no se puede determinar el rol o el usuario no está autenticado, devuelve falso.
  }

  GetToken() {
    return this.currentUserSubject.value.token;
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    sessionStorage.clear();
    //localStorage.removeItem('userInfo');
    this.currentUserSubject.next(null!);
  }
}
