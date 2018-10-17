import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let GET_ALL_SEC_QUESTION = 'GET_ALL_SEC_QUESTION';
export let GET_USER_SEC_QUESTION = 'GET_USER_SEC_QUESTION';
export let VALIDATE_USER_SEC_QUESTION = 'VALIDATE_USER_SEC_QUESTION';

// TODO: Send Username and Password for login
export function actionGetAllSecQuestion() {
  var url = BASE_URL + "pwd-recovery/get-all-security-questions";
  const request = axios.get(url);
  return {
    type: GET_ALL_SEC_QUESTION,
    payload: request
  };
}

export function actionGetUserSecQuestion(username) {
  var url = BASE_URL + "pwd-recovery/get-user-security-questions/" + encodeURI(username);
  const request = axios.get(url);
  return {
    type: GET_USER_SEC_QUESTION,
    payload: request
  };
}

export function actionValidateUserSecQuestion(data) {
  var url = BASE_URL + "pwd-recovery/validate-pwd-recovery-answers";
  const request = axios.post(url, data);
  return {
    type: VALIDATE_USER_SEC_QUESTION,
    payload: request
  };
}
