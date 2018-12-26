import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export let FETCH_CAPTURED_FREE_FORMAT_REPORT = 'FETCH_CAPTURED_FREE_FORMAT_REPORT';
export let UPDATE_CAPTURED_FREE_FORMAT_REPORT = 'UPDATE_CAPTURED_FREE_FORMAT_REPORT';

// TODO:
export function actionFetchFreeFormatReportData(report_id, reporting_date, version,report_snapshot,report_parameters) {
  let url = BASE_URL + "free-format-report/report/" + report_id;
  if(reporting_date){
    url+="?reporting_date="+reporting_date;
  }
  if(version){
    url+="&version="+version.toString();
  }
  if(version){
    url+="&report_snapshot="+encodeURIComponent(report_snapshot);
  }
  if(report_parameters){
    url+="&report_parameters="+encodeURIComponent(report_parameters);
  }

  const request = axios.get(url);
  //console.log(request);
  return {
    type: FETCH_CAPTURED_FREE_FORMAT_REPORT,
    payload: request
  }
}

// Update only the report def of free format report
export function actionUpdateFreeFormatReportData(report_id,reportData) {
  let url = BASE_URL + "free-format-report/report/" + report_id;
  const request = axios.put(url,reportData);
  //console.log(request);
  return {
    type: UPDATE_CAPTURED_FREE_FORMAT_REPORT,
    payload: request
  }
}
