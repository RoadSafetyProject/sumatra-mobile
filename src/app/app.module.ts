import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {LoginPage} from "../pages/login/login";
import { Storage } from '@ionic/storage';
import {HomePage} from "../pages/home/home";
import {AboutPage} from "../pages/about/about";
import {HttpClient} from "../providers/http-client";
import {VehicleSearchPage} from "../pages/vehicle-search/vehicle-search";
import {BusinessLicenceSearchPage} from "../pages/business-licence-search/business-licence-search";
import {ViewBusinessLicenceHistoryPage} from "../pages/view-business-licence-history/view-business-licence-history";
import {ViewVehiclePage} from "../pages/view-vehicle/view-vehicle";

@NgModule({
  declarations: [
    MyApp,LoginPage,
    AboutPage,HomePage,
    BusinessLicenceSearchPage,VehicleSearchPage,
    ViewBusinessLicenceHistoryPage,ViewVehiclePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,LoginPage,
    AboutPage,HomePage,
    BusinessLicenceSearchPage,VehicleSearchPage,
    ViewBusinessLicenceHistoryPage,ViewVehiclePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},Storage,HttpClient]
})
export class AppModule {}
