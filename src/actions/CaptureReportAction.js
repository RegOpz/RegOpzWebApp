import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export let FETCH_CAPTURED_REPORT = 'FETCH_CAPTURED_REPORT';
export let DRILL_DOWN = 'DRILL_DOWN';

// TODO:
export function actionFetchReportData(report_id, reporting_date, version,report_snapshot,report_parameters) {
  let url = BASE_URL + "view-report/report/" + report_id;
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
    type: FETCH_CAPTURED_REPORT,
    payload: request
  }
}

// TODO:
export function actionDrillDown(report_id, sheet_id, cell_id) {
  let uri = `${BASE_URL}document/drill-down?report_id=${report_id}&sheet_id=${sheet_id}&cell_id=${cell_id}`;
  let urlEncodedURI = encodeURI(uri);
  const request = axios.get(urlEncodedURI);
  console.log(request)
  return {
    type: DRILL_DOWN,
    payload: request
  }
}
