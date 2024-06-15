import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../model-service/user-perfil/login.service';


@Injectable({ providedIn: 'root' })
class AuthGuard {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //const currentUser = JSON.parse(localStorage.getItem('userInfo'));
        //route.data.data.roles Roles permitidos
        //currentUser.roles roles usuario

        //var result = currentUser.roles.filter(e => route.data.data.roles.indexOf(e) !== -1).length === route.data.data.roles.length
        //var result = route.data.data.roles.filter(e => currentUser.roles.indexOf(e) !== -1).length === currentUser.roles.length

        if (this.loginService.currentUserValue) {

          /*console.log(result);
          console.log("Roles Permitido");
          console.log(route.data.data.roles);

          console.log("Roles Usuario");
          console.log(this.loginService.currentUserValue.roles);*/

          var result = false;
          /*Verificamos si dentro de los roles del usuario existen el rol permitido*/
          this.loginService.currentUserValue.roles.forEach(element => {
              if (route.data['Permisos'].roles.includes(element)) {
                  result = true;
                  return;
              }
          });
          // check if route is restricted by role
          if (route.data['Permisos'].roles && result) {
              // authorised so return true
              return true;
          }
          // role not authorised so redirect to home page
          this.router.navigate(['/authentication/error']);
          return false;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/authentication/side-login'], { queryParams: { returnUrl: state.url } });
      return false;
  }

}

export const isAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(AuthGuard).canActivate(route, state)
};


