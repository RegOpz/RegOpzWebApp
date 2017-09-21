import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export const LOAD_DATA = 'LOAD_DATA';

// TODO:
export function actionLoadData(loadInfo) {
  let url = BASE_URL + "data-feed-management/load-data";
  console.log("in action actionLoadData ", loadInfo);
  const request = axios.post(url, loadInfo);
  return {
    type: LOAD_DATA,
    payload: request
  }
}
