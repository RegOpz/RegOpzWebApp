import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_REPOSITORY_RULES = 'FETCH_REPOSITORY_RULES';
export let INSERT_REPOSITORY_RULES = 'INSERT_REPOSITORY_RULES';
export let UPDATE_REPOSITORY_RULES = 'UPDATE_REPOSITORY_RULES';
export let DELETE_REPOSITORY_RULES = 'DELETE_REPOSITORY_RULES';
export let COPY_REPOSITORY_RULES_TO_TENANT = 'COPY_REPOSITORY_RULES_TO_TENANT';

const url = BASE_URL + "business-rules-repo" ;
// TODO:
export function actionFetchBusinessRules(country,rule) {
  let curl = url;
  curl += country ? "?country=" + country : '';
  curl += rule ? "&rule=" + encodeURI(rule) : '';
  const request = axios.get(curl);
  return {
    type: FETCH_REPOSITORY_RULES,
    payload: request
  }
}

// TODO:
export function actionInsertBusinessRule(item) {
	const request = axios.post(url, item);
	return {
		type: INSERT_REPOSITORY_RULES,
		payload: request
	}
}
// TODO:
export function actionUpdateBusinessRule(item) {
	const request = axios.put(url, item);
	return {
		type: UPDATE_REPOSITORY_RULES,
		payload: request
	}
}

// TODO:
export function actionCopyBusinessRuleToTenant(data,tenantSourceId) {
  let curl = url + "/copy-to-tenant/" + tenantSourceId;
	const request = axios.post(curl, data);
	return {
		type: COPY_REPOSITORY_RULES_TO_TENANT,
		payload: request
	}
}

// TODO:
export function actionDeleteBusinessRule(item) {
  const request = axios.put(url, item);
	return {
		type: DELETE_REPOSITORY_RULES,
		payload: request
	}
}

// TODO:
export function actionFetchReportLinkage(source_id,rules) {
	const url = BASE_URL + "business-rule/linkage-multiple?source_id=" + source_id + "&rules=" + rules;
	const request = axios.get(url);
	return {
		type: FETCH_REPORT_LINKAGE,
		payload: request
	}
}

export function actionExportCSV(source_id){
  const url= BASE_URL + "business-rule/export_to_csv" + (source_id ? "?source_id=" + source_id : "")
  return{
    type:EXPORT_RULES_CSV,
    payload:axios.get(url)
  }
}
