import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_RULES = 'FETCH_RULES';
export let INSERT_RULES = 'INSERT_RULES';
export let DELETE_RULES = 'DELETE_RULES';
export let UPDATE_RULES = 'UPDATE_RULES';
export let FETCH_REPORT_LINKAGE = 'FETCH_REPORT_LINKAGE';

// TODO:
export function actionFetchBusinessRules(source_id,page, order) {
  var url = BASE_URL + "business-rules/" + page;
  url = source_id ? url + "/" + source_id : url;
  //console.log(url,source_id);  
  if (typeof order !== 'undefined' && order !== null) {
  	let direction = (order.direction) ? 'DESC':'ASC'
  	url = BASE_URL + "business-rules/" + page + '/orderby/' + order.colName
          + '?direction=' + direction;
  }
  const request = axios.get(url);
  return {
    type: FETCH_RULES,
    payload: request
  }
}

// TODO:
export function actionInsertBusinessRule(item, at) {
	const url = BASE_URL + "business-rules/0";
	console.log("item inserting ", item);
	const request = axios.post(url, item);
	console.log("post request response ", request);
	return {
		type: INSERT_RULES,
		payload: request,
		meta: { at: at }
	}
}
// TODO:
export function actionUpdateBusinessRule(item) {
	const url = BASE_URL + "business-rule";
	console.log("item updating", item);
	const request = axios.put(url + "/" + item['update_info']['id'], item);
	return {
		type: UPDATE_RULES,
		payload: { result:"updated" }
	}
}

// TODO:
export function actionDeleteBusinessRule(data,item, at) {
	const url = BASE_URL + "business-rule";
	console.log("item updating", item);
	const request = axios.put(url + "/" + item,data);
	return {
		type: DELETE_RULES,
		payload: request,
		meta:{ at:at }
	}
}

// TODO:
export function actionFetchReportLinkage(params) {
	const url = BASE_URL + "business-rule/linkage-multiple";
	const request = axios.post(url,params);
	return {
		type: FETCH_REPORT_LINKAGE,
		payload: request
	}
}
