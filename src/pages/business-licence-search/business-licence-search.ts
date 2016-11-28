import { Component } from '@angular/core';
import { NavController,MenuController,ToastController } from 'ionic-angular';
import {User} from "../../providers/user";
import {Program} from "../../providers/program";
import {SqlLite} from "../../providers/sql-lite";
import {EventProvider} from "../../providers/event-provider";

/*
  Generated class for the BusinessLicenceSearch page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-business-licence-search',
  templateUrl: 'business-licence-search.html',
  providers : [User,Program,SqlLite,EventProvider]
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
  public searchCriteriaDataElement : any;

  public vehicleData : any;
  public BusinessLicenceData : any;
  public dataElementIdToNameMapping : any = {};
  public businessLicenceVehicleDataElementId : string;

  //vehicle program
  public vehicleProgram : any;
  public vehicleProgramName : string;

  constructor(public navCtrl: NavController,public menuCtrl: MenuController,
              public Program : Program,public SqlLite:SqlLite,public EventProvider:EventProvider,
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
        if(programStageDataElement.dataElement.name.toLowerCase() == this.searchCriteria.toLowerCase()){
          this.searchCriteriaDataElement = programStageDataElement.dataElement;
        }
        if(programStageDataElement.dataElement.name.toLowerCase() == dataElementName.toLowerCase()){
          this.businessLicenceVehicleDataElementId = programStageDataElement.dataElement.id;
        }else {
          this.dataElementIdToNameMapping[programStageDataElement.dataElement.id] = programStageDataElement.dataElement.name
        }
      });
      this.loadingData = false;
    },error=>{
      this.loadingData=false;
      this.setToasterMessage("Fail to load business licence metadata");
    });
  }

  search(){
    if(this.businessLicenceNumber){
      if(this.searchCriteriaDataElement.id){
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
    this.setLoadingMessages("Please wait,while search for a business licence");
    this.EventProvider.findEventsByDataValue(this.searchCriteriaDataElement.id,this.businessLicenceNumber,this.businessLicenceProgram.id,this.currentUser).then((events:any)=>{
      if(events.length > 0){
        this.BusinessLicenceData = events[0];
        this.setLoadingMessages("Loading vehicle information");
        let vehicleId = "";
        events[0].dataValues.forEach((dataValue : any)=>{
          if(dataValue.dataElement == this.businessLicenceVehicleDataElementId){
            vehicleId = dataValue.value;
          }
        });
        if(vehicleId !=""){
          this.EventProvider.getEventById(vehicleId,this.currentUser).then((event:any)=>{
            if(event.event){
              this.vehicleData = event;
              this.loadingData = false;
            }else{
              this.loadingData = false;
              this.setToasterMessage("Vehicle has been not found");
            }
          },error=>{
            this.loadingData = false;
            this.setToasterMessage("Fail to load vehicle information");
          });
        }else{
          this.loadingData = false;
          this.setToasterMessage("Vehicle has been not found");
        }
      }else{
        this.loadingData = false;
        this.setToasterMessage("Business licence has been not found");
      }
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to search vehicle");
    });

  }

  getVehicleInformation(businessLicenceEvent){
    let vehicleIds = [];
    for(let index = 0;index < businessLicenceEvent.dataValues.length;index++){
      if(businessLicenceEvent.dataValues[index].dataElement == this.businessLicenceVehicleDataElementId){
        vehicleIds.push(businessLicenceEvent.dataValues[index].value);
      }
    }
    this.EventProvider.getEvents(vehicleIds,this.vehicleProgram.id,this.currentUser).then((events:any)=>{
      if(events.length > 0){
        this.vehicleData = events[0];
        this.loadingData = false;
      }else{
        this.loadingData = false;
        this.setToasterMessage("Vehicle has been not found");
      }
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to load vehicle information");
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
