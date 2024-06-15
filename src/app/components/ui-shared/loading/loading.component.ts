/////////////////////////////////////////////////////
///https://www.npmjs.com/package/ngx-loading#demo///
////////////////////////////////////////////////////

import { Component, OnInit, TemplateRef } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from 'src/app/services/model-service/loading/loading-data.service';


const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#1976d2';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class AppLoadingComponent implements OnInit{

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  public primaryColour = PrimaryRed;
  public secondaryColour = SecondaryBlue;
  public loadingTemplate!: TemplateRef<any>;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: '3px',
    fullScreenBackdrop: true, // Add this line to make it full screen
  };
  constructor(public loadingService: LoadingService) { 

  }

  ngOnInit(): void {
    this.loadingService.loadingChanged.subscribe((loading: boolean) => {
      this.loading = loading;
    });
  }

  
}
