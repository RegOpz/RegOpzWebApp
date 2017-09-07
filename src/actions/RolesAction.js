import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export let FETCH_ROLE_ACTION = 'FETCH_ROLE_ACTION';
export let FETCH_ONE_ROLE_ACTION = 'FETCH_ONE_ROLE_ACTION';
export let FETCH_PERMISSION_ACTION = 'FETCH_PERMISSION_ACTION';
export let UPDATE_ROLE_ACTION = 'UPDATE_ROLE_ACTION';
export let DELETE_ROLE_ACTION = 'DELETE_ROLE_ACTION';

// Target URL
const url = BASE_URL + "roles";

// TODO: Fetch Role Details from API
export function actionFetchRoles(role,inUseCheck) {
    let curl = url;
    let actionType = FETCH_ROLE_ACTION;
    if (typeof role !== 'undefined') {
        curl += `/${role}`;
        if (inUseCheck == "N"){
          curl += "?inUseCheck="+ inUseCheck
        }
        actionType = FETCH_ONE_ROLE_ACTION;
    }
    console.log("Fetching roles from API.");
    const request = axios.get(encodeURI(curl));
    console.log("Fetch roles request response:", request);
    return {
        type: actionType,
        payload: request
    };
}

// TODO: Get the list of Permissions available
export function actionFetchPermissions() {
    const purl = BASE_URL + "permissions";
    console.log("Fetching permissions from API.");
    const request = axios.get(encodeURI(purl));
    console.log("Fetch permissions request response:", request);
    return {
        type: FETCH_PERMISSION_ACTION,
        payload: request
    };
}

// TODO: Send role data to API
export function actionUpdateRoles(data) {
    if (typeof data !== 'undefined') {
        console.log("Sending roles to API.", data);
        const request = axios.post(encodeURI(url), data);
        console.log("Update roles request response:", request);
        return {
            type: UPDATE_ROLE_ACTION,
            payload: request
        };
    }
}

// TODO: Delete role data
export function actionDeleteRoles(role, comment) {
    if (typeof role !== 'undefined') {
        console.log("Deleting roles to API.", role, comment);
        let curl = url + `/${role}`;
        if (typeof comment !== 'undefined' && comment !== null) {
            curl += `?comment=${comment}`;
        }
        const request = axios.delete(encodeURI(curl));
        console.log("Delete roles request response:", request);
        return {
            type: DELETE_ROLE_ACTION,
            payload: request
        };
    }
}
