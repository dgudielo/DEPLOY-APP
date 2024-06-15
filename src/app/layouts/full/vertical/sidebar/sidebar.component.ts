import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavService } from '../../../../services/nav.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { AppNavItemComponent } from './nav-item/nav-item.component';
import { LoginService } from 'src/app/services/model-service/user-perfil/login.service';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    RouterModule,
    AppNavItemComponent, CommonModule
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  navopt = this.navService.showClass;
  imgRandom: number;

  constructor(public navService: NavService, public loginService: LoginService) {
    this.imgRandom = Math.floor(Math.random() * 4) + 1;
  }

  ngOnInit(): void {
    
   }
}
