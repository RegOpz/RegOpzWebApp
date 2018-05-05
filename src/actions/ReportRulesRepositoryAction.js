import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_REPOSITORY_REPORTS = 'FETCH_REPOSITORY_REPORTS';
export let FETCH_REPOSITORY_REPORT_TEMPLATE = 'FETCH_REPOSITORY_REPORT_TEMPLATE';
export let FETCH_REPOSITORY_REPORT_DRILLDOWN = 'FETCH_REPOSITORY_REPORT_DRILLDOWN';
export let INSERT_REPOSITORY_REPORT_RULE = 'INSERT_REPOSITORY_REPORT_RULE';
export let UPDATE_REPOSITORY_REPORT_RULE = 'UPDATE_REPOSITORY_REPORT_RULE';
export let FETCH_REPOSITORY_REPORT_CHANGE_HISTORY = 'FETCH_REPOSITORY_REPORT_CHANGE_HISTORY';


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

export function actionFetchReportData(report_id) {
  let curl = url + "/report/" + encodeURI(report_id);
  const request = axios.get(curl);
  return {
    type: FETCH_REPOSITORY_REPORT_TEMPLATE,
    payload: request
  }
}

export function actionRepoDrillDown(report_id, sheet_id, cell_id) {
  let curl = url + "/drilldown?report_id=" + encodeURI(report_id);
  curl += "&sheet_id=" + encodeURI(sheet_id)
  curl += "&cell_id=" + encodeURI(cell_id)
  const request = axios.get(curl);
  return {
    type: FETCH_REPOSITORY_REPORT_DRILLDOWN,
    payload: request
  }
}

export function actionInsertRuleData(data) {
  let curl = url + "/report/report-rule";
  const request = axios.post(curl,data);
  return {
    type: INSERT_REPOSITORY_REPORT_RULE,
    payload: request
  }
}

export function actionUpdateRuleData(data) {
  let curl = url + "/report/report-rule";
  const request = axios.put(curl,data);
  return {
    type: UPDATE_REPOSITORY_REPORT_RULE,
    payload: request
  }
}

export function actionFetchRepoReportChangeHistory(report_id, sheet_id, cell_id) {
  let curl = url + "/audit-list?report_id=" + report_id;
  curl = curl + (sheet_id ? "&sheet_id=" + sheet_id : "");
  curl = curl + (cell_id ? "&cell_id=" + cell_id : "");
  return {
    type: FETCH_REPOSITORY_REPORT_CHANGE_HISTORY,
    payload: axios.get(curl)
  }
}
