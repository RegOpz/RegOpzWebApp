import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_COUNTRY = 'FETCH_COUNTRY';


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
