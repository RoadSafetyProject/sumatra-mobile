import { Injectable } from '@angular/core';
import {HttpClient} from "./http-client";
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EventProvider {

  constructor(private httpClient: HttpClient) {

  }


  findAndSetEventsToRelationDataValuesList(dataValuesList,programId,user){
    let self = this;
    let promises = [];

    return new Promise(function(resolve, reject){
      dataValuesList.forEach((dataValue:any,index:any)=>{
        promises.push(
          self.findEventsByDataValue(dataValue.dataElementId,dataValue.value,programId,user).then(event=>{
            dataValuesList[index].eventData = event;
          },error=>{
          })
        );
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve(dataValuesList);
        },
        error => {
          reject(error);
        }
      );

    });
  }

  /**
   * get event usin a ive datavalues
   * @param dataElementId
   * @param value
   * @param programId
   * @param user
   * @returns {Promise<T>}
     */
  findEventsByDataValue(dataElementId,value,programId,user){
    let self = this;
    let sqlViewUrl = "/api/sqlViews.json?filter=name:eq:Find Event";

    return new Promise(function(resolve, reject){
      self.httpClient.get(sqlViewUrl,user).subscribe(sqlViewData=>{
        sqlViewData = sqlViewData.json();
        self.getEventIdList(dataElementId,value,sqlViewData,programId,user).then(events=>{
          resolve(events);
        },error=>{
          reject(error);
        })
      },error=>{
        reject(error);
      });
    });


  }

  /**
   * get event list
   * @param dataElementId
   * @param value
   * @param sqlViewData
   * @param programId
   * @param user
     * @returns {Promise<T>}
     */
  getEventIdList(dataElementId,value,sqlViewData,programId,user){
    let self = this;
    let sqlViewEventsUrl = "/api/sqlViews/" + sqlViewData.sqlViews[0].id + "/data.json?var=dataElement:" + dataElementId + "&var=value:" + value;

    return new Promise(function(resolve, reject){
      self.httpClient.get(sqlViewEventsUrl,user).subscribe(eventsIdData=>{
        eventsIdData = eventsIdData.json();
        self.getEvents(eventsIdData,programId,user).then(events=>{
          resolve(events);
        },error=>{
          reject(error);
        })
      },error=>{
        reject(error);
      });
    });

  }

  /**
   *
   * @param eventsIdData
   * @param programId
   * @param user
   * @returns {Promise<T>}
     */
  getEvents(eventsIdData,programId,user){
    let eventIDs = [];
    let events = [];
    let self = this;
    eventsIdData.rows.forEach(row=>{
      if(row.length>0){
        eventIDs.push(row[0])
      }
    });

    return new Promise(function(resolve, reject){
      if (eventIDs.length >0) {
        let eventListUrl = "/api/events.json?program=" + programId + "&event=" + eventIDs.join(";");
        self.httpClient.get(eventListUrl,user).subscribe(eventListData=>{
          eventListData = eventListData.json();
          resolve(self.getEventList(eventListData));
        },error=>{
          reject(error);
        })
      }else{
        resolve(events);
      }
    });
  }

  /**
   *
   * @param eventListData
   * @returns {any}
     */
  getEventList(eventListData){
    return eventListData.events;
  }

}
