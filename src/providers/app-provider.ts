import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { AppVersion } from 'ionic-native';
/*
  Generated class for the AppProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AppProvider {

  private formattedBaseUrl :string;

  constructor() {
  }

  getAppInformation(){
    let appInformation = {};
    let promises = [];

    return new Promise(function(resolve, reject) {
      promises.push(
        AppVersion.getAppName().then(appName=>{
          appInformation['appName'] = appName;
        })
      );
      promises.push(
        AppVersion.getPackageName().then(packageName=>{
          appInformation['packageName'] = packageName;
        })
      );
      promises.push(
        AppVersion.getVersionCode().then(versionCode=>{
          appInformation['versionCode'] = versionCode;
        })
      );
      promises.push(
        AppVersion.getVersionNumber().then(versionNumber=>{
          appInformation['versionNumber'] = versionNumber;
        })
      );

      Observable.forkJoin(promises).subscribe(() => {
          resolve(appInformation);
        },
        (error) => {
          reject();
        })
    });
  }

  getFormattedBaseUrl(url){
    this.formattedBaseUrl = "";
    let urlToBeFormatted : string ="",urlArray : any =[],baseUrlString : any;
    if (!(url.split('/')[0] == "https:" || url.split('/')[0] == "http:")) {
      urlToBeFormatted = "http://" + url;
    } else {
      urlToBeFormatted = url;
    }
    baseUrlString = urlToBeFormatted.split('/');
    for(let index in baseUrlString){
      if (baseUrlString[index]) {
        urlArray.push(baseUrlString[index]);
      }
    }
    this.formattedBaseUrl = urlArray[0] + '/';
    for (let i =0; i < urlArray.length; i ++){
      if(i != 0){
        this.formattedBaseUrl = this.formattedBaseUrl + '/' + urlArray[i];
      }
    }
    return Promise.resolve(this.formattedBaseUrl);
  }

  getDataBaseName(url){
    let databaseName = url.replace('://', '_').replace('/', '_').replace('.', '_').replace(':', '_');
    return Promise.resolve(databaseName);
  }


}
