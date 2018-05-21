import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export const FETCH_AUDIT_LIST='FETCH_AUDIT_LIST';
export const FETCH_AUDIT_HISTORY='FETCH_AUDIT_HISTORY';
export const FETCH_RECORD_DETAIL='FETCH_RECORD_DETAIL';
export const POST_AUDIT_DECISION='POST_AUDIT_DECISION';

export function actionFetchAuditList(idList,tableName, sourceId){
  const url=BASE_URL+`workflow/def-change/get-audit-list?id_list=${idList}`
            +`&table_name=${tableName}&source_id=${sourceId}`;
  const request=axios.get(url);
  const type= tableName ? FETCH_AUDIT_HISTORY : FETCH_AUDIT_LIST;

  return {
    type:type,
    payload:request
  };
}

export function actionFetchRecordDetail(table_name,id){
  const url=BASE_URL+`workflow/def-change/get-record-detail?table_name=${table_name}&id=${id}`
  const request=axios.get(url);

  return {
    type:FETCH_RECORD_DETAIL,
    payload:request
  };
}

export function actionPostAuditDecision(data){
  const url=BASE_URL+"workflow/def-change/audit-decision";
  const request=axios.post(url,data);

  return{
    type:POST_AUDIT_DECISION,
    payload:request
  }
}
