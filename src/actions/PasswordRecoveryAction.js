import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let GET_ALL_SEC_QUESTION = 'GET_ALL_SEC_QUESTION';
export let GET_USER_SEC_QUESTION = 'GET_USER_SEC_QUESTION';
export let GET_PASSWORD_POLICY = 'GET_PASSWORD_POLICY';
export let SAVE_PASSWORD_POLICY = 'SAVE_PASSWORD_POLICY';
export let VALIDATE_USER_SEC_QUESTION = 'VALIDATE_USER_SEC_QUESTION';
export let GET_USER_OTP = 'GET_USER_OTP';
export let VALIDATE_USER_OTP = 'VALIDATE_USER_OTP';

// TODO: Send Username and Password for login
export function actionGetPasswordPolicy() {
  var url = BASE_URL + "pwd-recovery/get-password-policy";
  const request = axios.get(url);
  return {
    type: GET_PASSWORD_POLICY,
    payload: request
  };
}

export function actionSavePasswordPolicy(data,id) {
  var url = BASE_URL + "pwd-recovery/save-password-policy/"+ id;
  const request = axios.put(url,data);
  return {
    type: SAVE_PASSWORD_POLICY,
    payload: request
  };
}

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

export function actionGetUserOtp(username) {
  var url = BASE_URL + "pwd-recovery/generate-pwd-recovery-otp/" + encodeURI(username);
  const request = axios.get(url);
  return {
    type: GET_USER_OTP,
    payload: request
  };
}

export function actionValidateUserOtp(data) {
  var url = BASE_URL + "pwd-recovery/validate-pwd-recovery-otp";
  const request = axios.post(url, data);
  return {
    type: VALIDATE_USER_OTP,
    payload: request
  };
}
