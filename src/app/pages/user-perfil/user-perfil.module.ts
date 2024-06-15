import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatNativeDateModule } from '@angular/material/core';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UserPerfilRoutes } from './user-perfil.routing';

// theme pages
import { AppAccountSettingComponent } from './account-setting/account-setting.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserPerfilRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ],
  declarations: [
    AppAccountSettingComponent
  ],
  exports: [
  ]
})
export class UserPerfilModule {}
