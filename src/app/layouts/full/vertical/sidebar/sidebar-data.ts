import { Injectable } from '@angular/core';
import { NavItem } from './nav-item/nav-item';
import { LoginService } from 'src/app/services/model-service/user-perfil/login.service';
import { Role } from 'src/app/services/model-service/user-perfil/role';


export const navItems: NavItem[] = [];


@Injectable({
  providedIn: 'root'
})
export class SidebarData {


  constructor(private loginService: LoginService) {
    this.initNavItems();
  }

  private initNavItems(): void {
    const currentUser = this.loginService.currentUserValue;
    // Lógica para determinar los ítems de navegación basados en el rol del usuario
    //console.log(currentUser.roles);
    if (currentUser && currentUser.roles) {
      const roles = currentUser.roles;
      //Menu tablero
      if (roles.includes(Role.Tablero)) {
        navItems.push({
          navCap: 'Inicio',
        },
          {
            displayName: 'Dashboard1',
            iconName: 'chart-pie',
            route: '/dashboards/dashboard1',
          },
          {
            displayName: 'Dashboard2',
            iconName: 'coffee',
            route: '/dashboards/dashboard2',
          },
          {
            displayName: 'Dashboard3',
            iconName: 'cpu',
            route: '/dashboards/dashboard3',
          },
          {
            displayName: 'Dashboard4',
            iconName: 'flag',
            route: '/dashboards/dashboard4',
          },
          {
            displayName: 'Dashboard5',
            iconName: 'shopping-cart',
            route: '/dashboards/dashboard5',
          },
          {
            displayName: 'Dashboard6',
            iconName: 'aperture',
            route: '/dashboards/dashboard6',
          });
      }
      if (roles.includes(Role.Operador)) {
        navItems.push({
          navCap: 'OperSer.',
        },
          {
            displayName: 'Servicio',
            iconName: 'edit',
            route: '/operador/servicio',
          });
        // Agrega más ítems según sea necesario para el rol de administrador
      }
      if (roles.includes(Role.Administrador)) {
        // Lógica para los ítems de navegación para el rol de operador
        navItems.push({
          navCap: 'Admin.',
        },
          {
            displayName: 'Usuarios',
            iconName: 'user-plus',
            route: '/dashboards/',
          },
          {
            displayName: 'Personal',
            iconName: 'user-circle',
            route: '/dashboards/',
          },
          {
            displayName: 'Unidades',
            iconName: 'ambulance',
            route: '/dashboards/',
          });
      }
      if (roles.includes(Role.Reportes)) {
        // Lógica para los ítems de navegación para el rol de servicios
        navItems.push({
          navCap: 'Repo.',
        },
          {
            displayName: 'Reportes',
            iconName: 'chart-donut-3',
            route: '/reportes/rpt-estadistico',
          });
      }
    }
  }
}