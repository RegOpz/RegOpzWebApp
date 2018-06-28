import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_OPERATION_LOG  = 'FETCH_OPERATION_LOG';

// Target URL
const url = BASE_URL + "fetch-operation-log";

// TODO:
export function actionFetchOperationLog(entity_type,entity_id) {
  let curl = url;
  let actionType = FETCH_OPERATION_LOG;
  curl += `?entity_type=${entity_type}&entity_id=${entity_id}`
  const request=axios.get(curl);
  return{
    type:actionType,
    payload:request
  };
}
