import { Injectable } from '@angular/core';

import {Observable} from 'rxjs/Rx';
import {HttpClient} from "./http-client";
import {SqlLite} from "./sql-lite";

/*
  Generated class for the Metadata provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Metadata {

  public multipleIdsData : any = [];

  constructor(public http: HttpClient,public sqlLite :SqlLite) {
  }

  saveMetadata(resource,resourceValues,databaseName){
    let promises = [];
    let self = this;

    return new Promise(function(resolve, reject) {
      if(resourceValues.length == 0){
        resolve();
      }
      resourceValues.forEach(resourceValue=>{
        promises.push(
          self.sqlLite.insertDataOnTable(resource,resourceValue,databaseName).then(()=>{
            //saving success
          },(error) => {
          })
        );
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve();
        },
        (error) => {
          reject(error.failure);
        })
    });
  }

  downloadMetadata(user,resource, resourceId, fields, filter){
    let self = this;
    let resourceUrl = self.getResourceUrl(resource, resourceId, fields, filter);
    return new Promise(function(resolve, reject) {
      self.http.get(resourceUrl,user).subscribe(response=>{
        response = response.json();
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }
  downloadMetadataByResourceIds(user,resource, resourceIds, fields, filter){
    let self = this;
    let data = [];
    let promises = [];

    return new Promise(function(resolve, reject) {
      self.multipleIdsData = [];
      resourceIds.forEach(resourceId=>{
        promises.push(
          self.downloadMetadata(user,resource, resourceId, fields, filter).then(response=>{
            data.push(response);
          },error=>{})
        );
      });
      Observable.forkJoin(promises).subscribe(() => {
          resolve(data);
        },
        (error) => {
          reject(error);
        })
    });
  }

  getResourceUrl(resource, resourceId, fields, filter){
    let url = '/api/' + resource;
    if (resourceId || resourceId != null) {
      url += "/" + resourceId + ".json?paging=false";
    } else {
      url += ".json?paging=false";
    }
    if (fields || fields != null) {
      url += '&fields=' + fields;
    }
    if (filter || filter != null) {
      url += '&filter=' + filter;
    }
    return url;
  }

}
