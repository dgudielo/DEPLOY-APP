import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { Role } from './services/model-service/user-perfil/role';
import { isAuthGuard } from './services/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: '/dashboards/dashboard1',
      //   pathMatch: 'full',
      // },
      //Se agrega para que la pagina inicial sea side-login
      {
        path: '',
        redirectTo: '/authentication/side-login',
        pathMatch: 'full',
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./pages/forms/forms.module').then((m) => m.FormModule),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./pages/charts/charts.module').then((m) => m.ChartsModule),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./pages/apps/apps.module').then((m) => m.AppsModule),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./pages/widgets/widgets.module').then((m) => m.WidgetsModule),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./pages/tables/tables.module').then((m) => m.TablesModule),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'datatable',
        loadChildren: () =>
          import('./pages/datatable/datatable.module').then((m) => m.DatatableModule),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'theme-pages',
        loadChildren: () =>
          import('./pages/theme-pages/theme-pages.module').then(
            (m) => m.ThemePagesModule
          ),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'user-perfil',
        loadChildren: () =>
          import('./pages/user-perfil/user-perfil.module').then(
            (m) => m.UserPerfilModule
          ),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'operador',
        loadChildren: () =>
          import('./pages/operador/operador.module').then(
            (m) => m.OperadorModule
          ),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('./pages/reportes/reportes.module').then(
            (m) => m.ReportesModule
          ),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
      {
        path: 'landingpage',
        loadChildren: () =>
          import('./pages/theme-pages/landingpage/landingpage.module').then(
            (m) => m.LandingPageModule
          ),
        canActivate: [isAuthGuard],
        data: { Permisos: { roles: [Role.Servicios] } }
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
