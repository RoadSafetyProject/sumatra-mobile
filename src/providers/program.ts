import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {SqlLite} from "./sql-lite";

/*
  Generated class for the Program provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Program {

  public resourceName : string;
  constructor(public sqlLite : SqlLite) {
    this.resourceName = "programs";
  }

  /**
   * get program by using name of the given program
   * @param name
   * @param currentUser
   * @returns {Promise<T>}
     */
  getProgramByName(name,currentUser){
    let self = this;
    let attribute = "name";
    let attributeArray = [];
    let program = {};
    attributeArray.push(name);
    return  new Promise(function(resolve,reject){
      self.sqlLite.getDataFromTableByAttributes(self.resourceName,attribute,attributeArray,currentUser.currentDatabase).then((programs : any)=>{
       if(programs.length > 0){
          program = programs[0];
        }
        resolve(program);
      },error=>{
        reject();
      })
    });
  }

  getProgramId(id,currentUser){
    let self = this;
    let attribute = "id";
    let attributeArray = [];
    let program = {};
    attributeArray.push(id);
    return  new Promise(function(resolve,reject){
      self.sqlLite.getDataFromTableByAttributes(self.resourceName,attribute,attributeArray,currentUser.currentDatabase).then((programs : any)=>{
        if(programs.length > 0){
          program = programs[0];
        }
        resolve(program);
      },error=>{
        reject();
      })
    });
  }

}
