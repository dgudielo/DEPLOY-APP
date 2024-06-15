import { Routes } from '@angular/router';

// theme pages
import { AppAccountSettingComponent } from './account-setting/account-setting.component';
// import { AppFaqComponent } from './faq/faq.component';
// import { AppPricingComponent } from './pricing/pricing.component';
// import { AppTreeviewComponent } from './treeview/treeview.component';

export const UserPerfilRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'account-setting',
        component: AppAccountSettingComponent,
        data: {
          title: 'Configuración Cuenta',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Configuración Cuenta' },
          ],
        },
      }
    ],
  },
];
