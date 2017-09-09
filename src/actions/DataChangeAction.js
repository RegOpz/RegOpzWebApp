import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export const FETCH_DATA_AUDIT_LIST='FETCH_DATA_AUDIT_LIST';
export const FETCH_DATA_RECORD_DETAIL='FETCH_DATA_RECORD_DETAIL';
export const POST_DATA_AUDIT_DECISION='POST_DATA_AUDIT_DECISION';

export function actionFetchDataAuditList(idList,tableName){
  let url=BASE_URL+"workflow/data-change/get-audit-list?1=1";
  url += idList ? "&id_list=" + idList : "" ;
  url += tableName ? "&table_name="+tableName : "" ;
  const request=axios.get(url);

  return {
    type:FETCH_DATA_AUDIT_LIST,
    payload:request
  };
}

export function actionFetchDataRecordDetail(table_name,id){
  const url=BASE_URL+`workflow/data-change/get-record-detail?table_name=${table_name}&id=${id}`
  const request=axios.get(url);

  return {
    type:FETCH_DATA_RECORD_DETAIL,
    payload:request
  };
}

export function actionPostDataAuditDecision(data){
  const url=BASE_URL+"workflow/data-change/audit-decision";
  const request=axios.post(url,data);

  return{
    type:POST_DATA_AUDIT_DECISION,
    payload:request
  }
}
