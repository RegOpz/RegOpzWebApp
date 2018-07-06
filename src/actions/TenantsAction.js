import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let CHECK_TENANT_ACTION  = 'CHECK_TENANT_ACTION';
export let FETCH_TENANT_ACTION  = 'FETCH_TENANT_ACTION';
export let ADD_TENANT_ACTION  = 'ADD_TENANT_ACTION';
export let UPDATE_TENANT_ACTION  = 'UPDATE_TENANT_ACTION';

// Target URL
const url = BASE_URL + "subscription";

// TODO: Send user detail to API
export function actionFetchTenant(domainName,userCheck) {
  let curl = url;
  let actionType = FETCH_TENANT_ACTION;
  if (typeof domainName !== 'undefined') {
      curl += `/${domainName}` + (userCheck ? '?userCheck=Y' : '');
      actionType = CHECK_TENANT_ACTION;
  }
  const request=axios.get(curl);
  return{
    type:actionType,
    payload:request
  };
}

export function actionUpdateTenant(data) {
  // console.log("Inside actionUpdateTenant......", data);
  if (typeof data !== 'undefined') {
      let curl = url + `/${data.id}`;
      // console.log("Inside actionUpdateTenant......", curl,data);
      const request=axios.put(curl, data);
      return{
        type:UPDATE_TENANT_ACTION,
        payload:request
      };
  }
}

export function actionAddTenant(data) {
  console.log("Inside actionAddTenant......", data);
  if (typeof data !== 'undefined') {
      let curl = url;
      // console.log("Inside actionAddTenant......", curl,data);
      const request=axios.post(curl, data);
      return{
        type:ADD_TENANT_ACTION,
        payload:request
      };
  }
}
