import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let ADD_USER_ACTION    = 'ADD_USER_ACTION';
export let CHECK_USER_ACTION  = 'CHECK_USER_ACTION';
export let FETCH_USER_ACTION  = 'FETCH_USER_ACTION';
export let UPDATE_USER_ACTION = 'UPDATE_USER_ACTION';
export let DELETE_USER_ACTION = 'DELETE_USER_ACTION';

// Target URL
const url = BASE_URL + "users";

// TODO: Send user detail to API
export function actionAddUser(data) {
    console.log("Data recieved at Add User", data);
    const request = axios.post(url, data);
    console.log("Add users request response: ", request);
    return {
        type: ADD_USER_ACTION,
        payload: request
    };
}

// TODO: Fetch User Details from API
export function actionFetchUsers(user,userCheck) {
    let curl = url;
    let actionType = FETCH_USER_ACTION;
    if (typeof user !== 'undefined') {
        curl += `/${user}` + (userCheck ? '?userCheck=Y' : '');
        actionType = CHECK_USER_ACTION;
    }
    console.log("Fetching users from API.");
    const request = axios.get(curl);
    console.log("Fetch users request response: ", request);
    return {
        type: actionType,
        payload: request
    };
}

// TODO: Update User Details
export function actionUpdateUser(data) {
    if (typeof data !== 'undefined') {
        console.log("Data recieved at Update User", data);
        const request = axios.put(url, data);
        console.log("Update users request response: ", request);
        return {
            type: UPDATE_USER_ACTION,
            payload: request
        };
    }
}

// TODO: Delete User Details
export function actionDeleteUser(user) {
    if (typeof user !== 'undefined') {
        console.log("Data recieved at Delete User", user);
        const request = axios.delete(url + `/${user}`);
        console.log("Delete users request response: ", request);
        return {
            type: DELETE_USER_ACTION,
            payload: request
        };
    }
}
