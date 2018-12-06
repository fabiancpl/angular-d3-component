import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { TestServiceService } from './services/test-service/test-service.service';

import { CaobaMultipleAreaChartComponent } from './components/caoba-multiple-area-chart/caoba-multiple-area-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CaobaMultipleAreaChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    TestServiceService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
