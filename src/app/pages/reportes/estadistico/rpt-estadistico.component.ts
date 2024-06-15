import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, MaxLengthValidator } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { APP_DATE_FORMATS, AppDateAdapter } from 'src/app/Helper/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { PerfilService } from 'src/app/services/model-service/user-perfil/perfil.service';
import { LoginService } from 'src/app/services/model-service/user-perfil/login.service';
import { LoadingService } from 'src/app/services/model-service/loading/loading-data.service';
import { ReportesService } from 'src/app/services/model-service/reportes/reportes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';
import * as ExcelJS from 'exceljs';
import { ExcelService } from 'src/app/services/model-service/descarga/excel.service';

@Component({
  selector: 'app-rpt-estadistico',
  templateUrl: './rpt-estadistico.component.html',
  styleUrls: ['./rpt-estadistico.component.scss'],
  providers: [{ provide: DateAdapter, useClass: AppDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})

export class AppRptEstadisticoComponent implements OnInit {

  displayedColumns = ['NoControl', 'Nombre_Solicitante', 'Personas_Atendidas', 'Descripcion_Servicio', 'Des_Clase_Servicio', 'Min_Trabajados', 'Ubicacion', 'NoInterno', 'Fecha_Servicio', 'Acciones'];
  dataSource: MatTableDataSource<servicioListData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
  @ViewChild(MatSort, { static: true }) sort: MatSort = Object.create(null);

  rptEstaMensual: FormGroup;
  rptReporteMensual: FormGroup;
  date = new Date();
  currentYear = new Date().getFullYear();
  listadoServicios: servicioListData[] = [];
  ServicioPdf: FormGroup;

  constructor(private fb: FormBuilder, private excel: ExcelService, public loginService: LoginService, private ToastrService: ToastrService, private rptServicios: ReportesService, public perfilService: PerfilService, public loadingService: LoadingService, breakpointObserver: BreakpointObserver) {
    this.rptEstaMensual = this.fb.group({
      Cod_Compania: [loginService.currentUserValue.cod_compania[0], [Validators.required]],
      Anio: [String(this.date.getFullYear()), [Validators.required]],
      Mes: [String(this.date.getMonth() + 1), [Validators.required]],
      Cod_TipoReporte: ['1'],
      Tipo_Formato: [''],
    });

    this.rptReporteMensual = this.fb.group({
      Cod_Compania: [loginService.currentUserValue.cod_compania[0], [Validators.required]],
      Fecha_Ini: [new Date(), [Validators.required]],
      Fecha_Fin: [new Date(), [Validators.required]],
      Nombre_Solicitante: [''],
    });

    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['NoControl', 'Nombre_Solicitante', 'Personas_Atendidas', 'Descripcion_Servicio', 'Des_Clase_Servicio', 'Min_Trabajados', 'Ubicacion', 'NoInterno', 'Fecha_Servicio', 'Acciones']
        : ['NoControl', 'Nombre_Solicitante', 'Personas_Atendidas', 'Descripcion_Servicio', 'Des_Clase_Servicio', 'Min_Trabajados', 'Ubicacion', 'NoInterno', 'Fecha_Servicio', 'Acciones'];
    });

    this.dataSource = new MatTableDataSource(this.listadoServicios);
    this.submitrptReporteMensual();
  }

  ngOnInit() { }
   
  convertirBase64ToBlob(base64: string, application: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: application });
  }

  descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  submitrptEstaMensual() {
    let Cod_TipoReporte: number = this.rptEstaMensual.controls['Cod_TipoReporte'].value;
    let extension: string = '';
    let application: string = '';

    if (Cod_TipoReporte == 3) {
      this.rptEstaMensual.controls['Tipo_Formato'].setValue("excel");
      extension = '.xls';
      application = 'application/vnd.ms-excel';
    } else {
      this.rptEstaMensual.controls['Tipo_Formato'].setValue("pdf");
      extension = '.pdf';
      application = 'application/pdf';
    }
    this.loadingService.loadingChanged.emit(true);
    this.rptServicios.GetRptEstadistico(this.rptEstaMensual.value)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.loadingService.loadingChanged.emit(false);
          const base64Pdf = data.msgRespuesta;
          const blob = this.convertirBase64ToBlob(base64Pdf, application);
          const fileName = this.rptEstaMensual?.get('Cod_Compania')?.value + "_" + this.rptEstaMensual?.get('Anio')?.value + "_" + this.rptEstaMensual?.get('Mes')?.value + extension;
          this.descargarArchivo(blob, fileName);
        },
        error: (error: HttpErrorResponse) => {
          this.loadingService.loadingChanged.emit(false);
          this.ToastrService.error(error.error.msgRespuesta == "undefined" ? "Ocurrió un error por favor vuelta a intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
            progressBar: true
          });
        }
      });
  }

  submitrptReporteMensual() {
    this.rptReporteMensual.markAllAsTouched()
    this.rptReporteMensual.validator;

    if (this.rptReporteMensual.invalid) {
      this.ToastrService.info("Complete los campos obligatorios", "Notificación", {
        progressBar: true
      });
      return;
    }

    this.loadingService.loadingChanged.emit(true);
    this.rptServicios.GetrptReporteMensual(this.rptReporteMensual.value)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          //console.log(data);
          this.loadingService.loadingChanged.emit(false);
          this.listadoServicios = data;
          this.dataSource = new MatTableDataSource(this.listadoServicios);
          this.ngAfterViewInit();
        },
        error: (error: HttpErrorResponse) => {
          this.loadingService.loadingChanged.emit(false);
          this.ToastrService.error(error.error.msgRespuesta == "undefined" ? "Ocurrió un error por favor vuelta a intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
            progressBar: true
          });
        }
      });
  }

  getPreviousYears(): string[] {
    const Years = [(this.currentYear - 3).toString(), (this.currentYear - 2).toString(), (this.currentYear - 1).toString(), (this.currentYear).toString()];
    return Years;
  }

  get f() {
    return this.rptReporteMensual.controls;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fcnAction(TipoAction: string, row: servicioListData) {
    let application: string = '';
    let extension: string = '';

    if (TipoAction === 'Pdf') {
      application = 'application/pdf';
      extension = '.pdf';
      this.ServicioPdf = this.fb.group({
        Cod_Compania: [row.Cod_Compania],
        NoControl: [row.NoControl]
      });
      this.loadingService.loadingChanged.emit(true);
      this.rptServicios.SavePDF(this.ServicioPdf.value)
        .pipe(first())
        .subscribe(
          data => {
            this.loadingService.loadingChanged.emit(false);
            const base64Pdf = data.msgRespuesta;
            const blob = this.convertirBase64ToBlob(base64Pdf, application);
            const fileName = row.Cod_Compania + "_" + row.NoControl + ".pdf" + extension;
            this.descargarArchivo(blob, fileName);
          },
          (error: HttpErrorResponse) => {
            this.loadingService.loadingChanged.emit(false);
            this.ToastrService.error(error.error.msgRespuesta == "undefined" ? "Ocurrió un error por favor vuelta a iniciar sesión para intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
              progressBar: true
            });
          });
    } else if (TipoAction === 'Edit') {
      console.log('Edit action');
    } else {
      console.log('Other action');
    }
    console.log(row);
  }

  exportDataToExcel(): void {
    let ini_datetime: Date = this.rptReporteMensual.controls["Fecha_Ini"].value;
    let formatted_date_ini = ini_datetime.getDate() + "-" + (ini_datetime.getMonth() + 1) + "-" + ini_datetime.getFullYear()

    let fin_datetime: Date = this.rptReporteMensual.controls["Fecha_Fin"].value;
    let formatted_date_fin = fin_datetime.getDate() + "-" + (fin_datetime.getMonth() + 1) + "-" + fin_datetime.getFullYear()

    //console.log(formatted_date_ini)
    const fileName = 'ExcelServicios-' + formatted_date_ini + ' al ' + formatted_date_fin + '.xlsx';

    this.excel.generateExcel(this.listadoServicios, fileName);
  }

  // private exportExcel(data: any[], fileName: string): void {
  //   data = data.map(item => ({ ...item, Personas_Atendidas: item.Personas_Atendidas.join(', ') }));
  //   const workbook = new ExcelJS.Workbook(); // Crea un libro de trabajo
  //   const worksheet = workbook.addWorksheet('Data'); // Agrega una hoja de trabajo

  //   // Suponiendo que ⁠ data ⁠ es un array de objetos, usa los nombres de las propiedades para los encabezados
  //   const headers = Object.keys(data[0]);
  //   const headerRow = worksheet.addRow(headers);

  //   // Aplica algún estilo al encabezado si lo deseas
  //   headerRow.eachCell((cell, number) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: 'FFFFFF00' },
  //       bgColor: { argb: 'FF0000FF' }
  //     };
  //   });

  //   // Añade los datos al worksheet
  //   data.forEach(d => {
  //     const row: any[] = [];
  //     headers.forEach(header => row.push(d[header]));
  //     worksheet.addRow(row);
  //   });

  //   // Escribir el Excel en un buffer y luego usar FileSaver para guardar el archivo
  //   workbook.xlsx.writeBuffer().then((buffer) => {
  //     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     this.descargarArchivo(blob, ` ${fileName}.xlsx`);
  //   });
  // }

}

export interface servicioListData {
  NoControl: string;
  Nombre_Solicitante: string;
  Personas_Atendidas: string;
  Descripcion_Servicio: string;
  Des_Clase_Servicio: string;
  Min_Trabajados: string;
  Ubicacion: string;
  NoInterno: string;
  Fecha_Servicio: Date;
  Cod_Compania: string;
}
