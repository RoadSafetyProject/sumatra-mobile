import { Component } from '@angular/core';
import { NavController,MenuController,ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {Program} from "../../providers/program";
import {SqlLite} from "../../providers/sql-lite";
import {EventProvider} from "../../providers/event-provider";

/*
  Generated class for the VehicleSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-vehicle-search',
  templateUrl: 'vehicle-search.html',
  providers : [User,Program,SqlLite,EventProvider]
})
export class VehicleSearchPage {

  public loginData : any ={};
  public loadingData : boolean = false;
  public loadingMessages : any = [];
  public currentUser : any;

  //business program
  public businessLicenceProgram : any;
  public businessLicenceProgramName : string;

  public businessLicenceVehicleDataElementId : string;

  //vehicle program
  public vehicleProgram : any;
  public vehicleProgramName : string;
  public vehiclePlateNumber :string;
  public searchCriteria :string = "Vehicle Plate Number/Registration Number";
  public searchCriteriaDataElement :any;
  public dataElementIdToNameMapping : any = {};

  //search results :
  public vehicleData : any;
  public vehicleBusinessLicenceHistory : any;
  public hasVehicleData :boolean = false;
  public hasBusinessLicenceData :boolean = false;


  constructor(public navCtrl: NavController,public menuCtrl: MenuController,
              public Program : Program,public SqlLite:SqlLite,public EventProvider : EventProvider,
              public user : User,public toastCtrl: ToastController) {

    this.menuCtrl.enable(true);
    this.vehicleProgramName = "Vehicle";
    this.businessLicenceProgramName = "Business License History";
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
      program.programStages[0].programStageDataElements.forEach((programStageDataElement :any)=>{
        if(programStageDataElement.dataElement.name.toLowerCase() == this.searchCriteria.toLowerCase()){
          this.searchCriteriaDataElement = programStageDataElement.dataElement;
        }
        if(programStageDataElement.displayInReports){
          this.dataElementIdToNameMapping[programStageDataElement.dataElement.id] = programStageDataElement.dataElement.name
        }
      });
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
      let dataElementName  = "Program_Vehicle";
      program.programStages[0].programStageDataElements.forEach((programStageDataElement :any)=>{
        if(programStageDataElement.dataElement.name.toLowerCase() == dataElementName.toLowerCase()){
          this.businessLicenceVehicleDataElementId = programStageDataElement.dataElement.id;
        }
      });

      this.loadingData = false;
    },error=>{
      this.loadingData=false;
      this.setToasterMessage("Fail to load business licence metadata");
    });
  }

  viewBusinessLicence(){
    this.setToasterMessage('ready to view business licence history');
  }

  search(){
    if(this.vehiclePlateNumber){
      this.vehiclePlateNumber = this.vehiclePlateNumber.toUpperCase();
      if(this.vehiclePlateNumber.length == 7){
        this.vehiclePlateNumber =  this.vehiclePlateNumber.substr(0,4) + ' ' + this.vehiclePlateNumber.substr(4);
      }
      if(this.searchCriteriaDataElement.id){
        //todo reset results
        this.hasVehicleData = false;
        this.hasBusinessLicenceData = false;
        this.vehicleBusinessLicenceHistory = [];
        this.vehicleData ={};
        this.loadSearchingResult();
      }else{
        this.setToasterMessage('Fail to set relation data element ');
      }
    }else{
      this.setToasterMessage('Please enter Vehicle Plate Number');
    }
  }

  loadSearchingResult(){
    this.loadingMessages = [];
    this.loadingData = true;
    this.setLoadingMessages("Please wait,while search for a vehicle");
    this.EventProvider.findEventsByDataValue(this.searchCriteriaDataElement.id,this.vehiclePlateNumber,this.vehicleProgram.id,this.currentUser).then((events:any)=>{
      if(events.length > 0){
        this.hasVehicleData = true;
        this.vehicleData = events[0];
        this.setLoadingMessages("Loading business licence history");
        this.EventProvider.findEventsByDataValue(this.businessLicenceVehicleDataElementId,events[0].event,this.businessLicenceProgram.id,this.currentUser).then((events:any)=>{
          if(events.length > 0){
            this.vehicleBusinessLicenceHistory = events;
            this.hasBusinessLicenceData = true;
            this.loadingData = false;
          }else{
            this.loadingData = false;
            this.setToasterMessage("business licence history for this vehicle has been not found");
          }
        },error=>{
          this.loadingData = false;
          this.setToasterMessage("Fail to load business licence history");
        });
      }else{
        this.loadingData = false;
        this.setToasterMessage("vehicle has not been found");
      }
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to search vehicle");
    });
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
