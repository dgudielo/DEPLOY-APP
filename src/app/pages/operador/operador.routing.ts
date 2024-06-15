import { Routes } from '@angular/router';

// Forms
import {
  AppAutocompleteComponent,
  AppButtonComponent,
  AppCheckboxComponent,
  AppDatepickerComponent,
  AppRadioComponent,
} from './form-elements';
import { AppServicioComponent } from './servicio/servicio.component';

export const OperadorRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'servicio',
        component: AppServicioComponent,
        data: {
          title: 'Servicio',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Servicio' },
          ],
        },
      },
    ]
  }
];
