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


@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  providers: [{ provide: DateAdapter, useClass: AppDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
})
export class AppAccountSettingComponent implements OnInit {
  fgPerfilUser!: FormGroup;

  constructor(private fb: FormBuilder, public loginService: LoginService, private ToastrService: ToastrService, public perfilService: PerfilService, public loadingService: LoadingService) {
    this.fgPerfilUser = this.fb.group({
      Login: [loginService.currentUserValue.usuario, [Validators.required]],
      Nombre: [null, [Validators.required]],
      Apellido: ['', [Validators.required]],
      CUI: ['', Validators.compose([Validators.required, Validators.minLength(13), Validators.maxLength(13)])],
      Correo: ['', [Validators.required]],
      Genero: ['M', [Validators.required]],
      Telefono: [''],
      Celular: ['', [Validators.required]],
      Direccion: ['', [Validators.required]],
      Fecha_Nac: ['', [Validators.required]],
      url_Imagen: [loginService.currentUserValue.url_imagen],
      Compania: [loginService.currentUserValue.cod_compania, [Validators.required]],
      Contrasenia: [''],
      NuevaContrasenia: [''],
      ConfirmarContrasenia: [''],
    });

    //Busqueda del perfil
    this.BuscaPerfilUsuario();
  }

  ngOnInit() {
    //console.log(this.fgPerfilUser.get('Compania').value)
    //console.log(this.fgPerfilUser.controls.Apellido.value);
  }


  BuscaPerfilUsuario() {
    this.loadingService.loadingChanged.emit(true);
    this.perfilService.GetUser(this.fgPerfilUser.value)
      .pipe(first())
      .subscribe(
        data => {
          //this.loading = false;
          //Set de forma manual
          this.loadingService.loadingChanged.emit(false);
          this.fgPerfilUser.setValue({
            Login: data.Login,
            Nombre: data.Nombre,
            Apellido: data.Apellido,
            CUI: '',
            Correo: data.Correo,
            Genero: data.Genero,
            Telefono: data.Telefono,
            Celular: data.Celular,
            Direccion: data.Direccion,
            Fecha_Nac: data.Fecha_Nac,
            url_Imagen: data.url_Imagen,
            Compania: data.Compania,
            Contrasenia: '',
            NuevaContrasenia: '',
            ConfirmarContrasenia: '',
          });
        },
        (error: HttpErrorResponse) => {
          this.loadingService.loadingChanged.emit(false);
          this.ToastrService.error(error.error.msgRespuesta == undefined ? "Ocurrió un error por favor vuelta a iniciar sesión para intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
            progressBar: true
          });

        });


  }

  get f() {
    return this.fgPerfilUser.controls;
  }

  submit() {


    //this.fgPerfilUser.updateValueAndValidity;
    //this.fgPerfilUser.asyncValidator;
    this.fgPerfilUser.markAllAsTouched()
    this.fgPerfilUser.validator;

    if (this.fgPerfilUser.invalid) {
      this.ToastrService.info("Complete los campos obligatorios", "Notificación", {
        progressBar: true
      });
      return;
    }

    if (this.fgPerfilUser.value.CUI.toString().length < 13 || this.fgPerfilUser.value.CUI.toString().length > 13) {
      this.ToastrService.info("El CUI debe tener 13 digitos", "Notificación", {
        progressBar: true
      });
      return;
    }

    this.loadingService.loadingChanged.emit(true);
    this.perfilService.SaveUser(this.fgPerfilUser.value)
      .pipe(first())
      .subscribe(
        data => {
          //this.router.navigate(['/starter']);
          this.loadingService.loadingChanged.emit(false);
          this.ToastrService.success(data.msgRespuesta, "Perfil de usuario", {
            progressBar: true
          });

        },
        (error: HttpErrorResponse) => {
          this.loadingService.loadingChanged.emit(false);
          this.ToastrService.error(error.error.msgRespuesta == "undefined" ? "Ocurrió un error por favor vuelta a iniciar sesión para intentarlo de nuevo." : error.error.msgRespuesta, "Error en operación", {
            progressBar: true
          });

        });

    //console.log(this.fgPerfilUser.value);
  }

  
  // stop here if form is invalid

  removeDuplicates(array: any[]): any[] {
    return Array.from(new Set(array));
  }

}
