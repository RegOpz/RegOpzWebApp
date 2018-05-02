import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_REPOSITORY_REPORTS = 'FETCH_REPOSITORY_REPORTS';


const url = BASE_URL + "report-rules-repo" ;
// TODO:
export function actionFetchReportCatalog(country) {
  let curl = url;
  curl += country ? "/" + country : '';
  const request = axios.get(curl);
  return {
    type: FETCH_REPOSITORY_REPORTS,
    payload: request
  }
}
