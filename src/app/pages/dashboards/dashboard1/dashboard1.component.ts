import { Component } from '@angular/core';
import {
  AppActivityTimelineComponent,
  AppBandwidthUsageComponent,
  AppBlogCardComponent,
  AppDownloadCountComponent,
  AppMyContactsComponent,
  AppNewsletterCampaignComponent,
  AppProfileCardComponent,
  AppSalesOurVisitorsComponent,
  AppSalesOverviewComponent,
  AppWeatherCardComponent,
  AppTopCardsComponent,
  AppNewsletterCampaign2Component,
  PersonasAtendidasComponent,

} from 'src/app/components';
import { CompanySelectComponent } from 'src/app/components/dashboard1/company-select/company-select.component';
import { IndicesServicioComponent } from 'src/app/components/dashboard1/indice-servicios/indices-servicio.component';
import { PerDestacadoComponent } from 'src/app/components/dashboard1/per-destacado/per-destacado.component';
import { SearchFilterComponent } from 'src/app/components/dashboard1/search-filter/search-filter.component';

@Component({
  selector: 'app-dashboard1',
  standalone: true,
  imports: [
    AppTopCardsComponent,
    AppSalesOverviewComponent,
    AppSalesOurVisitorsComponent,
    AppBlogCardComponent,
    AppNewsletterCampaignComponent,
    AppBandwidthUsageComponent,
    AppDownloadCountComponent,
    AppWeatherCardComponent,
    AppProfileCardComponent,
    AppMyContactsComponent,
    AppActivityTimelineComponent,
    AppNewsletterCampaign2Component,
    CompanySelectComponent,
    IndicesServicioComponent,
    PersonasAtendidasComponent,
    PerDestacadoComponent,
    SearchFilterComponent,

  ],
  templateUrl: './dashboard1.component.html',
})
export class AppDashboard1Component {
  constructor() {}
}
