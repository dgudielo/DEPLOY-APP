import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, SimpleChanges, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MaterialModule } from 'src/app/material.module';

import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormArray, FormControl, MaxLengthValidator } from '@angular/forms';


import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { InmuebleComponent } from "../inmueble/inmueble.component";
import { PersonalDestacadoComponent } from "../personaldestacado/personaldestacado.component";
import { VehiculoComponent } from '../vehiculo/vehiculo.component';
import { PersonasComponent } from "../personasatendidas/personasatendidas.component";
import { UnidadesComponent } from "../unidades/unidades.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { APP_DATE_FORMATS, AppDateAdapter } from 'src/app/Helper/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LoginService } from 'src/app/services/model-service/user-perfil/login.service';
import { RescateService } from 'src/app/services/model-service/servicios/rescate.service';
import { MunicipioService } from 'src/app/services/model-service/servicios/municipio.service';
import { DatosMunicipioService } from 'src/app/services/model-service/servicios/datosmunicipio.service';
import { CatalogoService } from 'src/app/services/model-service/servicios/catalogo.service';
import { LoadingService } from 'src/app/services/model-service/loading/loading-data.service';

@Component({
  selector: 'app-form',
  standalone: true,

  imports: [MaterialModule,
    TablerIconsModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MaterialModule,
    TablerIconsModule,
    InmuebleComponent,
    VehiculoComponent,
    PersonasComponent,
    UnidadesComponent,
    PersonalDestacadoComponent,
    NgxMatTimepickerModule,
    MatFormFieldModule,
    MatProgressSpinnerModule],


  templateUrl: './form.component.html',
  providers: [{ provide: DateAdapter, useClass: AppDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]

})



export class AppFormComponent implements OnInit {
  @ViewChild(PersonasComponent) childFormComponentPersonas!: PersonasComponent;
  @ViewChild(UnidadesComponent) childFormComponentUnidades!: UnidadesComponent;
  @ViewChild(InmuebleComponent) childFormComponentInmueble!: InmuebleComponent;
  @ViewChild(VehiculoComponent) childFormComponentVehiculo!: VehiculoComponent;
  @ViewChild(PersonalDestacadoComponent) childFormComponentPersonalDestacado!: PersonalDestacadoComponent;
  showForm: boolean = true
  fgItem!: FormGroup;
  formData: any;
  municipios: any[];
  datosmunicipios: any[];
  catTraslado: any[];
  personaAtendidaArr: any[];
  catCausas: any[];
  catVehiculo: any[];
  catUnidad: any[];
  pilotosOutPut: any[];
  personalOutPut: any[];



  //@Output() catCausas = new EventEmitter<any>();
  // @Output() catVehiculo = new EventEmitter<any>();


  pilotos: any[];
  personal: any[];
  personalRadioTel: any[];
  firmasCertificacion: any[];
  vobo: any[];
  tipoAviso: any[];
  departamento: any[];
  claseServicio: any[];
  tipoServicio: any[];
  selectedCompany: number
  selectedCompanies: any[];
  NoControlGrabado: string
  userInfo: any;
  fgFormOperador!: FormGroup;
  datosHijo: any;

  constructor(private fb: FormBuilder, public loginService: LoginService, private ToastrService: ToastrService, public rescateService: RescateService, public municipioService: MunicipioService, public datosmunicipioService: DatosMunicipioService, public catalogoService: CatalogoService, public loadingService: LoadingService) {

    this.fgFormOperador = this.fb.group({
      NoControl: [''],
      Cod_Compania: [''],
      Cod_Servicio: [''],
      Min_Trabajados: [''],
      Fecha_Servicio: [''],
      NoInterno: [''],
      Nombre_Solicitante: [''],
      Cod_TipoAviso: [''],
      Cod_Compania_Salida: [''],
      Fecha_Salida: [''],
      Cod_Compania_Entrada: [''],
      Fecha_Entrada: [''],
      Carnet_RadioTelefonista: [''],
      Observaciones: [''],
      Razon: [''],
      Carnet_FormuladoPor: [''],
      Carnet_ConformePiloto: [''],
      Carnet_VoBo: [''],
      Fecha_Firma: [''],
      Usuario_Registra: [''],
      Estado: [''],
      Fecha_Registra: [''],
      Fecha_Imprime: [''],
      Cod_Muni: [''],
      Cod_Depto: [''],
      Cod_Lugar: [''],
      Area: [''],
      Zona: [''],
      Direccion: [''],
      Persona_Atendida: [[]],
      Unidad_Asiste: [[]],
      Persona_Destacada: [[]],
      Ince_Inmueble: [[]],
      Ince_Vehiculo: [[]],
      Hora_Salida: [[]],
      Hora_Entrada: [[]],
      Hora_Salida_String: [""],
      Hora_Entrada_String: [""],
      Cod_Clase_Servicio: [''],
      NoTelefono: [''],
    });

    this.fgFormOperador.controls["Cod_Compania"].valueChanges.subscribe(data => {
      this.fgFormOperador.patchValue({
        Cod_Compania_Salida: data
      });

      this.fgFormOperador?.get('Cod_Compania_Salida')?.disable();

      this.fgFormOperador.patchValue({
        Cod_Compania_Entrada: data
      });

      this.fgFormOperador?.get('Cod_Compania_Entrada')?.disable();
    });

    this.fgFormOperador.controls["Hora_Entrada_String"].valueChanges.subscribe(data => {
      this.convertirHoraEntrada(data);
    });

    this.fgFormOperador.controls["Hora_Salida_String"].valueChanges.subscribe(data => {
      this.convertirHoraSalida(data);
    });

    this.fgFormOperador?.get('Cod_Muni')?.valueChanges.subscribe((value) => {
      this.fgFormOperador?.get('Area')?.setValue(null);
      this.fgFormOperador?.get('Cod_Lugar')?.setValue(null);
      this.fgFormOperador?.get('Zona')?.setValue(null);
    });

    this.fgFormOperador?.get('Area')?.valueChanges.subscribe((value) => {
      if (value === '') {
        this.fgFormOperador?.get('Zona')?.disable(); // Deshabilitar el campo 'zona'
        this.fgFormOperador?.get('Cod_Lugar')?.disable(); // Deshabilitar el campo 'zona'
      } else {
        this.fgFormOperador?.get('Zona')?.setValue(null); // Limpiar el valor del campo 'zona'
        this.fgFormOperador?.get('Cod_Lugar')?.setValue(null); // Limpiar el valor del campo 'zona'
      }
    });

    this.fgFormOperador?.get('Cod_TipoAviso')?.valueChanges.subscribe((value) => {
      if (value == 1 && value != "") {
        this.fgFormOperador?.get('NoTelefono')?.enable();
      } else {
        this.fgFormOperador?.get('NoTelefono')?.disable();
      }
    });


    this.fgFormOperador?.get('Cod_Depto')?.valueChanges.subscribe((value) => {
      if (value === '') { }
      else {
        this.loadingService.loadingChanged.emit(true);
        this.fgFormOperador?.get('Cod_Muni')?.setValue(null);
        this.fgFormOperador?.get('Area')?.setValue(null);
        this.fgFormOperador?.get('Cod_Lugar')?.setValue(null);
        this.fgFormOperador?.get('Zona')?.setValue(null);
       
        this.municipioService.GetMunicipio(value)
          .pipe(first())
          .subscribe(
            data => {
              this.loadingService.loadingChanged.emit(false);
              this.municipios = data.map((municipio: { Cod_Muni: any; Nombre_Muni: any; }) => ({
                codigo: municipio.Cod_Muni,
                nombre: municipio.Nombre_Muni
              }));
            },
            (error: HttpErrorResponse) => {
              this.loadingService.loadingChanged.emit(false);
              this.ToastrService.error(error.error.msgRespuesta == undefined ? "Ocurrió un error por favor vuelta a iniciar sesión para intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
                progressBar: true
              });
            });
      }
    });

    this.fgFormOperador?.get('Area')?.valueChanges.subscribe((value) => {
      if (value === '') { }
      else {
        this.datosmunicipioService.GetDatosMunicipio(this.fgFormOperador?.get('Cod_Muni')?.value, value)
          .pipe(first())
          .subscribe(
            data => {
              this.datosmunicipios = data.map((municipio: { Cod_Lugar: any; Lugar: any; }) => ({
                codigo: municipio.Cod_Lugar,
                nombre: municipio.Lugar
              }));
            },
            (error: HttpErrorResponse) => {
              console.log(error.error.msgRespuesta);
              this.ToastrService.error(error.error.msgRespuesta == undefined ? "Ocurrió un error por favor vuelta a iniciar sesión para intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
                progressBar: true
              });

            });
      }
    });


    this.fgFormOperador?.get('Cod_Compania')?.valueChanges.subscribe((value) => {
      if (value === '') { }
      else {
        this.catalogoService.GetCatalogos(value)
          .pipe(first())
          .subscribe(
            data => {
              this.catTraslado = data.CatTraslado.map((item: { Ubi_Traslado: any; Descripcion: any; }) => ({
                Ubi_Traslado: item.Ubi_Traslado,
                Descripcion: item.Descripcion
              }));

              this.catUnidad = data.CatUnidad.map((item: { Cod_Unidad: any; Cod_Compania: any; Descripcion_TipoUnidad: any; }) => ({
                Cod_Unidad: item.Cod_Unidad,
                Cod_Compania: item.Cod_Compania,
                Descripcion_TipoUnidad: item.Descripcion_TipoUnidad
              }));

              this.catCausas = data.Cat_Causas.map((item: { Cod_Causa: any; Descripcion: any; }) => ({
                Cod_Causa: item.Cod_Causa,
                Descripcion: item.Descripcion,

              }));

              this.catVehiculo = data.Cat_Vehiculo.map((item: { Cod_Vehiculo: any; Descripcion: any; }) => ({
                Cod_Vehiculo: item.Cod_Vehiculo,
                Descripcion: item.Descripcion,
              }));

              this.pilotos = data.Piloto.map((item: { Carnet: any; Nombre: any; cargo: any; }) => ({
                Carnet: item.Carnet,
                Nombre: item.Nombre,
                cargo: item.cargo
              }));

              this.pilotosOutPut = data.Piloto.map((item: { Carnet: any; Nombre: any; cargo: any; }) => ({
                Carnet: item.Carnet,
                Nombre: item.Nombre,
                cargo: item.cargo
              }));

              this.personalRadioTel = data.Personal_RadioTel.map((item: { Carnet: any; Nombre: any; cargo: any; }) => ({
                Carnet: item.Carnet,
                Nombre: item.Nombre,
                cargo: item.cargo
              }));

              this.personal = data.Personal.map((item: { Carnet: any; Nombre: any; cargo: any; }) => ({
                Carnet: item.Carnet,
                Nombre: item.Nombre,
                cargo: item.cargo
              }));

              this.personalOutPut = data.Personal.map((item: { Carnet: any; Nombre: any; cargo: any; }) => ({
                Carnet: item.Carnet,
                Nombre: item.Nombre,
                cargo: item.cargo
              }));

              this.firmasCertificacion = data.FirmasCertificacion.map((item: { Carnet: any; Nombre: any; cargo: any; }) => ({
                Carnet: item.Carnet,
                Nombre: item.Nombre,
                cargo: item.cargo
              }));

              this.vobo = data.vobo.map((item: { Carnet: any; Nombre: any; Apellido: any; cargo: any; }) => ({
                Carnet: item.Carnet,
                Nombre: item.Nombre,
                Apellido: item.Apellido,
                cargo: item.cargo
              }));

              this.tipoAviso = data.TipoAviso.map((item: { Cod_TipoAviso: any; Descripcion_Aviso: any; }) => ({
                Cod_TipoAviso: item.Cod_TipoAviso,
                Descripcion_Aviso: item.Descripcion_Aviso
              }));

              this.departamento = data.Departamento.map((item: { Cod_Depto: any; Nombre_Depto: any; }) => ({
                Cod_Depto: item.Cod_Depto,
                Nombre_Depto: item.Nombre_Depto
              }));

              this.claseServicio = data.ClaseServicio.map((item: { Cod_Clase_Servicio: any; Des_Clase_Servicio: any; }) => ({
                Cod_Clase_Servicio: item.Cod_Clase_Servicio,
                Des_Clase_Servicio: item.Des_Clase_Servicio
              }));

              this.tipoServicio = data.TipoServicio.map((item: { Cod_Servicio: any; Descripcion_Servicio: any; }) => ({
                Cod_Servicio: item.Cod_Servicio,
                Descripcion_Servicio: item.Descripcion_Servicio
              }));

            },
            (error: HttpErrorResponse) => {
              console.log(error.error.msgRespuesta);
              this.ToastrService.error(error.error.msgRespuesta == undefined ? "Ocurrió un error por favor vuelta a iniciar sesión para intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
                progressBar: true
              });

            });
      }
    });
  }





  ngOnInit(): void {

    const userDataLocalStorage = localStorage.getItem('userInfo');

    if (userDataLocalStorage != null) {
      this.userInfo = JSON.parse(userDataLocalStorage);
    } else {
      const userDataSessionStorage = sessionStorage.getItem('userInfo');

      if (userDataSessionStorage != null) {
        this.userInfo = JSON.parse(userDataSessionStorage);
      } else {
        this.userInfo = {};
      }
    }

    this.selectedCompany = this.userInfo.cod_compania[0];
    this.selectedCompanies = this.userInfo.cod_compania;

    this.fgFormOperador.patchValue({
      Cod_Compania: this.selectedCompany
    });
    this.setHorasPorDefecto();


  }






  // Método para manejar el evento formUpdated emitido desde PersonasComponent
  onFormUpdatedPersonasAtendidas(formData: any): void {

    this.fgFormOperador.patchValue({
      Persona_Atendida: formData.rows
    });



  }
  onFormUpdatedBomberos(formData: any): void {

    this.fgFormOperador.patchValue({
      Persona_Destacada: formData.rows
    });

  }
  onFormUpdatedUnidad(formData: any): void {

    this.fgFormOperador.patchValue({
      Unidad_Asiste: formData.rows
    });




  }
  // Método para manejar el evento formUpdated emitido desde PersonasComponent
  onFormUpdatedInmueble(formData: any): void {

    this.fgFormOperador.patchValue({
      Ince_Inmueble: formData.rows
    });




  }
  onFormUpdatedVehiculo(formData: any): void {

    this.fgFormOperador.patchValue({
      Ince_Vehiculo: formData.rows
    });




  }
  convertirHoraEntrada(tiempo: string | null): void {

    if (tiempo !== null) {
      const partesTiempo: string[] = tiempo.split(":");
      const hours: number = parseInt(partesTiempo[0], 10);
      const minutes: number = parseInt(partesTiempo[1], 10);
      const seconds: number = 0;

      const horaEntrada = {

        hour: hours,
        minute: minutes,
        second: seconds
      };
      // Establecer valores para Hora_Salida y Hora_Entrada
      this.fgFormOperador.patchValue({
        Hora_Entrada: horaEntrada
      });

    }


  }
  convertirHoraSalida(tiempo: string | null): void {
    if (tiempo !== null) {
      const partesTiempo: string[] = tiempo.split(":");
      const hours: number = parseInt(partesTiempo[0], 10);
      const minutes: number = parseInt(partesTiempo[1], 10);
      const seconds: number = 0;

      const horaSalida = {

        hour: hours,
        minute: minutes,
        second: seconds
      };
      // Establecer valores para Hora_Salida y Hora_Entrada
      this.fgFormOperador.patchValue({
        Hora_Salida: horaSalida
      });
    }
  }
  setHorasPorDefecto(): void {

    const horaPorDefecto = {

      hour: 0,
      minute: 0,
      second: 0
    };


    // Establecer valores para Hora_Salida y Hora_Entrada
    this.fgFormOperador.patchValue({
      Hora_Salida: horaPorDefecto,
      Hora_Entrada: horaPorDefecto
    });
  }
  submit() {
    this.fgFormOperador.markAllAsTouched()
    this.childFormComponentPersonas.addForm.markAllAsTouched()
    this.childFormComponentUnidades.addForm.markAllAsTouched()
    this.childFormComponentPersonalDestacado.addForm.markAllAsTouched()
    if (this.fgFormOperador?.get('Cod_Servicio')?.value === 4) {
      this.childFormComponentInmueble.addForm.markAllAsTouched()
      this.childFormComponentVehiculo.addForm.markAllAsTouched()
    }
    this.fgFormOperador.validator;
    this.childFormComponentPersonas.addForm.validator;
    this.childFormComponentUnidades.addForm.validator;
    this.childFormComponentPersonalDestacado.addForm.validator;
    if (this.fgFormOperador?.get('Cod_Servicio')?.value === 4) {
      this.childFormComponentInmueble.addForm.validator;
      this.childFormComponentVehiculo.addForm.validator;
    }
    this.fgFormOperador?.get('Cod_Compania_Salida')?.enable();
    this.fgFormOperador?.get('Cod_Compania_Entrada')?.enable();

    if (this.fgFormOperador?.get('Cod_Servicio')?.value === 4) {
      if (this.fgFormOperador.invalid || this.childFormComponentPersonas.addForm.invalid ||
        this.childFormComponentUnidades.addForm.invalid || this.childFormComponentInmueble.addForm.invalid ||
        this.childFormComponentVehiculo.addForm.invalid || this.childFormComponentPersonalDestacado.addForm.invalid) {
        this.fgFormOperador?.get('Cod_Compania_Salida')?.disable();
        this.fgFormOperador?.get('Cod_Compania_Entrada')?.disable();
        this.ToastrService.info("Complete los campos obligatorios", "Notificación", {
          progressBar: true
        });
        return;
      }
    } else {
      if (this.fgFormOperador.invalid || this.childFormComponentPersonas.addForm.invalid ||
        this.childFormComponentUnidades.addForm.invalid || this.childFormComponentPersonalDestacado.addForm.invalid) {
        this.fgFormOperador?.get('Cod_Compania_Salida')?.disable();
        this.fgFormOperador?.get('Cod_Compania_Entrada')?.disable();
        this.ToastrService.info("Complete los campos obligatorios", "Notificación", {
          progressBar: true
        });
        return;
      }
    }



    const dataToSave = { ...this.fgFormOperador.value };
    delete dataToSave.Cod_Depto;
    delete dataToSave.Hora_Entrada_String;
    delete dataToSave.Hora_Salida_String;






    this.rescateService.SaveRescate(dataToSave)
      .pipe(first())
      .subscribe(
        data => {
          //this.router.navigate(['/starter']);
          this.ToastrService.success(data.msgRespuesta, "No. de Servicio", {
            progressBar: true
          });

          this.showForm = false;

          this.fgFormOperador?.get('Cod_Depto')?.disable();
          this.fgFormOperador?.get('Hora_Entrada_String')?.disable();
          this.fgFormOperador?.get('Hora_Salida_String')?.disable();
          this.fgFormOperador.patchValue({
            NoControl: data.msgRespuesta
          });
          this.NoControlGrabado = data.msgRespuesta;



        },
        (error: HttpErrorResponse) => {
          this.ToastrService.error(error.error.msgRespuesta == "undefined" ? "Ocurrió un error por favor vuelta a iniciar sesión para intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
            progressBar: true
          });

        });

    //console.log(this.fgPerfilUser.value);
  }


  OnreiniciarSubFormulario(event: any): void {

    this.fgFormOperador.patchValue({
      Ince_Inmueble: [[]],
      Ince_Vehiculo: [[]]
    });

  }


  reiniciarFormulario() {
    this.fgFormOperador = this.fb.group({
      NoControl: [''],
      Cod_Compania: [''],
      Cod_Servicio: [''],
      Min_Trabajados: [''],
      Fecha_Servicio: [''],
      NoInterno: [''],
      Nombre_Solicitante: [''],
      Cod_TipoAviso: [''],
      Cod_Compania_Salida: [''],
      Fecha_Salida: [''],
      Cod_Compania_Entrada: [''],
      Fecha_Entrada: [''],
      Carnet_RadioTelefonista: [''],
      Observaciones: [''],
      Razon: [''],
      Carnet_FormuladoPor: [''],
      Carnet_ConformePiloto: [''],
      Carnet_VoBo: [''],
      Fecha_Firma: [''],
      Usuario_Registra: [''],
      Estado: [''],
      Fecha_Registra: [''],
      Fecha_Imprime: [''],
      Cod_Muni: [''],
      Cod_Depto: [''],
      Cod_Lugar: [''],
      Area: [''],
      Zona: [''],
      Direccion: [''],
      Persona_Atendida: [[]],
      Unidad_Asiste: [[]],
      Persona_Destacada: [[]],
      Ince_Inmueble: [[]],
      Ince_Vehiculo: [[]],
      Hora_Salida: [[]],
      Hora_Entrada: [[]],
      Hora_Salida_String: [""],
      Hora_Entrada_String: [""],
      Cod_Clase_Servicio: [''],
      NoTelefono: [''],
    });
    this.showForm = true;

  }

  GuardarPDF() {


    this.rescateService.SavePDF(this.fgFormOperador.value)
      .pipe(first())
      .subscribe(
        data => {
          //this.router.navigate(['/starter']);
          this.ToastrService.success(data.msgRespuesta, "No. de Servicio", {
            progressBar: true
          });

          this.base64ToPdf(data.msgRespuesta, this.fgFormOperador?.get('Cod_Compania')?.value + "_" + this.fgFormOperador?.get('NoControl')?.value)


        },
        (error: HttpErrorResponse) => {
          this.ToastrService.error(error.error.msgRespuesta == "undefined" ? "Ocurrió un error por favor vuelta a iniciar sesión para intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
            progressBar: true
          });

        });

    //console.log(this.fgPerfilUser.value);
  }


  base64ToPdf(base64String: string, fileName: string): void {
    // Decodificar la cadena Base64 a un array de bytes
    const byteCharacters: string = atob(base64String);
    const byteNumbers: number[] = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray: Uint8Array = new Uint8Array(byteNumbers);

    // Crear un blob con los datos decodificados y tipo MIME de PDF
    const blob: Blob = new Blob([byteArray], { type: 'application/pdf' });

    // Crear una URL del blob para el enlace de descarga
    const url: string = URL.createObjectURL(blob);

    // Crear un enlace oculto y hacer clic en él para iniciar la descarga
    const a: HTMLAnchorElement = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName + '.pdf';
    document.body.appendChild(a);

    // Abrir el explorador de archivos para seleccionar la ubicación de descarga
    a.click();

    // Liberar la URL del objeto
    window.URL.revokeObjectURL(url);
  }

}




