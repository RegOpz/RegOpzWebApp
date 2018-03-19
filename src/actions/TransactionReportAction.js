import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export let FETCH_TRANS_REPORT_TEMPLATE = 'FETCH_TRANS_REPORT_TEMPLATE';
export let DEFINE_TRANS_REPORT_SEC = 'DEFINE_TRANS_REPORT_SEC';
export let FETCH_TRANS_REPORT_SEC = 'FETCH_TRANS_REPORT_SEC';


// TODO:
export function actionFetchTransReportTemplateData(report_id) {
  let url = BASE_URL + "transactionalReport/" + report_id;
  const request = axios.get(url);
  return {
    type: FETCH_TRANS_REPORT_TEMPLATE,
    payload: request
  }
}

export function actionTransReportDefineSec(sectionData) {
  let url = BASE_URL + "transactionalReport/defineSection";
  console.log("actionTransReportDefineSec...",sectionData);
  const request = axios.post(url, sectionData);

  return {
    type: DEFINE_TRANS_REPORT_SEC,
    payload: request
  }
}

export function actionFetchTransReportSecDef(reportId,sheetId,cellId) {
  let url = BASE_URL + "transactionalReport/getSection/"+ cellId + "?report_id="+encodeURI(reportId)+"&sheet_id="+encodeURI(sheetId);
  const request = axios.get(url);

  return {
    type: FETCH_TRANS_REPORT_SEC,
    payload: request
  }
}
