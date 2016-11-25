import { Component } from '@angular/core';
import { NavController,MenuController,ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {Program} from "../../providers/program";
import {SqlLite} from "../../providers/sql-lite";

/*
  Generated class for the BusinessLicenceSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-business-licence-search',
  templateUrl: 'business-licence-search.html',
  providers : [User,Program,SqlLite]
})
export class BusinessLicenceSearchPage {

  public loginData : any ={};
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;

  //business program
  public businessLicenceProgram : any;
  public businessLicenceProgramName : string;
  public businessLicenceNumber : string;
  public searchCriteria : string = "Business License Number";

  //vehicle program
  public vehicleProgram : any;
  public vehicleProgramName : string;

  constructor(public navCtrl: NavController,public menuCtrl: MenuController,
              public Program : Program,public SqlLite:SqlLite,
              public user : User,public toastCtrl: ToastController) {

    this.menuCtrl.enable(true);
    this.vehicleProgramName = "Vehicle";
    this.businessLicenceProgram = "Business License History";
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.loadVehicleMetadata();
    });
  }

  loadVehicleMetadata(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading vehicle metadata");
    this.Program.getProgramByName(this.vehicleProgramName,this.currentUser).then((program:any)=>{
      this.vehicleProgram = program;
      this.loadBusinessLicenceMetadata();
    },error=> {
      this.loadingData = false;
      this.setToasterMessage("Fail to load vehicle metadata");
    });
  }

  loadBusinessLicenceMetadata(){
    this.setLoadingMessages("Loading business licence metadata");
    this.Program.getProgramByName(this.businessLicenceProgramName,this.currentUser).then((program:any)=>{
      this.businessLicenceProgram = program;
      this.loadingData = false;
    },error=>{
      this.loadingData=false;
      this.setToasterMessage("Fail to load business licence metadata");
    });
  }

  search(){
    this.setToasterMessage('ready to search');
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
