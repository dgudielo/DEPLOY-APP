import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoginService } from '../user-perfil/login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  baseurl: string = environment.SERVER_URL;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.loginService.currentUserValue.token}`
    })
  }

  GetRptEstadistico(rptEstaMensual: FormGroup) {
    /*Get del servicio */
    return this.http.post<any>(this.baseurl + "rptEstadisticoMesual", rptEstaMensual, this.httpOptions)
      .pipe(map(msgRes => {
        // login successful if there's a jwt token in the response
        if (msgRes && msgRes.codError == "200") {
          //console.log(msgRes);
          //this.currentResponseMsgSubject.next(msgRes);
          return msgRes;
        }
        return msgRes;
      }));
  }
  // Función para generar datos de ejemplo para exportar a Excel
  generateExcelData(): Observable<any[][]> {
    // AQUI HIRIA LA API
    const data = [
      [1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12]
    ];
    return of(data); // Convertimos el array en un Observable y lo retornamos
  }

  GetrptReporteMensual(rptReporteMensual: FormGroup) {
    /*Get del servicio */
    return this.http.post<any>(this.baseurl + "ListadoServicios", rptReporteMensual, this.httpOptions)
      .pipe(map(msgRes => {
        // login successful if there's a jwt token in the response
        if (msgRes && msgRes.codError == "200") {
          //console.log(msgRes);
          //this.currentResponseMsgSubject.next(msgRes);
          return msgRes;
        }
        return msgRes;
      }));
  }

  SavePDF(Rescate: Object) {
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
