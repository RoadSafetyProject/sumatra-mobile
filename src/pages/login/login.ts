import { Component } from '@angular/core';
import { NavController ,MenuController,ToastController} from 'ionic-angular';
import {SqlLite} from "../../providers/sql-lite";
import {User} from "../../providers/user";
import {HttpClient} from "../../providers/http-client";
import {AppProvider} from "../../providers/app-provider";

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers : [AppProvider,HttpClient,User,SqlLite]
})
export class LoginPage {

  public loginData : any ={};
  public loadingData : boolean = false;
  public loadingMessages : any = [];

  constructor(public navCtrl: NavController,public menuCtrl: MenuController,
              public httpClient : HttpClient,public user : User,
              public toastCtrl: ToastController,
              public SqlLite: SqlLite,public app : AppProvider) {

    this.loginData.logoUrl = 'assets/img/loginLogo.png';
    this.menuCtrl.enable(false);
  }

  ionViewDidLoad() {
    //console.log('Hello LoginPage Page');
  }

  login(){

  }

}
