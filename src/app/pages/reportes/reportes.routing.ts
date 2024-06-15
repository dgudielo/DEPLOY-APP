import { Routes } from '@angular/router';

// theme pages
import { AppRptEstadisticoComponent } from './estadistico/rpt-estadistico.component';
// import { AppFaqComponent } from './faq/faq.component';
// import { AppPricingComponent } from './pricing/pricing.component';
// import { AppTreeviewComponent } from './treeview/treeview.component';

export const ReportesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'rpt-estadistico',
        component: AppRptEstadisticoComponent,
        data: {
          title: 'Reporte Estadístico',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Reporte Estadísticos' },
          ],
        },
      }
    ],
  },
];
