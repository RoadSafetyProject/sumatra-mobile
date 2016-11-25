import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import {LoginPage} from "../pages/login/login";
import {HomePage} from "../pages/home/home";
import {AboutPage} from "../pages/about/about";
import {User} from "../providers/user";


@Component({
  templateUrl: 'app.html',
  providers: [User]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any,icon : string}>;

  constructor(public platform: Platform,public user:User) {
    this.initializeApp();
    this.pages = [
      {title : "Home",component : HomePage ,icon :"home"},
      { title: 'About', component: AboutPage ,icon :"help"}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logOut(){
    this.user.getCurrentUser().then((user :any)=>{
      user = JSON.parse(user);
      user.isLogin = false;
      this.user.setCurrentUser(user).then(user=>{
        this.nav.setRoot(LoginPage);
      })
    })
  }
}
