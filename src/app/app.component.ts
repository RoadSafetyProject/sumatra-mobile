import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import {LoginPage} from "../pages/login/login";
import {HomePage} from "../pages/home/home";
import {AboutPage} from "../pages/about/about";
import {User} from "../providers/user";
import {BusinessLicenceSearchPage} from "../pages/business-licence-search/business-licence-search";
import {VehicleSearchPage} from "../pages/vehicle-search/vehicle-search";


@Component({
  templateUrl: 'app.html',
  providers: [User]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any,icon : string}>;

  constructor(public platform: Platform,public user:User) {
    this.initializeApp();
    this.pages = [
      {title : "Home",component : HomePage ,icon :"home"},
      {title : "Vehicle",component : VehicleSearchPage ,icon :"bus"},
      {title : "Business Licence",component : BusinessLicenceSearchPage ,icon :"document"},
      { title: 'About', component: AboutPage ,icon :"help"}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.rootPage = LoginPage;
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logOut(){
    this.user.getCurrentUser().then((user :any)=>{
      user.isLogin = false;
      this.user.setCurrentUser(user).then(user=>{
        this.nav.setRoot(LoginPage);
      })
    })
  }
}
