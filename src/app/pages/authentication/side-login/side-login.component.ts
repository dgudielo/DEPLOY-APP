import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/model-service/user-perfil/login.service';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-side-login',
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit{
  msgRes: string = "";
  checked = false;
  logout: string = "";
  msgLoading = "Iniciar sesión"; 
  viewSpinner = false;

  options = this.settings.getOptions();
  public form: FormGroup = Object.create(null);
  constructor(private fb: FormBuilder, private settings: CoreService, private router: Router, private route: ActivatedRoute, private loginService: LoginService) {
    
    this.route.queryParamMap.subscribe(queryParams => {
      this.logout = queryParams.get("Logout")!;
    })

    //console.log(this.logout);
    //console.log(this.loginService.GetRemember);
    if (this.logout == "true") {
      this.loginService.logout();
      this.router.navigate(['/authentication/side-login']);
      
    }
    else {
      // reset login status
      // redirect to home if already logged in
      //if (this.loginService.currentUserValue && this.loginService.GetRemember == true) {
      if (this.loginService.currentUserValue && this.loginService.GetRemember == true) {
        this.router.navigate(['/dashboards/dashboard1']);
      }
      else {
        this.loginService.logout();
        this.router.navigate(['/authentication/side-login']);
         
      }
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
      remember: [false, []]
    });
  }
  submit() {
     console.log(this.form.value);
     this.msgRes = "";
     this.viewSpinner = true;
     this.msgLoading = "Intentando...";
     this.loginService.loginUser(this.form.value.uname, this.form.value.password, this.form.value.remember)
       .pipe(first())
       .subscribe(
         data => {
           this.viewSpinner = false;
           this.msgLoading = "Iniciando sesión";
        this.router.navigate(['/dashboards/dashboard1']);
        
         },
         (error: HttpErrorResponse) => {
           this.viewSpinner = false;
           this.msgLoading = "Iniciar sesión";
           //console.log(error);
           this.msgRes = "Usuario y contraseña incorrectos";
         });
    //this.router.navigate(['/dashboards/dashboard1']);
  }
}
