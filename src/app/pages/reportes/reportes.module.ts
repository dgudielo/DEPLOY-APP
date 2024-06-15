import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatNativeDateModule } from '@angular/material/core';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { ReportesRoutes } from './reportes.routing';

// theme pages
import { AppRptEstadisticoComponent } from './estadistico/rpt-estadistico.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportesRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ],
  declarations: [
    AppRptEstadisticoComponent
  ],
  exports: [
  ]
})
export class ReportesModule {}
