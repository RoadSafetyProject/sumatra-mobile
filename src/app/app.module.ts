import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {LoginPage} from "../pages/login/login";
import { Storage } from '@ionic/storage';
import {HomePage} from "../pages/home/home";
import {AboutPage} from "../pages/about/about";
import {HttpClient} from "../providers/http-client";

@NgModule({
  declarations: [
    MyApp,LoginPage,
    AboutPage,HomePage,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,LoginPage,
    AboutPage,HomePage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},Storage,HttpClient]
})
export class AppModule {}
