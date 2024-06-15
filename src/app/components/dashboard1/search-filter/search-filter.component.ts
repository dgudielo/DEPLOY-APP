import { JsonPipe, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MaterialModule } from "src/app/material.module";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { APP_DATE_FORMATS, AppDateAdapter } from 'src/app/Helper/format-datepicker';
import { SearchFilterService } from 'src/app/services/model-service/dashboard/search-filter.service';
import { Subscription } from 'rxjs';
import { CompanySelectService } from 'src/app/services/model-service/dashboard/company-select.service';
import localeEs from '@angular/common/locales/es';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/model-service/user-perfil/login.service';
import { TablerIconsModule } from "angular-tabler-icons";
import { CommonModule } from "@angular/common";

interface datos{
  Fecha_Ini: string;
  Fecha_Fin: string;
}

registerLocaleData(localeEs, 'es');
@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [MatFormFieldModule, MaterialModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, JsonPipe, TablerIconsModule, CommonModule],
  providers: [{ provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss'
})
export class SearchFilterComponent {

  fechas: any[] = [];
  currentCompany: string[] = [];
  selectedCompany: string;


  constructor(
    public _date: SearchFilterService,
    public _company: CompanySelectService,
    public _alert: ToastrService,
    private dateAdapter: DateAdapter<Date>,
    public loginService: LoginService
  ){
    
  }

  ngOnInit(){

    this.currentCompany = this._company.company();
    this.selectedCompany = this.currentCompany[0];
    console.log(this.currentCompany);
    this.dateAdapter.setLocale("es-GT")
    this.setInitialDates();
    
  }

  public range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  })

  private limpiarFiltroSubscription: Subscription;

  setInitialDates(): void {
    // Establecer la fecha inicial como el 01/01/2024
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    this.range.controls['start'].setValue(startDate);

    // Establecer la fecha final como la fecha actual
    const endDate = new Date();
    this.range.controls['end'].setValue(endDate);
  }

  filtrarFecha(){

    const today = new Date();

    if(this.range.controls.start.valid && this.range.controls.end && this.range.value.start != null && this.range.value.end != null){
      if(this.range.value.start <= today && this.range.value.end <= today){
        const data: datos = {
          Fecha_Ini: this.range.value.start,
          Fecha_Fin: this.range.value.end
        }

        this._date.setSelectedDate(data)
      } else {
        this._alert.error("Fecha no puede ser mayor a la fecha actual")
      }
    }else{
      this._alert.warning("Debe Seleccionar un rango valido de fechas")
    }

  }

  limpiarFiltro(){
    this.range.controls.start.reset()
    this.range.controls.end.reset()

    const data: datos = {
      Fecha_Ini: '',
      Fecha_Fin: ''
    }

    this._date.setSelectedDate(data)
    this.setInitialDates();

  }

  onCompanyChange() {
    this._company.setSelectedItem(this.selectedCompany);
  }

}
