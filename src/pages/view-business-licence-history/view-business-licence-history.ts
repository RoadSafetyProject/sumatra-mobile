import { Component } from '@angular/core';
import { NavParams,MenuController,ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {Program} from "../../providers/program";
import {SqlLite} from "../../providers/sql-lite";
import {EventProvider} from "../../providers/event-provider";

/*
  Generated class for the ViewBusinessLicenceHistory page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-view-business-licence-history',
  templateUrl: 'view-business-licence-history.html',
  providers : [User,Program,SqlLite,EventProvider]
})
export class ViewBusinessLicenceHistoryPage {

  public loginData : any ={};
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;

  public programId : string;
  public eventIds : any;

  public hasDataLoaded : boolean;
  public dataElementIdToNameMapping : any = {};
  public businessLicenceHistory : any;

  constructor(public menuCtrl: MenuController,public params : NavParams,
              public Program : Program,public SqlLite:SqlLite,public EventProvider : EventProvider,
              public user : User,public toastCtrl: ToastController) {


    this.menuCtrl.enable(true);
    this.hasDataLoaded = false;
    this.user.getCurrentUser().then(user=>{
      this.currentUser = user;
      this.eventIds = this.params.get('eventIds');
      this.programId = this.params.get("programId");
      this.loadMetadata();
    });
  }

  loadMetadata(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages("Loading Business licence metadata");
    this.Program.getProgramId(this.programId,this.currentUser).then((program : any)=>{
      program.programStages[0].programStageDataElements.forEach((programStageDataElement :any)=>{
        if(programStageDataElement.displayInReports){
          this.dataElementIdToNameMapping[programStageDataElement.dataElement.id] = programStageDataElement.dataElement.name
        }
      });
      this.loadVehicleInformation();
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load Business licence metadata");
    });
  }

  loadVehicleInformation(){
    this.setLoadingMessages("Loading Business Licence History");
    this.EventProvider.getEventByIds(this.eventIds,this.currentUser).then((events)=>{
      this.businessLicenceHistory = events;
      this.hasDataLoaded = true;
      this.loadingData = false;
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load Business licence History");
    });
  }

  ionViewDidLoad() {}

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
