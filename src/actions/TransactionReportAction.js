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
export let FETCH_TRANS_REPORT_CHANGE_HISTORY='FETCH_TRANS_REPORT_CHANGE_HISTORY';
export let EXPORT_TRNASREPORT_XLSX = 'EXPORT_TRNASREPORT_XLSX';


// TODO:
export function actionFetchTransReportTemplateData(report_id, country, db_obj_suffix) {
  let url = BASE_URL + "transactionalReport/" + encodeURI(report_id);
  url = url + "?country=" + country + "&domain_type=" + db_obj_suffix;
  const request = axios.get(url);
  return {
    type: FETCH_TRANS_REPORT_TEMPLATE,
    payload: request
  }
}

export function actionFetchTransReportData(report_id,reporting_date, version) {
  let url = BASE_URL + "transactionalReport/" + report_id + "/" + reporting_date;
  url += "?version=" + version;
  const request = axios.get(url);
  return {
    type: FETCH_TRANS_REPORT,
    payload: request
  }
}

export function actionTransReportDefineSec(sectionData,domain_type) {
  let url = BASE_URL + "transactionalReport/defineSection";
  url += "?domain_type=" + domain_type;
  console.log("actionTransReportDefineSec...",sectionData);
  const request = axios.post(url, sectionData);

  return {
    type: DEFINE_TRANS_REPORT_SEC,
    payload: request
  }
}

export function actionCreateTransReport(Data) {
  let url = BASE_URL + "transactionalReport/createTransReport/"+Data.report_id;
  console.log("actionCreateTransReport...",Data);
  const request = axios.post(url, Data);

  return {
    type: CREATE_TRANS_REPORT,
    payload: request
  }
}

export function actionTransReportUpdateRule(id,Data,domain_type) {
  let url = BASE_URL + "transactionalReport/trans-report-rule/"+id+"?domain_type=" + domain_type;
  console.log("actionTransReportUpdateRule...",Data,domain_type);
  const request = axios.put(url, Data);

  return {
    type: UPDATE_TRANS_REPORT_RULE,
    payload: request
  }
}

export function actionTransReportInsertRule(Data,domain_type) {
  let url = BASE_URL + "transactionalReport/trans-report-rule?domain_type=" + domain_type;
  console.log("actionTransReportInsertRule...",Data,domain_type);
  const request = axios.post(url, Data);

  return {
    type: INSERT_TRANS_REPORT_RULE,
    payload: request
  }
}


export function actionFetchTransReportSecDef(reportId,sheetId,cellId,domain_type) {
  let url = BASE_URL + "transactionalReport/getSection/"+ cellId + "?report_id="+encodeURI(reportId)+"&sheet_id="+encodeURI(sheetId);
  url += "&domain_type="+domain_type;
  const request = axios.get(url);

  return {
    type: FETCH_TRANS_REPORT_SEC,
    payload: request
  }
}

export function actionFetchTransReportSecRules(reportId,sheetId,cellId,domain_type) {
  let url = BASE_URL + "transactionalReport/getRules/"+ cellId + "?report_id="+encodeURI(reportId)+"&sheet_id="+encodeURI(sheetId);
  url += "&domain_type="+domain_type;
  const request = axios.get(url);

  return {
    type: FETCH_TRANS_REPORT_CALC_RULES,
    payload: request
  }
}

export function actionDeleteTransReportRules(data,id){
  let url = BASE_URL + "transactionalReport/trans-report-rule/";
  let request = null;
  if (id){
    url += id;
    console.log("actionDeleteTransReportRules delete only one rule ...",id,data);
    request = axios.put(url, data);
  }
  else{
    url += "bulk-process";
    console.log("actionDeleteTransReportRules delete bulk rules ...",data);
    request = axios.post(url, data);
  }

  return {
    type: DELETE_TRANS_REPORT_RULE,
    payload: request
  }
}

export function actionFetchTransReportChangeHistory(report_id, sheet_id, section_id) {
  let url = BASE_URL + "transactionalReport/audit-list?report_id=" + report_id;
  url = url + (sheet_id ? "&sheet_id=" + sheet_id : "");
  url = url + (section_id ? "&section_id=" + section_id : "");
  return {
    type: FETCH_TRANS_REPORT_CHANGE_HISTORY,
    payload: axios.get(url)
  }
}

export function actionTransExportXlsx(report_id,reporting_date,cell_format_yn, selectedRecord){
  const url = BASE_URL + "transactionalReport/get-transreport-export-to-excel?report_id=" + report_id
              + "&reporting_date=" + reporting_date
              + "&cell_format_yn=" + cell_format_yn
              + "&report_snapshot=" + (selectedRecord ? encodeURIComponent(selectedRecord.report_snapshot) : "{}")
              + "&version=" + (selectedRecord ? selectedRecord.version : "0")
              + "&report_parameters=" + (selectedRecord ? encodeURIComponent(selectedRecord.report_parameters) : "{}");
  return{
    type:EXPORT_TRNASREPORT_XLSX,
    payload:axios.get(url)
  }
}
