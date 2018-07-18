import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export let FETCH_TRANS_REPORT_TEMPLATE = 'FETCH_TRANS_REPORT_TEMPLATE';
export let DEFINE_TRANS_REPORT_SEC = 'DEFINE_TRANS_REPORT_SEC';
export let FETCH_TRANS_REPORT_SEC = 'FETCH_TRANS_REPORT_SEC';
export let FETCH_TRANS_REPORT_CALC_RULES = 'FETCH_TRANS_REPORT_CALC_RULES';
export let UPDATE_TRANS_REPORT_RULE ='UPDATE_TRANS_REPORT_RULE';
export let INSERT_TRANS_REPORT_RULE ='INSERT_TRANS_REPORT_RULE';
export let CREATE_TRANS_REPORT ='CREATE_TRANS_REPORT';
export let FETCH_TRANS_REPORT ='FETCH_TRANS_REPORT';
export let DELETE_TRANS_REPORT_RULE='DELETE_TRANS_REPORT_RULE';


// TODO:
export function actionFetchTransReportTemplateData(report_id) {
  let url = BASE_URL + "transactionalReport/" + report_id;
  const request = axios.get(url);
  return {
    type: FETCH_TRANS_REPORT_TEMPLATE,
    payload: request
  }
}

export function actionFetchTransReportData(report_id,reporting_date) {
  let url = BASE_URL + "transactionalReport/" + report_id + "/" + reporting_date;
  const request = axios.get(url);
  return {
    type: FETCH_TRANS_REPORT,
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

export function actionCreateTransReport(Data) {
  let url = BASE_URL + "transactionalReport/createTransReport/"+Data.report_id;
  console.log("actionTransReportDefineSec...",Data);
  const request = axios.post(url, Data);

  return {
    type: CREATE_TRANS_REPORT,
    payload: request
  }
}

export function actionTransReportUpdateRule(id,Data) {
  let url = BASE_URL + "transactionalReport/trans-report-rule/"+id;
  console.log("actionTransReportUpdateRule...",Data);
  const request = axios.put(url, Data);

  return {
    type: UPDATE_TRANS_REPORT_RULE,
    payload: request
  }
}

export function actionTransReportInsertRule(Data) {
  let url = BASE_URL + "transactionalReport/trans-report-rule";
  console.log("actionTransReportInsertRule...",Data);
  const request = axios.post(url, Data);

  return {
    type: INSERT_TRANS_REPORT_RULE,
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

export function actionFetchTransReportSecRules(reportId,sheetId,cellId) {
  let url = BASE_URL + "transactionalReport/getRules/"+ cellId + "?report_id="+encodeURI(reportId)+"&sheet_id="+encodeURI(sheetId);
  const request = axios.get(url);

  return {
    type: FETCH_TRANS_REPORT_CALC_RULES,
    payload: request
  }
}

export function actionDeleteTransReportRules(data){
  let url = BASE_URL + "transactionalReport/trans-report-rule/bulk-process";
  console.log("actionDeleteTransReportRules...",data);
  const request = axios.post(url, data);
  console.log("I am here",request);

  return {
    type: DELETE_TRANS_REPORT_RULE,
    payload: request
  }
}
