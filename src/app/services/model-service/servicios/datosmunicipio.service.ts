import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from '../user-perfil/login.service';

@Injectable({
  providedIn: 'root'
})
export class DatosMunicipioService {

  baseurl: string = environment.SERVER_URL;

  constructor(private http: HttpClient, private loginService: LoginService) { }

    // Http Headers
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.loginService.currentUserValue.token}`
      })
    }

    GetDatosMunicipio(IdMunicipio: string,Area: string) {
      return this.http.get<any>(this.baseurl + "Catalogos/datosMunicipios?id="+IdMunicipio+"&area="+Area ,this.httpOptions);
    }


   
}
