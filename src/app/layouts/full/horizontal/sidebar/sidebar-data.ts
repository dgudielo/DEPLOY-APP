import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';
import { Injectable } from '@angular/core';
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
          navCap: 'Home.',
        },
          {
            displayName: 'Tableros',
            iconName: 'home',
            route: 'dashboards',
            children: [
              {
                displayName: 'Analytical',
                iconName: 'point',
                route: '/dashboards/dashboard1',
              },
              {
                displayName: 'Classic',
                iconName: 'point',
                route: '/dashboards/dashboard2',
              },
              {
                displayName: 'Demographical',
                iconName: 'point',
                route: '/dashboards/dashboard3',
              },
              {
                displayName: 'Minimal',
                iconName: 'point',
                route: '/dashboards/dashboard4',
              },
              {
                displayName: 'eCommerce',
                iconName: 'point',
                route: '/dashboards/dashboard5',
              },
              {
                displayName: 'Modern',
                iconName: 'point',
                route: '/dashboards/dashboard6',
              },
            ],
          });
      }
      if (roles.includes(Role.Operador)) {
        navItems.push({
          displayName: 'Apps',
          iconName: 'apps',
          route: 'operador',
          ddType: '',
          children: [
            {
              displayName: 'Servicio',
              iconName: 'edit',
              route: '/operador/servicio',
            }
          ]
        });
      }
      if (roles.includes(Role.Administrador)) {
        // Lógica para los ítems de navegación para el rol de operador
        navItems.push({
          displayName: 'Admin.',
          iconName: 'components',
          route: 'dashboards',
          ddType: '',
          children: [
            {
              displayName: 'Usuarios',
              iconName: 'point',
              route: '/dashboards/',
            },
            {
              displayName: 'Personal',
              iconName: 'point',
              route: '/dashboards/',
            },
            {
              displayName: 'Unidades',
              iconName: 'point',
              route: '/dashboards/',
            }

          ]
        });
      }
      if (roles.includes(Role.Reportes)) {
        // Lógica para los ítems de navegación para el rol de servicios
        navItems.push({
          displayName: 'Pages',
          iconName: 'clipboard',
          route: 'reportes',
          children: [
            {
              displayName: 'Reportes',
              iconName: 'point',
              route: '/reportes/rpt-estadistico',
            }
          ]
        });
      }
    }
  }
}