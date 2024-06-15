import { Component, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexGrid,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { combineLatest, map } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { CompanySelectService } from 'src/app/services/model-service/dashboard/company-select.service';
import { PersonasAtendidasService } from 'src/app/services/model-service/dashboard/personas-atendidas.service';
import { SearchFilterService } from 'src/app/services/model-service/dashboard/search-filter.service';
import {NgForOf, NgStyle} from "@angular/common";

export interface newsletterchartOptions {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  stroke: any | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
  fill: ApexFill | any;
}

interface postPersonasAtendida{
  Cod_Compania: string;
  Fecha_Ini: string;
  Fecha_Fin: string;
}


@Component({
  selector: 'app-newsletter-campaign',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule, NgForOf, NgStyle],
  templateUrl: './newsletter-campaign.component.html',
})
export class AppNewsletterCampaignComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  Anio: string = '';

  public newsletterchartOptions!: Partial<newsletterchartOptions> | any;

  constructor(
    public datos: PersonasAtendidasService,
    public _company: CompanySelectService,
    public _date: SearchFilterService,

  ) {
    this.newsletterchartOptions = {
      series: [],
      chart: {
        height: 365,
        fontFamily: 'Poppins,sans-serif',
        type: 'area',
        foreColor: '#8e8e8e',
      },

      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 4,
        border: 1,
      },
      legend: {
        enable: true,
      },
      Total: [
        {
          data: []
        }
        ],
      labels: ["Rescate","Varios","Ambulancia","Incendio","Oficial"],
      colors: ['#e5db1e', '#4dda26', '#264ada', '#ff4400', '#da2c26'],
      xaxis: {
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      },
      grid: {
        show: true,
        borderColor: 'rgba(0, 0, 0, .2)',
        color: 'rgba(0, 0, 0, .2)',
        strokeDashArray: 2,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        opacity: ['0.1', '0.1'],
      },
      tooltip: {
        theme: 'dark',
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    };
  }
  ngOnInit(){

    let isFirstValueSent = false;

    combineLatest([
      this._company.selectedItem$,
      this._date.selectedDate$
    ]).pipe(
      map(([selectedItem, datosPost]) => {
        return { selectedItem, datosPost };
      })
    ).subscribe((result) => {

      const today = new Date();
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

      const createIndicesPost = (codCompania: string, fechaIni?: string, fechaFin?: string) => {
        return {
          Cod_Compania: codCompania,
          Fecha_Ini: fechaIni || firstDayOfYear.toDateString(),
          Fecha_Fin: fechaFin || today.toDateString(),
        };
      };

      if (!isFirstValueSent) {
        isFirstValueSent = true;
        this.postDATOS(createIndicesPost(this._company.currentCompany[0]));
      } else {
        const useEmptyDates = result.datosPost.Fecha_Ini === '' && result.datosPost.Fecha_Fin === '';
        this.postDATOS(createIndicesPost(
          result.selectedItem || this._company.currentCompany[0],
          useEmptyDates ? firstDayOfYear.toDateString() : result.datosPost.Fecha_Ini,
          useEmptyDates ? today.toDateString() : result.datosPost.Fecha_Fin
        ));
      }

      if(isNaN(new Date(result.datosPost.Fecha_Fin).getFullYear()) ){
        this.Anio = new Date().getFullYear().toString()
      } else {
        this.Anio = new Date(result.datosPost.Fecha_Fin).getFullYear().toString()
      }

   });

  }
  postDATOS(personaAtendida: postPersonasAtendida){
    this.datos.postPersonasAtendidas(personaAtendida).subscribe(data => {
    this.newsletterchartOptions.Total.data = data[5];
      this.newsletterchartOptions.series = [
        {
          name: 'Busqueda y Rescate',
          data: data[0],
        },
        {
          name: 'Servicios Varios',
          data: data[1],
        },
        {
          name: 'Servicios Ambulancia',
          data: data[2],
        },
        {
          name: 'Servicios Incendio',
          data: data[3],
        },
        {
          name: 'Comision Oficial',
          data: data[4],
        },
      ];
    });
  }
}
