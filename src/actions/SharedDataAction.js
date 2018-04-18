import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_COUNTRY = 'FETCH_COUNTRY';
export let FETCH_COMPONENT = 'FETCH_COMPONENT';
export let TEST_CONNECTION = 'TEST_CONNECTION';


// TODO:
export function actionFetchCountries(country) {
  var url = BASE_URL + "shared-data/countries";
  url = country ? url + "?country=" + country : url;
  const request = axios.get(url);
  return {
    type: FETCH_COUNTRY,
    payload: request
  }
}

// TODO:
export function actionFetchComponents(component) {
  var url = BASE_URL + "shared-data/components";
  url = component ? url + "?component=" + component : url;
  const request = axios.get(url);
  return {
    type: FETCH_COMPONENT,
    payload: request
  }
}

// TODO:
export function actionTestConnection(connection) {
  var url = BASE_URL + "shared-data/testconnection";
  const request = axios.post(url, connection);
  return {
    type: TEST_CONNECTION,
    payload: request
  }
}
