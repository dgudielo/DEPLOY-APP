import { Component, Injectable } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { LoginService } from '../user-perfil/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

interface indicesServicio {
  Cod_Servicio: number;
  Des_Servicio: string;
  Total: number;
}

interface postIndicesServicio{
  Cod_Compania: string;
  Fecha_Ini: string;
  Fecha_Fin: string;
}

@Injectable({
  providedIn: 'root'
})

export class IndicesServicioService {

  baseurl: string = environment.SERVER_URL + `indiservicio?Cod_Compania=`
  baseurl2: string = environment.SERVER_URL + 'indiservicioV1'

  dataSource: any[] = [];
  constructor(
    public loginService: LoginService,
    private _http: HttpClient,
  ) { }

  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.loginService.currentUserValue.token}`
    })
  }

  getIndiceServicio(company: string): Observable<indicesServicio> {
    return this._http.get<indicesServicio>(this.baseurl + company, this.httpOption)
        .pipe(map(data => {
          return data
        }));
  }

  postIndiceServicio(indice: postIndicesServicio): Observable<any> {
    return this._http.post(this.baseurl2, indice, this.httpOption)
    .pipe(map(data => {
      return data
    }))
  }

}
