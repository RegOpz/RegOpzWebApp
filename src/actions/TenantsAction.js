import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let CHECK_TENANT_ACTION  = 'CHECK_USER_ACTION';

// Target URL
// const url = BASE_URL + "subscription";

// TODO: Send user detail to API
export function actionFetchTenant(domainName) {
  const url=BASE_URL+`subscription?domain=${domainName}`;
  const request=axios.get(url);
  return{
    type:CHECK_TENANT_ACTION,
    payload:request
  };
}
