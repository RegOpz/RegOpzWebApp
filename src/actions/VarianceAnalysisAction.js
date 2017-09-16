import axios from 'axios';
import {BASE_URL} from '../Constant/constant';
export const FETCH_COUNTRY_LIST='FETCH_COUNTRY_LIST';
export const FETCH_REPORT_LIST='FETCH_REPORT_LIST';
export const FETCH_DATE_LIST_FIRST='FETCH_DATE_LIST_FIRST';
export const FETCH_DATE_LIST_SUBSEQUENT='FETCH_DATE_LIST_SUBSEQUENT';
export const SET_DATA_EXPORTED='SET_DATA_EXPORTED';
export const FETCH_VARIANCE_REPORT='FETCH_VARIANCE_REPORT';
export const SET_VARIANCE_CHART_DATA='SET_VARIANCE_CHART_DATA';

export function actionFetchCountryList(){

  let url=BASE_URL+"analytics/variance-analysis/get-country-suggestion-list";
  const request=axios.get(url);

  return {
    type:FETCH_COUNTRY_LIST,
    payload:request
  }

}

export function actionFetchReportList(country){
  let url=BASE_URL+"analytics/variance-analysis/get-report-suggestion-list";
  if(country){
    url=url+"?country="+country
  }
  const request=axios.get(url);

  return{
    type:FETCH_REPORT_LIST,
    payload:request
  }
}

export function actionFetchDateList(report_id,excluded_date=null){

  let url=BASE_URL+"analytics/variance-analysis/get-date-suggestion-list";
  url=url+"?report_id="+report_id+"&excluded_date="+excluded_date;
  const request=axios.get(url);

  if(!excluded_date){
    return {
      type:FETCH_DATE_LIST_FIRST,
      payload:request
    };
  }
  else{
    return {
      type:FETCH_DATE_LIST_SUBSEQUENT,
      payload:request
    };
  }
}

export function actionSetDataExported(data){
  return {
    type:SET_DATA_EXPORTED,
    payload:data
  };
}

export function actionFetchVarianceData(report_id,first_date,subsequent_date,variance_tolerance){
  let url=BASE_URL+"analytics/variance-analysis/get-variance-report";
  url=url+"?report_id="+report_id+"&first_date="+first_date+"&subsequent_date="+subsequent_date;
  url=url+"&variance_tolerance="+variance_tolerance;
  console.log("Inside actionFetchVarianceData",url)

  const request=axios.get(url);

  return {
    type:FETCH_VARIANCE_REPORT,
    payload:request
  };
}

export function actionSetVarianceChartData(data){
  let chartData=[];
  let i=0;

  for(let property in data.value){
    if(data.value.hasOwnProperty(property)){
        chartData.push({cell:data.cell,date:property,value:data.value[property]});
    }
  }

  //console.log(chartData);

  return {
    type:SET_VARIANCE_CHART_DATA,
    payload:chartData
  };


}
