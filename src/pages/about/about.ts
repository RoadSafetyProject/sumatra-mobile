import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import {SqlLite} from "../../providers/sql-lite";
import {AppProvider} from "../../providers/app-provider";
import {User} from "../../providers/user";

/*
  Generated class for the About page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers : [User,AppProvider,SqlLite]
})
export class AboutPage {

  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public systemInformation : any;
  public appInformation : any;

  constructor(public toastCtrl: ToastController,public user : User,
              public appProvider : AppProvider,
              public sqlLite : SqlLite) {

    this.loadingSystemInformation();
  }

  ionViewDidLoad() {}

  loadingSystemInformation(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading system information');
    this.user.getCurrentUserSystemInformation().then(systemInformation=>{
      this.systemInformation = this.getArrayFromObject(systemInformation);
      this.loadAppInformation();
    });
  }

  loadAppInformation(){
    this.setLoadingMessages('Loading app information');
    this.appProvider.getAppInformation().then(appInformation=>{
      this.appInformation = this.getArrayFromObject(appInformation);
      this.loadingData = false;
    })
  }

  getArrayFromObject(object){
    let array = [];
    for(let key in object){
      let newValue = object[key];
      if(newValue instanceof Object) {
        newValue = JSON.stringify(newValue)
      }
      let newKey = (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
      array.push({key : newKey,value : newValue})
    }
    return array;
  }

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

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }


}
