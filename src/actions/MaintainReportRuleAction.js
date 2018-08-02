import axios from 'axios';
import {BASE_URL} from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export const FETCH_REPORT_TEMPLATE_LIST = 'FETCH_REPORT_TEMPLATE_LIST';
export const FETCH_BUSINESS_RULES_BY_SOURCE_ID = 'FETCH_BUSINESS_RULES_BY_SOURCE_ID';
export const FETCH_SOURCES = 'FETCH_SOURCES';
export const FETCH_SINGLE_SOURCE = 'FETCH_SINGLE_SOURCE';
export const FETCH_TABLE_COLUMNS_LIST = 'FETCH_TABLE_COLUMNS_LIST';
export const INSERT_MAINTAIN_RULE_DATA = 'INSERT_MAINTAIN_RULE_DATA';
export const UPDATE_MAINTAIN_RULE_DATA = 'UPDATE_MAINTAIN_RULE_DATA';
export const DELETE_MAINTAIN_RULE_DATA = 'DELETE_MAINTAIN_RULE_DATA';
export const EXPORT_REPORT_XLSX = "EXPORT_REPORT_XLSX";
export const EXPORT_REPORT_RULE_XLSX = "EXPORT_REPORT_RULE_XLSX";
export const FETCH_REPORT_CHANGE_HISTORY = "FETCH_REPORT_CHANGE_HISTORY";
export const COPY_REPORT_TEMPLATE = 'COPY_REPORT_TEMPLATE';
export const CHECK_REPORT_ID = 'CHECK_REPORT_ID';

// TODO:
export function actionFetchReportTemplate(reports, country) {
  let url = BASE_URL + "document/get-report-template-suggestion-list?";
  console.log("[" + reports + "]");
  if (typeof(reports) !== 'undefined' && reports.length !== 0) {
    url += `reports=${reports}&`;
  }
  if (typeof(country) !== 'undefined') {
    url += `country=${country}&`;
  }
  console.log(url);
  const request = axios.get(url);
  return{
    type: FETCH_REPORT_TEMPLATE_LIST,
    payload: request
  }
}

// TODO:
export function actionFetchBusinessRulesBySourceId(sourceId) {
  let url = BASE_URL + `report-rule/get-business-rules-suggestion-list?source_id=${sourceId}`;
  const request = axios.get(url);
  return {
    type: FETCH_BUSINESS_RULES_BY_SOURCE_ID,
    payload: request
  }
}

// TODO:
export function actionFetchSources(sourceId) {
  let url = BASE_URL + `report-rule/get-source-suggestion-list`;
  if (sourceId) {
    console.log('in action',sourceId);
    url = url + `?source_id=${sourceId}`;
  }
  const request = axios.get(url);
  return {
    type: FETCH_SOURCES,
    payload: request
  }
}

// TODO:
export function actionFetchSourceColumnList(table_name,source_id) {
  let url = BASE_URL + `report-rule/get-agg-function-column-suggestion-list?table_name=${table_name}&source_id=${source_id}`;
  const request = axios.get(url);
  return {
    type:FETCH_TABLE_COLUMNS_LIST,
    payload:request
  }
}

// TODO:
export function actionInsertRuleData(data) {
  return {
    type: INSERT_MAINTAIN_RULE_DATA,
    payload: axios.post(BASE_URL + `report-rule`, data)
  }
}

// TODO:
export function actionUpdateRuleData(id, data) {

  console.log('Inside actionUpdateRuleData....:',data);
  return {
    type: UPDATE_MAINTAIN_RULE_DATA,
    payload: axios.put(BASE_URL + `report-rule/${id}`, data)
  }
}

// TODO:
export function actionDeleteRuleData(id,data) {
  const url = BASE_URL + `report-rule/${id}`;
  const payload=axios.put(url,data);

  return {
    type: DELETE_MAINTAIN_RULE_DATA,
    payload: payload
  }
}

export function actionExportXlsx(report_id,reporting_date,cell_format_yn){
  const url = BASE_URL + "view-report/get-report-export-to-excel?report_id=" + report_id
              + "&reporting_date=" + reporting_date
              + "&cell_format_yn=" + cell_format_yn;
  return{
    type:EXPORT_REPORT_XLSX,
    payload:axios.get(url)
  }
}

export function actionExportRulesXlsx(report_id){
  const url = BASE_URL + "report-rule/get-report-rule-export-to-excel?report_id=" + report_id;
  return{
    type:EXPORT_REPORT_RULE_XLSX,
    payload:axios.get(url)
  }
}

export function actionFetchReportChangeHistory(report_id, sheet_id, cell_id) {
  let url = BASE_URL + "report-rule/audit-list?report_id=" + report_id;
  url = url + (sheet_id ? "&sheet_id=" + sheet_id : "");
  url = url + (cell_id ? "&cell_id=" + cell_id : "");
  return {
    type: FETCH_REPORT_CHANGE_HISTORY,
    payload: axios.get(url)
  }
}

export function actionCopyReportTemplate(formElement) {
    console.log("inside action copyReportTemplate....",formElement);
    let url = BASE_URL+ "report-rules-repo/copy-report-template" ;
    const request = axios.post(url, formElement);
    return {
        type: COPY_REPORT_TEMPLATE,
        payload: request
    };
}
