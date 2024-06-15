import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../user-perfil/login.service';

interface personaAtendida {
  carnet: string;
  nombre: string;
  Apellido: string;
  totalServicios: number;
}

interface postPersonaAtendida{
  Cod_Compania: string;
  Fecha_Ini: string;
  Fecha_Fin: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonasAtendidasService {

  baseurl: string = environment.SERVER_URL + `estadisticaAnual?Cod_Compania=`
  baseurl2: string = environment.SERVER_URL + 'estadisticaAnualV1'

  constructor(
    public _http: HttpClient,
    public loginService: LoginService
  ) { }

  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.loginService.currentUserValue.token}`
    })
  }

  getPersonasAtendidas(company: string): Observable<any>{
    return this._http.get<any>(this.baseurl + company, this.httpOption)
    .pipe(map(data => {
      return data
    }))
  }

  postPersonasAtendidas(personaAtendida: postPersonaAtendida): Observable<any>{
    return this._http.post(this.baseurl2, personaAtendida, this.httpOption)
    .pipe(map(data => {
      return data
    }))
  }
}
