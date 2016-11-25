import { Component } from '@angular/core';
import { NavController ,MenuController,ToastController} from 'ionic-angular';
import {User} from "../../providers/user";
import {HttpClient} from "../../providers/http-client";
import {AppProvider} from "../../providers/app-provider";
import {HomePage} from "../home/home";
import {SqlLite} from "../../providers/sql-lite";
import {Metadata} from "../../providers/metadata";
import { Storage } from '@ionic/storage';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers : [AppProvider,HttpClient,User,SqlLite,Metadata]
})
export class LoginPage {

  public loginData : any ={};
  public loadingData : boolean = false;
  public loadingMessages : any = [];

  constructor(public navCtrl: NavController,public menuCtrl: MenuController,
              public httpClient : HttpClient,public user : User,public Storage: Storage,
              public sqlLite : SqlLite,public Metadata : Metadata,
              public toastCtrl: ToastController,public app : AppProvider) {

    this.loginData.logoUrl = 'assets/img/loginLogo.png';
    this.loginData.serverUrl = "192.168.43.62:8080/demo";
    this.loginData.username = "admin";
    this.loginData.password = "IROAD2015";

    this.menuCtrl.enable(false);
    this.user.getCurrentUser().then(user=>{
      this.reAuthenticateUser(user);
    });
  }

  ionViewDidLoad() {}

  reAuthenticateUser(user){
    if(user){
      if(user.isLogin){
        this.loginData = user;
        this.setLandingPage();
      }else if(user.serverUrl){
        this.loginData.serverUrl = user.serverUrl;
        if(user.username){
          this.loginData.username = user.username;
        }
      }
    }
  }

  login(){
    if(this.loginData.serverUrl){
      this.app.getFormattedBaseUrl(this.loginData.serverUrl).then(formattedBaseUrl=>{
        this.loginData.serverUrl = formattedBaseUrl;
        if(!this.loginData.username){
          this.setToasterMessage('Please Enter username');
          alert(this.loginData.password)
        }else if (!this.loginData.password){
          this.setToasterMessage('Please Enter password');
        }else{
          this.loadingData = true;
          this.loadingMessages = [];
          this.app.getDataBaseName(this.loginData.serverUrl).then(databaseName=>{
            this.loginData.currentDatabase = databaseName;
            this.setLoadingMessages('Open database');
            this.sqlLite.generateTables(databaseName).then(()=>{
              //set authorization key and reset password
              this.loginData.authorizationKey = btoa(this.loginData.username + ':' + this.loginData.password);
              this.loginData.password = "";
              this.user.setCurrentUser(this.loginData).then(()=>{
                this.setLoadingMessages('Authenticating user');
                this.user.authenticateUser(this.loginData).then(response=>{
                  this.user.setUserData(response).then(userData=>{
                    this.setLoadingMessages('Loading system information');
                    this.httpClient.get('/api/system/info',this.loginData).subscribe(
                      data => {
                        data = data.json();
                        this.user.setCurrentUserSystemInformation(data).then(()=>{
                          this.downLoadPrograms();
                        },error=>{
                          this.loadingData = false;
                          this.setLoadingMessages('Fail to set system information');
                        });
                      },error=>{
                        this.loadingData = false;
                        this.setLoadingMessages('Fail to load system information');
                      })
                  })
                },error=>{
                  this.loadingData = false;
                  this.setToasterMessage('Fail to login Fail to load System information, please checking your network connection or username and password');
                });
              })
            },error=>{
              this.loadingData = false;
              this.setToasterMessage('Fail to open database');
            });
          });
        }
      });
    }else {
      this.setToasterMessage('Please Enter server url');
    }
  }

  downLoadPrograms(){
    this.setLoadingMessages('Downloading programs');
    let resource = 'programs';
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    this.Metadata.downloadMetadata(this.loginData,resource,null,fields,null).then(response=>{
      this.setLoadingMessages('Saving '+response[resource].length+' programs');
      this.Metadata.saveMetadata(resource,response[resource],this.loginData.currentDatabase).then(()=>{
        this.setLandingPage();
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to save programs. ' + JSON.stringify(error));
      });
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to download programs. ' + JSON.stringify(error));
    });
  }

  setLandingPage(){
    this.loginData.isLogin = true;
    this.user.setCurrentUser(this.loginData).then(()=>{
      this.navCtrl.setRoot(HomePage);
    });
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

}
