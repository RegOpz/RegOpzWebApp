import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';
import {setTenantDetail} from '../utils/setAuthorization';

export let LOGIN_REQUEST = 'LOGIN_REQUEST';
export let LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export let LOGIN_FAILURE = 'LOGIN_FAILURE';
export let LOGIN_CHECK   = 'LOGIN_CHECK';
export let LOGOUT        = 'LOGOUT';
export let DOMAIN_REQUEST='DOMAIN_REQUEST';
export let SET_DOMAIN = 'SET_DOMAIN';

// TODO: Send Username and Password for login
export function actionLoginRequest(data) {
  var url = BASE_URL + "users";
  console.log("Data recieved for login: ", data);
  // setTenantDetail(JSON.stringify(data.domainInfo));
  const request = axios.post(url, null, { headers: { Authorization: 'Basic ' + btoa(`${data.username}:${data.password}`) }});
  console.log("Login request response: ", request);
  return {
    type: LOGIN_REQUEST,
    payload: request
  };
}

// TODO: Relogin if local storage have token already
export function actionRelogin(token) {
  return {
    type: LOGIN_CHECK,
    payload: token
  };
}

// TODO: Logout action for user
export function actionLogout() {
  return {
    type: LOGOUT
  };
}

export function actionDomainRequest(domainName){
  const url=BASE_URL+`subscription?domain=${domainName}`;
  const request=axios.get(url);
  return{
    type:DOMAIN_REQUEST,
    payload:request
  };
}

export function actionSetDomain(domainInfo) {
  console.log("Data recieved for login: ", domainInfo);
  setTenantDetail(JSON.stringify(domainInfo));
  return {
    type: SET_DOMAIN
  };
}
