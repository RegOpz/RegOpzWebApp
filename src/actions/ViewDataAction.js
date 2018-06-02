import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_DATES = "FETCH_DATES";
export let FETCH_REPORT_BY_DATE = "FETCH_REPORT_BY_DATE";
export let FETCH_DRILLDOWN_REPORT = "FETCH_DRILLDOWN_REPORT";
export let FETCH_DRILLDOWN_RULES_REPORT = "FETCH_DRILLDOWN_RULES_REPORT";
export let FETCH_TABLE_DATA_REPORT = "FETCH_TABLE_DATA_REPORT";
export let FETCH_SOURCE = "FETCH_SOURCE";
export let VIEW_DATA_FETCH_REPORT_LINKAGE = "VIEW_DATA_FETCH_REPORT_LINKAGE";
export let INSERT_SOURCE_DATA = "INSERT_SOURCE_DATA";
export let UPDATE_SOURCE_DATA = "UPDATE_SOURCE_DATA";
export let DELETE_SOURCE_ROW = "DELETE_SOURCE_ROW";
export let GENERATE_REPORT = "GENERATE_REPORT";
export let APPLY_RULES = "APPLY_RULES";
export let SET_FORM_DISPLAY_DATA="SET_FORM_DISPLAY_DATA";
export let RESET_FORM_DISPLAY_DATA="RESET_FORM_DISPLAY_DATA";
export let SET_FORM_DISPLAY_COLS="SET_FORM_DISPLAY_COLS";
export let FETCH_CHANGE_HISTORY="FETCH_CHANGE_HISTORY";
export let EXPORT_DATA_CSV = "EXPORT_DATA_CSV";
//This should move to ViewReport related container and action during code refactoring
export let FETCH_REPORT_CATALOG = "FETCH_REPORT_CATALOG";
export let LEFTMENUCLICK = 'LEFTMENUCLICK';

// TODO:
export function actionFetchDates(startDate='19000101',endDate='39991231', table_name) {
  console.log("Base url",BASE_URL + `view-data/get-date-heads?start_date=${startDate}&end_date=${endDate}&table_name=${table_name}`);
  return {
    type: FETCH_DATES,
    payload: axios.get(BASE_URL + `view-data/get-date-heads?start_date=${startDate}&end_date=${endDate}&table_name=${table_name}`)
  }
}

// TODO:
export function actionFetchReportFromDate(source_id, business_date, page,filter) {
  let url = BASE_URL + `view-data/report?source_id=${source_id}&business_date=${business_date}&page=${page}&filter=`+encodeURIComponent(filter)
  return {
    type: FETCH_REPORT_BY_DATE,
    payload: axios.get(url)
  }
}

// TODO:
export function actionFetchDrillDownReport(drill_info) {
  console.log('In the action drilldown',drill_info);
  return {
    type: FETCH_DRILLDOWN_REPORT,
    payload: axios.get(BASE_URL + `document/drill-down-data`,drill_info),
  }
}

// TODO:
export function actionFetchDrillDownRulesReport(rules, source_id, page) {
  console.log('In the action drilldown fetch rules ', rules, source_id, page);
  return {
    type: FETCH_DRILLDOWN_RULES_REPORT,
    payload: axios.get(BASE_URL + `business-rules/drill-down-rules?source_id=${source_id}&rules=${rules}&page=${page}`),
  }
}

// TODO:
export function actionFetchTableData(table, filter, page) {
  console.log('In the action fetch table data ', table, filter, page);
  return {
    type: FETCH_TABLE_DATA_REPORT,
    payload: axios.get(BASE_URL + `view-data/table-data?table=${table}&filter=${filter}&page=${page}`),
  }
}

// TODO:
export function actionDeleteFromSourceData(id,data,at) {
  console.log("Inside actionDeleteFromSourceData.......",data);
  return {
    type: DELETE_SOURCE_ROW,
    payload: axios.put(BASE_URL + `view-data/report/${id}`,data),
    meta: { at:at }
  }
}

// TODO:
export function actionInsertSourceData(data, at) {
  return {
    type:INSERT_SOURCE_DATA,
    payload: axios.post(BASE_URL + `view-data/report`, data),
    meta: { at:at }
  }
}

// TODO:
export function actionUpdateSourceData(data) {
  return {
    type: UPDATE_SOURCE_DATA,
    payload: axios.put(BASE_URL + `view-data/report/${data.update_info['id']}`, data),
  }
}

// TODO:
export function actionFetchSource(startDate='19000101',endDate='39991231', catalog_type) {
  return {
    type: FETCH_SOURCE,
    payload: axios.get(BASE_URL + "view-data/get-sources?startDate=" + startDate + "&endDate=" + endDate + "&catalog_type=" + catalog_type)
  }
}

// TODO:
export function actionFetchReportLinkage(id, qualifying_key, business_date) {
  return {
    type: VIEW_DATA_FETCH_REPORT_LINKAGE,
    payload: axios.get(`${BASE_URL}view-data/get-report-linkage?source_id=${id}&qualifying_key=${qualifying_key}&business_date=${business_date}`)
  }
}

// TODO:
export function actionGenerateReport(report_info) {
  return {
    type: GENERATE_REPORT,
    payload: axios.post(BASE_URL+`view-data/generate-report`,report_info)
  }
}

// TODO:
export function actionApplyRules(source_info) {
  return {
    type: APPLY_RULES,
    payload: axios.post(BASE_URL+`view-data/apply-rules`,source_info)
  }
}

export function actionSetDisplayData(selectedItem){
  return{
    type:SET_FORM_DISPLAY_DATA,
    payload:selectedItem
  }
}

export function actionResetDisplayData(){
  return{
    type:RESET_FORM_DISPLAY_DATA,
    payload:{}
  }
}

export function actionSetDisplayCols(cols,table_name){
  return {
    type:SET_FORM_DISPLAY_COLS,
    payload:{'cols':cols,'table_name':table_name}
  }
}

export function actionFetchDataChangeHistory(table_name, id_list, business_date) {
  let url = BASE_URL + "workflow/data-change/get-audit-list?table_name=" + table_name;
  url = url + (id_list ? "&id_list=" + id_list : "");
  url = url + (business_date ? "&business_date=" + business_date : "");
  return {
    type: FETCH_CHANGE_HISTORY,
    payload: axios.get(url)
  }
}

export function actionExportCSV(table_name,business_ref,sql){
  let url = `${BASE_URL}view-data/report/export-csv?table_name=${table_name}&business_ref=${business_ref}&sql=`+encodeURIComponent(sql)
  return{
    type:EXPORT_DATA_CSV,
    payload:axios.get(url)
  }
}

export function actionFetchReportCatalog(reporting_date_start, reporting_date_end,reporting_date){
  let url = BASE_URL + "view-report/get-report-list?"
  if (reporting_date){ url = url + "reporting_date="+ reporting_date }
  if (reporting_date_start){url = url + "reporting_date_start="+ reporting_date_start}
  if (reporting_date_end){url = url + "&reporting_date_end="+ reporting_date_end}
  return{
    type:FETCH_REPORT_CATALOG,
    payload:axios.get(url)
  }
}


// TODO: Logout action for user
export function actionLeftMenuClick(isLeftMenu) {
  return {
    type: LEFTMENUCLICK,
    payload: isLeftMenu
  };
}
