import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatNativeDateModule } from '@angular/material/core';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { OperadorRoutes } from './operador.routing';

// form elements
import {
  AppAutocompleteComponent,
  AppButtonComponent,
  AppCheckboxComponent,
  AppDatepickerComponent,
  AppRadioComponent,
} from './form-elements';


@NgModule({
  declarations: [
    AppAutocompleteComponent,
    AppButtonComponent,
    AppCheckboxComponent,
    AppRadioComponent,
    AppDatepickerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(OperadorRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ],
})
export class OperadorModule {}
