import { Component } from '@angular/core';
import { CommonModule} from "@angular/common";
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import {environment} from "../../../../environments/environment";

import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { PersonasAtendidasService } from 'src/app/services/model-service/dashboard/personas-atendidas.service';
import { CompanySelectService } from 'src/app/services/model-service/dashboard/company-select.service';
import { combineLatest, map } from 'rxjs';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { SearchFilterService } from 'src/app/services/model-service/dashboard/search-filter.service';
import { LoginService } from 'src/app/services/model-service/user-perfil/login.service';

interface ourvisitorChart {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
  tooltip: ApexTooltip | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  stroke: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
}

interface postPersonasAtendida{
  Cod_Compania: string;
  Fecha_Ini: string;
  Fecha_Fin: string;
}


@Component({
  selector: 'app-personal-atendido',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, CommonModule],
  templateUrl: './personas-atendidas.component.html',
})



export class PersonasAtendidasComponent {

  userInfo : any;
  companiaPrincipal: number;
  public ourvisitorChart!: Partial<ourvisitorChart> | any;
  inicio: string = '';
  fin: string = '';
  showEndDate: boolean = false;


  constructor(
    public _personasAtendidas: PersonasAtendidasService,
    public _company: CompanySelectService,
    public _date: SearchFilterService,
    public loginService: LoginService
  ) {
    this.userInfo = this.loginService.currentUserValue

    this.ourvisitorChart = {
      series: [0,0, 0, 0, 0],
      chart: {
        id: 'donut-chart',
        type: 'donut',
        height: 300,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        foreColor: '#adb0bb',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70px',
            background: 'transparent',
          },
        },
      },
      fill: {
        type: 'gradient',
        opacity: ['0.1', '0.1'],
      },
      tooltip: {
        fillSeriesColor: true,
      },
      dataLabels: {
        show: true,
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      legend: {
        enabled: true,
        position: 'bottom', // Adjust legend position (optional)
        itemStyle: {
          fontWeight: 'normal', // Adjust font weight (optional)
          fontSize: '20px', // Adjust font size (optional)
        },
      },
      labels: ["Rescate","Varios","Ambulancia","Incendio","otros"],
      colors: ['#1e88e5', '#26c6da', '#745af2', '#eceff1', '#f77e53'],
      responsive: [{ breakpoint: 480, options: { chart: { height: 230 } } }],
    };
  }

  ngOnInit() {

    let isFirstValueSent = false;
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    combineLatest([
      this._company.selectedItem$,
      this._date.selectedDate$
    ]).pipe(
      map(([selectedItem, datosPost]) => {
        return { selectedItem, datosPost };
      })
    ).subscribe((result) => {

      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      const createIndicesPost = (codCompania: string, fechaIni?: string, fechaFin?: string) => {
        return {
          Cod_Compania: codCompania,
          Fecha_Ini: fechaIni || firstDayOfMonth.toDateString(),
          Fecha_Fin: fechaFin || today.toDateString(),
        };
      };

      if (!isFirstValueSent) {
        isFirstValueSent = true;
        this.postpersonasAtendidas(createIndicesPost(this._company.currentCompany[0]));
      } else {
        const useEmptyDates = result.datosPost.Fecha_Ini === '' && result.datosPost.Fecha_Fin === '';
        this.postpersonasAtendidas(createIndicesPost(
          result.selectedItem || this._company.currentCompany[0],
          useEmptyDates ? firstDayOfMonth.toDateString() : result.datosPost.Fecha_Ini,
          useEmptyDates ? today.toDateString() : result.datosPost.Fecha_Fin
        ));
      }

      if(isNaN(new Date(result.datosPost.Fecha_Fin).getFullYear()) ){
        this.inicio = months[firstDayOfMonth.getMonth()]
        this.showEndDate = false;
      } else {
        this.inicio = months[new Date(result.datosPost.Fecha_Ini).getMonth()]
        this.fin = months[new Date(result.datosPost.Fecha_Fin).getMonth()]

        if (this.inicio == this.fin ){
          this.showEndDate = false;
        } else {
          this.showEndDate = true;
        }
      }
    });


  }

  numerosPersonalAtendido = [ ]

  personasAtendidas(company: string) {
    this._personasAtendidas.getPersonasAtendidas(company).subscribe(data => {
      this.ourvisitorChart.series = [
        this.numerosPersonalAtendido = data[6][0],//Rescate
        this.numerosPersonalAtendido = data[6][1],//Varios
        this.numerosPersonalAtendido = data[6][2],//Ambulancia
        this.numerosPersonalAtendido = data[6][3],//Incendio
        this.numerosPersonalAtendido = data[6][4]//otroes
      ];
      //console.log(data)
    })
  }

  postpersonasAtendidas(personaAtendida: postPersonasAtendida){
    this._personasAtendidas.postPersonasAtendidas(personaAtendida).subscribe(data => {
      this.ourvisitorChart.Total = data[7]
      this.ourvisitorChart.series = [
        this.numerosPersonalAtendido = data[6][0],//Rescate
        this.numerosPersonalAtendido = data[6][1],//Varios
        this.numerosPersonalAtendido = data[6][2],//Ambulancia
        this.numerosPersonalAtendido = data[6][3],//Incendio
        this.numerosPersonalAtendido = data[6][4]//otroes
      ];
      console.log(data[7])
    })
  }

/*
  async getPersonasAtendidas() {
    this.companiaPrincipal = this.userInfo.cod_compania[0];
    const api = environment.SERVER_URL + `estadisticaAnual?Cod_Compania=${this.companiaPrincipal}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.userInfo.token
    };

    const respuesta = await fetch(api, {
      method: 'GET',
      headers: headers
    });

    const numerosPersonalAtendido = await respuesta.json();


    this.ourvisitorChart.series = [
      numerosPersonalAtendido[6][0],//Rescate
      numerosPersonalAtendido[6][1],//Varios
      numerosPersonalAtendido[6][2],//Ambulancia
      numerosPersonalAtendido[6][3],//Incendio
      numerosPersonalAtendido[6][4]//otroes
    ];

    // console.log({
    //   "Rescate": numerosPersonalAtendido[6][0],
    //   "Varios": numerosPersonalAtendido[6][1],
    //   "Ambulancia": numerosPersonalAtendido[6][2],
    //   "Incendio": numerosPersonalAtendido[6][3],
    //   "otros": numerosPersonalAtendido[6][4],
    // })

  }
*/
}
