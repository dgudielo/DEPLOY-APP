import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginService } from '../user-perfil/login.service';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';

interface personaDestacada {
  carnet: string;
  nombre: string;
  Apellido: string;
  totalServicios: number;
}

interface postPersonaDestacada {
  Cod_Compania: string;
  Fecha_Ini: string;
  Fecha_Fin: string;
}

@Injectable({
  providedIn: 'root'
})

export class PerDescatadoService {

constructor(
  private _http: HttpClient,
  public loginService: LoginService
  ) {  }

  ngOnInit(){
  }

  baseurl: string = environment.SERVER_URL + `perdestacado?Cod_Compania=`
  baseurl2: string = environment.SERVER_URL + 'perdestacadoV1'

  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.loginService.currentUserValue.token}`
    })
  }

  getPersonaDestacada(company: string): Observable<personaDestacada>{
    return this._http.get<personaDestacada>(this.baseurl +company, this.httpOption)
    .pipe(map(data => {
      return data
    }))
  }

  postPersonasDestacadas(personaDestacada: postPersonaDestacada): Observable<any>{
    return this._http.post(this.baseurl2, personaDestacada, this.httpOption)
    .pipe(map(data => {
      return data
    }))
  }
}
