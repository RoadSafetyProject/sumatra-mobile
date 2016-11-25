import { Component } from '@angular/core';
import { NavController,MenuController,ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {BusinessLicenceSearchPage} from "../business-licence-search/business-licence-search";
import {VehicleSearchPage} from "../vehicle-search/vehicle-search";

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers : [User]
})
export class HomePage {

  public loginData : any ={};
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;
  public homeLogo : string =  'assets/img/homeLogo.png';

  constructor(public navCtrl: NavController,public menuCtrl: MenuController,
              public user : User,public toastCtrl: ToastController) {

    this.menuCtrl.enable(true);
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
    });
  }

  goToComponent(componentName){
    if(componentName == "Vehicle"){
      this.navCtrl.setRoot(VehicleSearchPage);
    }else if(componentName == "BusinessLicence"){
      this.navCtrl.setRoot(BusinessLicenceSearchPage);
    }
  }

  ionViewDidLoad() {};

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
