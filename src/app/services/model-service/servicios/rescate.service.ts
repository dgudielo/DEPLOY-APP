import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginService } from '../user-perfil/login.service';

@Injectable({
  providedIn: 'root'
})
export class RescateService {

  baseurl: string = environment.SERVER_URL;

  constructor(private http: HttpClient, private loginService: LoginService) { }

    // Http Headers
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.loginService.currentUserValue.token}`
      })
    }

    SaveRescate(Rescate: FormGroup) {
        /*Get del servicio */
        return this.http.post<any>(this.baseurl + "Rescate", Rescate, this.httpOptions)
          .pipe(map(msgRes => {
            // login successful if there's a jwt token in the response
            if (msgRes && msgRes.codError == 0) {
              //console.log(msgRes);
              return msgRes;
            }
            return msgRes;
          }));
      }


      SavePDF(Rescate: FormGroup) {
        /*Get del servicio */
        return this.http.post<any>(this.baseurl + "PdfServicio", Rescate, this.httpOptions)
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
