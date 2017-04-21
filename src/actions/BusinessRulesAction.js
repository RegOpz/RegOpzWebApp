import axios from 'axios';
import {BASE_URL} from '../Constant/constant';
import promiseMiddleware from 'redux-promise';
export let FETCH_RULES = 'FETCH_RULES';
export let INSERT_RULES = 'INSERT_RULES';
export let DELETE_RULES = 'DELETE_RULES';
export let UPDATE_RULES = 'UPDATE_RULES';
export let FETCH_REPORT_LINKAGE = 'FETCH_REPORT_LINKAGE';
export function actionFetchBusinessRules(page, order){
  
  var url = BASE_URL + "business-rules/" + page;
  if (typeof order != 'undefined' && order != null){
  	let direction = (order.direction) ? 'DESC':'ASC'
  	url = BASE_URL + "business-rules/" + page + '/orderby/' + order.colName + '?direction=' + direction;
  }
  const request = axios.get(url);
  return{
    type:FETCH_RULES,
    payload:request
  }
}
export function actionInsertBusinessRule(item, at){	
	const url = BASE_URL + "business-rules/0";
	console.log("item inserting ", item);	
	const request = axios.post(url, item);
	console.log("post request response ", request)
	return {
		type:INSERT_RULES,
		payload:request,
		meta:{
			at:at
		}
	}
}
export function actionUpdateBusinessRule(item){	
	const url = BASE_URL + "business-rule";
	console.log("item updating", item);	
	const request = axios.put(url + "/" + item['id'], item);
	return {
		type:UPDATE_RULES,
		payload:{result:"updated"}
	}
}
export function actionDeleteBusinessRule(item, at){
	const url = BASE_URL + "business-rule";
	console.log("item updating", item);	
	const request = axios.delete(url + "/" + item);
	return {
		type:DELETE_RULES,
		payload:request,
		meta:{
			at:at
		}
	}
}

export function actionFetchReportLinkage(business_rule){
	const url = BASE_URL + "business-rule/linkage/" + business_rule;	
	const request = axios.get(url);
	return {
		type:FETCH_REPORT_LINKAGE,
		payload:request
	}
}
