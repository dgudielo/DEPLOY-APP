import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  baseurl: string = environment.SERVER_URL;

  constructor(private http: HttpClient, private loginService: LoginService) { }

    // Http Headers
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.loginService.currentUserValue.token}`
      })
    }

    GetUser(Perfil: FormGroup) {
      /*Get del servicio */
      return this.http.post<any>(this.baseurl + "GetUser", Perfil, this.httpOptions)
        .pipe(map(msgRes => {
          // login successful if there's a jwt token in the response
          if (msgRes && msgRes.codError == 0) {
            //console.log(msgRes);
            //this.currentResponseMsgSubject.next(msgRes);
            return msgRes;
          }
          return msgRes;
        }));
    }


    SaveUser(Perfil: FormGroup) {
      /*Get del servicio */
      return this.http.post<any>(this.baseurl + "SaveUser", Perfil, this.httpOptions)
        .pipe(map(msgRes => {
          // login successful if there's a jwt token in the response
          if (msgRes && msgRes.codError == 0) {
            //console.log(msgRes);
            return msgRes;
          }
          return msgRes;
        }));
    }
}